#!/usr/bin/env node

'use strict';

const fs            = require('fs');
const path          = require('path');
const os            = require('os');
const https         = require('https');
const { execSync }  = require('child_process');

// ─── Config ──────────────────────────────────────────────────────────────────
const REPO         = 'Unit4-Engineering-Labs/IO_Agents';
const DEFAULT_REF  = { type: 'branch', value: 'main' };

function tarballUrl(ref) {
  const repoName = REPO.split('/')[1];
  if (ref.type === 'tag') {
    return {
      url:     `https://github.com/${REPO}/archive/refs/tags/${ref.value}.tar.gz`,
      dirName: `${repoName}-${ref.value.replace(/^v/, '')}`,  // GitHub strips leading 'v'
      label:   `tag ${ref.value}`,
    };
  }
  return {
    url:     `https://github.com/${REPO}/archive/refs/heads/${ref.value}.tar.gz`,
    dirName: `${repoName}-${ref.value}`,
    label:   `branch ${ref.value}`,
  };
}

// ─── ANSI helpers ────────────────────────────────────────────────────────────
const isTTY = process.stdout.isTTY;
const c = {
  bold:   s => isTTY ? `\x1b[1m${s}\x1b[0m`  : s,
  dim:    s => isTTY ? `\x1b[2m${s}\x1b[0m`  : s,
  green:  s => isTTY ? `\x1b[32m${s}\x1b[0m` : s,
  cyan:   s => isTTY ? `\x1b[36m${s}\x1b[0m` : s,
  yellow: s => isTTY ? `\x1b[33m${s}\x1b[0m` : s,
  red:    s => isTTY ? `\x1b[31m${s}\x1b[0m` : s,
};

// ─── Paths ───────────────────────────────────────────────────────────────────
const PKG_ROOT = path.resolve(__dirname, '..');

// ─── Utilities ───────────────────────────────────────────────────────────────
function prompt(question) {
  return new Promise(resolve => {
    const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer); });
  });
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    count += entry.isDirectory() ? countFiles(path.join(dir, entry.name)) : 1;
  }
  return count;
}

function ensureDir(p)          { fs.mkdirSync(p, { recursive: true }); }
function tick(label, detail)   { console.log(`  ${c.green('✔')} ${c.bold(label.padEnd(22))} ${c.dim(detail)}`); }
function skip(label, detail)   { console.log(`  ${c.yellow('─')} ${label.padEnd(22)} ${c.dim(detail)}`); }
function infoDone(msg)         { process.stdout.write(`\r  ${c.green('✔')} ${msg}\n`); }
function die(msg)              { console.error(`\n  ${c.red('✖')} ${msg}\n`); process.exit(1); }

// ─── Arg parser helper — reads value after a flag ────────────────────────────
function flagValue(args, flag) {
  const i = args.indexOf(flag);
  if (i === -1) return null;
  const val = args[i + 1];
  if (!val || val.startsWith('--')) die(`--${flag} requires a value`);
  return val;
}

// ─── Validate downloaded file is a real gzip ─────────────────────────────────
function isValidGzip(filePath) {
  try {
    const buf = Buffer.alloc(2);
    const fd  = fs.openSync(filePath, 'r');
    fs.readSync(fd, buf, 0, 2, 0);
    fs.closeSync(fd);
    return buf[0] === 0x1f && buf[1] === 0x8b;
  } catch { return false; }
}

// ─── Check that a source root has the expected framework structure ────────────
function isValidSrcRoot(srcRoot) {
  return fs.existsSync(path.join(srcRoot, 'io-agents', 'constitution.md'))
      || fs.existsSync(path.join(srcRoot, 'agents',    'constitution.md'));
}

// ─── Download via curl (preferred — handles GitHub redirects reliably) ────────
function downloadWithCurl(url, destPath) {
  return new Promise((resolve, reject) => {
    try {
      execSync(`curl -fsSL -o "${destPath}" "${url}"`, { stdio: 'pipe' });
      resolve();
    } catch (err) {
      reject(new Error('curl failed: ' + err.message));
    }
  });
}

// ─── GitHub download fallback (Node https — follows redirects manually) ───────
function downloadWithNode(url, destPath, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const parsedUrl = new URL(url);
    const proto     = parsedUrl.protocol === 'http:' ? require('http') : https;
    const options = {
      hostname: parsedUrl.hostname,
      path:     parsedUrl.pathname + parsedUrl.search,
      headers:  { 'User-Agent': 'vs-framework-cli' },
    };
    proto.get(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        res.resume();
        return resolve(downloadWithNode(res.headers.location, destPath, redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`GitHub returned HTTP ${res.statusCode}`));
      }
      let downloaded = 0;
      const file = fs.createWriteStream(destPath);
      res.on('data', chunk => {
        downloaded += chunk.length;
        const kb = (downloaded / 1024).toFixed(0);
        process.stdout.write(`\r  ${c.cyan('↓')} Fetching from GitHub...  ${c.dim(kb + ' KB')}`);
      });
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

// ─── Fetch from GitHub, return extracted source root ─────────────────────────
async function fetchFromGitHub(ref) {
  const { url, dirName, label } = tarballUrl(ref);
  const tmpDir  = fs.mkdtempSync(path.join(os.tmpdir(), 'vsf-'));
  const tarPath = path.join(tmpDir, 'framework.tar.gz');

  try {
    // Try curl first (more reliable on Windows), fall back to Node https
    let usedCurl = false;
    try {
      execSync('curl --version', { stdio: 'pipe' });
      await downloadWithCurl(url, tarPath);
      usedCurl = true;
    } catch {
      await downloadWithNode(url, tarPath);
    }

    infoDone(`Fetched ${label} from GitHub          `);

    // Validate it's actually a gzip before trying to extract
    if (!isValidGzip(tarPath)) {
      throw new Error('Downloaded file is not a valid archive — GitHub may have returned an error page. Check your connection and try again.');
    }

    process.stdout.write(`  ${c.cyan('↓')} Extracting...                  `);
    execSync('tar -xf framework.tar.gz', { cwd: tmpDir, stdio: 'pipe' });
    infoDone('Extracted                      ');

    const srcRoot = path.join(tmpDir, dirName);

    if (!fs.existsSync(srcRoot)) {
      // Fallback: find the first extracted directory
      const dirs = fs.readdirSync(tmpDir, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => path.join(tmpDir, e.name));
      if (!dirs.length) throw new Error('Could not locate extracted directory');
      return { srcRoot: dirs[0], tmpDir };
    }

    return { srcRoot, tmpDir };
  } catch (err) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw err;
  }
}

// ─── Version / Help ──────────────────────────────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));

function printHelp() {
  console.log(`
  ${c.bold('vs-framework')} v${pkg.version}

  ${c.dim('Usage:')}
    npx github:${REPO} ${c.cyan('init')} [project-name] [flags]
    npx github:${REPO} ${c.cyan('update')} [flags]
    node bin/vs-framework.js  ${c.cyan('<command>')} [flags]

  ${c.dim('Commands:')}
    ${c.cyan('init')} [name]    Add VS Framework to current dir, or create <name>/ first
    ${c.cyan('update')}         Update framework files (io-agents, skills, io-templates) — preserves your io-docs/

  ${c.dim('Source flags (mutually exclusive):')}
    --branch <name>  Fetch from a specific branch     (default: main)
    --tag <name>     Fetch a specific release tag      (e.g. v1.0.0)
    --offline        Use cached package — no download

  ${c.dim('Other flags (init only):')}
    --force          Overwrite existing files (including CLAUDE.md)
    --brownfield     Install into existing project (skip scaffolding, show onboarding guide)

  ${c.dim('Other flags (init + update):')}
    --no-copilot     Skip .github/ Copilot files (Claude Code only)
    --no-claude      Skip .claude/ skills (Copilot only)
    --help, -h       Show this help
    --version, -v    Show version

  ${c.dim('Examples:')}
    npx github:${REPO} init
    npx github:${REPO} init my-webapp
    npx github:${REPO} init --branch dev
    npx github:${REPO} init --tag v1.2.0
    npx github:${REPO} init my-webapp --tag v1.0.0 --no-copilot
    npx github:${REPO} init --brownfield
    npx github:${REPO} update
    npx github:${REPO} update --branch dev
`);
}

function printVersion() {
  console.log(`vs-framework v${pkg.version}`);
}

// ─── Banner ──────────────────────────────────────────────────────────────────
function printBanner(ref) {
  const source = ref.type === 'tag'
    ? c.dim(`tag ${ref.value}`)
    : ref.value === 'main'
      ? c.dim('latest · main')
      : c.dim(`branch ${ref.value}`);

  console.log();
  console.log(c.cyan('  ╔══════════════════════════════════════╗'));
  console.log(c.cyan('  ║') + c.bold('   VS Framework') + c.dim(`  v${pkg.version}`) + c.cyan('              ║'));
  console.log(c.cyan('  ║') + `   ${source}`.padEnd(40) + c.cyan('║'));
  console.log(c.cyan('  ╚══════════════════════════════════════╝'));
  console.log();
}

// ─── Copy framework files from srcRoot → dest ────────────────────────────────
function copyFramework(srcRoot, dest, { force, noCopilot, noClaude }) {

  const agentsDest = path.join(dest, 'io-agents');
  fs.cpSync(path.join(srcRoot, 'io-agents'), agentsDest, { recursive: true });
  tick('io-agents/', `${countFiles(agentsDest)} files`);

  if (!noClaude) {
    const claudeDest = path.join(dest, '.claude');
    fs.cpSync(path.join(srcRoot, '.claude'), claudeDest, { recursive: true });
    tick('.claude/skills/', `${countFiles(claudeDest)} files`);
  } else {
    skip('.claude/skills/', 'skipped (--no-claude)');
  }

  if (!noCopilot) {
    ensureDir(path.join(dest, '.github'));
    const githubDest = path.join(dest, '.github', 'copilot-agents');
    fs.cpSync(path.join(srcRoot, '.github', 'copilot-agents'), githubDest, { recursive: true });
    fs.copyFileSync(
      path.join(srcRoot, '.github', 'copilot-instructions.md'),
      path.join(dest, '.github', 'copilot-instructions.md')
    );
    tick('.github/', `${countFiles(githubDest) + 1} files`);
  } else {
    skip('.github/', 'skipped (--no-copilot)');
  }

  const tmplDest = path.join(dest, 'io-templates');
  fs.cpSync(path.join(srcRoot, 'io-templates'), tmplDest, { recursive: true });
  tick('io-templates/', `${countFiles(tmplDest)} files`);

  const claudeMdDest = path.join(dest, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdDest) || force) {
    fs.copyFileSync(path.join(srcRoot, 'CLAUDE.md'), claudeMdDest);
    tick('CLAUDE.md', '');
  } else {
    skip('CLAUDE.md', 'already exists (use --force to overwrite)');
  }

  ensureDir(path.join(dest, 'io-docs', 'architecture-decisions'));

  const today = new Date().toISOString().split('T')[0];

  const planPath = path.join(dest, 'io-docs', 'plan.md');
  if (!fs.existsSync(planPath)) {
    fs.writeFileSync(planPath, [
      '# Project Plan',
      '',
      `**Last updated**: ${today}`,
      '**Status**: Not started',
      '',
      '<!-- Elena (Planner) will fill this in.',
      '     Run /vs-plan create or /vs-john to begin. -->',
      '',
    ].join('\n'), 'utf8');
  }

  const memoryPath = path.join(dest, 'io-docs', 'memory.md');
  if (!fs.existsSync(memoryPath)) {
    fs.writeFileSync(memoryPath, [
      '# Project Memory',
      '',
      '> Living document. All agents read this before starting work and append learnings after completing work.',
      '> Format: `[YYYY-MM-DD] (Agent) Note`',
      '',
      `**Initialised**: ${today}`,
      '',
      '---',
      '',
      '## Stack & Environment',
      '',
      '<!-- Fill in after /vs-sofia and /vs-marcus -->',
      '',
      '## Conventions',
      '',
      '<!-- Project-specific deviations from language/framework defaults -->',
      '',
      '## Architecture Notes',
      '',
      '<!-- Informal decisions not worth a full ADR -->',
      '',
      '## Known Issues & Workarounds',
      '',
      '<!-- Format: [date] (Agent) Description ✓resolved / ⚠open -->',
      '',
      '## Gotchas',
      '',
      '<!-- Things that will bite you if you forget them -->',
      '',
      '## External Dependencies & Quirks',
      '',
      '<!-- Notes on third-party APIs and libraries -->',
      '',
      '## Session Log',
      '',
      `- [${today}] Project initialised with VS Framework`,
      '',
    ].join('\n'), 'utf8');
  }

  tick('io-docs/', 'plan.md + memory.md + architecture-decisions/');

  const gitignorePath = path.join(dest, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, [
      '# Dependencies',
      'node_modules/',
      '__pycache__/',
      '*.pyc',
      '*.pyo',
      '.venv/',
      'venv/',
      '',
      '# Environment variables — never commit real secrets',
      '.env',
      '.env.local',
      '.env.*.local',
      '',
      '# Build output',
      'dist/',
      'build/',
      '.next/',
      '*.egg-info/',
      '',
      '# Databases (local dev)',
      '*.db',
      '*.sqlite',
      '*.sqlite3',
      '',
      '# Logs',
      '*.log',
      'logs/',
      '',
      '# OS files',
      '.DS_Store',
      'Thumbs.db',
      'desktop.ini',
      '',
      '# IDE',
      '.idea/',
      '*.suo',
      '*.user',
      '',
      '# Testing',
      '.coverage',
      'htmlcov/',
      '.pytest_cache/',
      'coverage/',
      '',
    ].join('\n'), 'utf8');
    tick('.gitignore', 'created');
  } else {
    skip('.gitignore', 'already exists');
  }
}

// ─── init command ────────────────────────────────────────────────────────────
async function runInit(args) {
  const force      = args.includes('--force');
  const brownfield = args.includes('--brownfield');
  const noCopilot  = args.includes('--no-copilot');
  const noClaude   = args.includes('--no-claude');
  const offline    = args.includes('--offline');
  const branch     = flagValue(args, '--branch');
  const tag        = flagValue(args, '--tag');

  if (branch && tag) die('--branch and --tag are mutually exclusive. Use one or the other.');

  const ref = tag    ? { type: 'tag',    value: tag }
            : branch ? { type: 'branch', value: branch }
            : DEFAULT_REF;

  // Project name is the first non-flag arg that isn't a flag value
  const flagsWithValues = new Set(['--branch', '--tag']);
  const projectArg = args.find((a, i) =>
    !a.startsWith('--') && args[i - 1] !== '--branch' && args[i - 1] !== '--tag'
  );

  const dest = projectArg
    ? path.resolve(process.cwd(), projectArg)
    : process.cwd();

  if (projectArg) {
    if (fs.existsSync(dest)) die(`Directory already exists: ${dest}`);
    ensureDir(dest);
  }

  printBanner(ref);
  const mode = brownfield ? 'brownfield' : 'greenfield';
  console.log(`  ${c.dim('Initializing in:')} ${c.bold(dest)}  ${c.dim(`(${mode})`)}`);
  console.log();

  const alreadyInit = fs.existsSync(path.join(dest, 'io-agents', 'constitution.md'))
                   || fs.existsSync(path.join(dest, 'agents', 'constitution.md'));
  if (alreadyInit && !force) {
    console.log(`  ${c.yellow('⚠')}  VS Framework already found in this directory.`);
    console.log();
    const answer = await prompt(`  Update framework files? ${c.dim('(io-agents, skills, io-templates — your io-docs are safe)')} [Y/n] `);
    if (answer.trim().toLowerCase() === 'n') {
      console.log(`\n  ${c.dim('Cancelled. Use --force to overwrite everything including CLAUDE.md.')}\n`);
      process.exit(0);
    }
    console.log();
    return runUpdate(args);
  }

  let srcRoot = PKG_ROOT;
  let tmpDir  = null;

  if (!offline) {
    try {
      ({ srcRoot, tmpDir } = await fetchFromGitHub(ref));
    } catch (err) {
      console.log(`\n  ${c.yellow('⚠')}  Could not reach GitHub (${err.message})`);
      if (!isValidSrcRoot(PKG_ROOT)) {
        die('Cached package is outdated (missing io-agents/). Connect to the internet and try again, or upgrade npx cache:\n     npx --yes github:' + REPO + ' init');
      }
      console.log(`     ${c.dim('Falling back to cached package files...')}\n`);
      srcRoot = PKG_ROOT;
    }
  } else {
    if (!isValidSrcRoot(PKG_ROOT)) {
      die('Cached package is outdated (missing io-agents/). Remove --offline to fetch the latest version.');
    }
    console.log(`  ${c.dim('(--offline: using cached package files)')}\n`);
  }

  console.log();
  try {
    copyFramework(srcRoot, dest, { force, noCopilot, noClaude });
  } finally {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log();
  console.log(`  ${c.green(c.bold('Done!'))} Your VS Framework team is ready.\n`);

  const w   = 45;
  const box = (title, lines) => {
    console.log(`  ┌─ ${title} ${'─'.repeat(w - title.length - 2)}┐`);
    for (const l of lines) console.log(`  │  ${l.padEnd(w - 2)}│`);
    console.log(`  └${'─'.repeat(w + 1)}┘`);
    console.log();
  };

  if (brownfield) {
    // Brownfield-specific post-install guidance
    console.log(`  ${c.yellow('⚡')} ${c.bold('Brownfield mode')} — agents installed into your existing project.\n`);
    console.log(`  ${c.dim('Your existing code was NOT modified. Next, let the agents learn your codebase:')}\n`);

    if (!noClaude) {
      box('Claude Code — Onboard', [
        c.cyan('/vs-onboard') + '  full auto-onboarding      ',
        c.dim('  or step by step:') + '                    ',
        c.cyan('/vs-sofia') + ' discover                    ',
        c.cyan('/vs-marcus') + ' document                   ',
        c.cyan('/vs-plan') + ' create brownfield             ',
      ]);
    }
    if (!noCopilot) {
      box('GitHub Copilot — Onboard', [
        c.cyan('@vs-brainstorm') + ' discover              ',
        c.cyan('@vs-architect') + ' document               ',
        c.cyan('@vs-plan') + ' create brownfield             ',
      ]);
    }
  } else {
    // Greenfield post-install guidance (original)
    if (!noClaude) {
      box('Claude Code', [
        c.cyan('/vs-john') + '  "describe your task"      ',
        c.cyan('/vs-sofia') + ' new project idea           ',
        c.cyan('/vs-plan') + ' next                        ',
      ]);
    }
    if (!noCopilot) {
      box('GitHub Copilot', [
        c.cyan('@vs-john') + '  "describe your task"      ',
        c.cyan('@vs-brainstorm') + ' new project idea      ',
        c.cyan('@vs-plan') + ' next                        ',
      ]);
    }
  }
  if (projectArg) console.log(`  ${c.dim('Next:')} cd ${projectArg}\n`);
}

// ─── update command ──────────────────────────────────────────────────────────
async function runUpdate(args) {
  const noCopilot = args.includes('--no-copilot');
  const noClaude  = args.includes('--no-claude');
  const offline   = args.includes('--offline');
  const branch    = flagValue(args, '--branch');
  const tag       = flagValue(args, '--tag');

  if (branch && tag) die('--branch and --tag are mutually exclusive. Use one or the other.');

  const ref = tag    ? { type: 'tag',    value: tag }
            : branch ? { type: 'branch', value: branch }
            : DEFAULT_REF;

  const dest = process.cwd();

  // Must already be a VS Framework project (check both new and legacy paths)
  const hasFramework = fs.existsSync(path.join(dest, 'io-agents', 'constitution.md'))
                    || fs.existsSync(path.join(dest, 'agents', 'constitution.md'));
  if (!hasFramework) {
    die('No VS Framework found in this directory.\n     Run init first: npx github:' + REPO + ' init');
  }

  printBanner(ref);
  console.log(`  ${c.dim('Updating in:')} ${c.bold(dest)}`);
  console.log(`  ${c.dim('Updates: io-agents/, .claude/, .github/copilot-agents/, io-templates/')}`);
  console.log(`  ${c.dim('Preserved: io-docs/, CLAUDE.md, .gitignore, .env*')}`);
  console.log();

  let srcRoot = PKG_ROOT;
  let tmpDir  = null;

  if (!offline) {
    try {
      ({ srcRoot, tmpDir } = await fetchFromGitHub(ref));
    } catch (err) {
      console.log(`\n  ${c.yellow('⚠')}  Could not reach GitHub (${err.message})`);
      if (!isValidSrcRoot(PKG_ROOT)) {
        die('Cached package is outdated (missing io-agents/). Connect to the internet and try again, or clear the npx cache and re-run.');
      }
      console.log(`     ${c.dim('Falling back to cached package files...')}\n`);
      srcRoot = PKG_ROOT;
    }
  } else {
    if (!isValidSrcRoot(PKG_ROOT)) {
      die('Cached package is outdated (missing io-agents/). Remove --offline to fetch the latest version.');
    }
    console.log(`  ${c.dim('(--offline: using cached package files)')}\n`);
  }

  console.log();
  try {
    // io-agents/ — always update
    const agentsDest = path.join(dest, 'io-agents');
    fs.cpSync(path.join(srcRoot, 'io-agents'), agentsDest, { recursive: true });
    tick('io-agents/', `${countFiles(agentsDest)} files`);

    // .claude/ — update unless --no-claude
    if (!noClaude) {
      const claudeDest = path.join(dest, '.claude');
      fs.cpSync(path.join(srcRoot, '.claude'), claudeDest, { recursive: true });
      tick('.claude/skills/', `${countFiles(claudeDest)} files`);
    } else {
      skip('.claude/skills/', 'skipped (--no-claude)');
    }

    // .github/copilot-agents/ — update unless --no-copilot
    if (!noCopilot) {
      const githubSrc  = path.join(srcRoot, '.github', 'copilot-agents');
      const githubDest = path.join(dest, '.github', 'copilot-agents');
      ensureDir(path.join(dest, '.github'));
      fs.cpSync(githubSrc, githubDest, { recursive: true });
      fs.copyFileSync(
        path.join(srcRoot, '.github', 'copilot-instructions.md'),
        path.join(dest, '.github', 'copilot-instructions.md')
      );
      tick('.github/', `${countFiles(githubDest) + 1} files`);
    } else {
      skip('.github/', 'skipped (--no-copilot)');
    }

    // io-templates/ — always update
    const tmplDest = path.join(dest, 'io-templates');
    fs.cpSync(path.join(srcRoot, 'io-templates'), tmplDest, { recursive: true });
    tick('io-templates/', `${countFiles(tmplDest)} files`);

    // Skipped items (user-owned)
    skip('CLAUDE.md', 'preserved (yours)');
    skip('io-docs/', 'preserved (yours)');
    skip('.gitignore', 'preserved (yours)');
  } finally {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log();
  console.log(`  ${c.green(c.bold('Done!'))} Framework files updated to latest.\n`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
const [,, command, ...rest] = process.argv;

if (!command || command === '--help' || command === '-h') {
  printHelp();
} else if (command === '--version' || command === '-v') {
  printVersion();
} else if (command === 'init') {
  runInit(rest).catch(err => die(err.message));
} else if (command === 'update') {
  runUpdate(rest).catch(err => die(err.message));
} else {
  console.error(`\n  Unknown command: ${command}\n  Run with --help for usage.\n`);
  process.exit(1);
}
