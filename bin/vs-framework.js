#!/usr/bin/env node

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── ANSI helpers ────────────────────────────────────────────────────────────
const isTTY  = process.stdout.isTTY;
const c = {
  reset:  s => isTTY ? `\x1b[0m${s}\x1b[0m`  : s,
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
function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count += countFiles(path.join(dir, entry.name));
    else count++;
  }
  return count;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function tick(label, detail) {
  console.log(`  ${c.green('✔')} ${c.bold(label.padEnd(22))} ${c.dim(detail)}`);
}

function skip(label, detail) {
  console.log(`  ${c.yellow('─')} ${label.padEnd(22)} ${c.dim(detail)}`);
}

function die(msg) {
  console.error(`\n  ${c.red('✖')} ${msg}\n`);
  process.exit(1);
}

// ─── Version / Help ──────────────────────────────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));

function printHelp() {
  console.log(`
  ${c.bold('vs-framework')} v${pkg.version}

  ${c.dim('Usage:')}
    npx github:capitolino/MyAgents ${c.cyan('init')} [project-name] [flags]
    node bin/vs-framework.js     ${c.cyan('init')} [project-name] [flags]

  ${c.dim('Commands:')}
    ${c.cyan('init')} [name]    Add VS Framework to current dir, or create <name>/ first

  ${c.dim('Flags:')}
    --force        Overwrite existing files (including CLAUDE.md)
    --no-copilot   Skip .github/ Copilot files (Claude Code only)
    --no-claude    Skip .claude/ skills (Copilot only)
    --help, -h     Show this help
    --version, -v  Show version

  ${c.dim('Examples:')}
    npx github:capitolino/MyAgents init
    npx github:capitolino/MyAgents init my-webapp
    npx github:capitolino/MyAgents init my-webapp --no-copilot
`);
}

function printVersion() {
  console.log(`vs-framework v${pkg.version}`);
}

// ─── Banner ──────────────────────────────────────────────────────────────────
function printBanner() {
  const version = `v${pkg.version}`;
  console.log();
  console.log(c.cyan('  ╔══════════════════════════════════════╗'));
  console.log(c.cyan('  ║') + c.bold('   VS Framework') + c.dim(`  ${version}`) + c.cyan('              ║'));
  console.log(c.cyan('  ║') + c.dim('   AI dev framework · 8 named agents') + c.cyan('  ║'));
  console.log(c.cyan('  ╚══════════════════════════════════════╝'));
  console.log();
}

// ─── init command ────────────────────────────────────────────────────────────
function runInit(args) {
  // Parse flags
  const force      = args.includes('--force');
  const noCopilot  = args.includes('--no-copilot');
  const noClaude   = args.includes('--no-claude');
  const projectArg = args.find(a => !a.startsWith('--'));

  // Resolve destination
  const dest = projectArg
    ? path.resolve(process.cwd(), projectArg)
    : process.cwd();

  // If named project: create directory (error if exists)
  if (projectArg) {
    if (fs.existsSync(dest)) {
      die(`Directory already exists: ${dest}\nUse a different name, or cd into it and run init without a name.`);
    }
    ensureDir(dest);
  }

  printBanner();
  console.log(`  ${c.dim('Initializing in:')} ${c.bold(dest)}`);
  console.log();

  // Check if already initialized
  const alreadyInit = fs.existsSync(path.join(dest, 'agents', 'constitution.md'));
  if (alreadyInit && !force) {
    console.log(`  ${c.yellow('⚠')}  VS Framework already found in this directory.`);
    console.log(`     Run with ${c.bold('--force')} to overwrite existing files.\n`);
    process.exit(0);
  }

  // ── Copy: agents/ ─────────────────────────────────────────────────────────
  const agentsSrc  = path.join(PKG_ROOT, 'agents');
  const agentsDest = path.join(dest, 'agents');
  fs.cpSync(agentsSrc, agentsDest, { recursive: true });
  tick('agents/', `${countFiles(agentsDest)} files`);

  // ── Copy: .claude/skills/ ─────────────────────────────────────────────────
  if (!noClaude) {
    const claudeSrc  = path.join(PKG_ROOT, '.claude');
    const claudeDest = path.join(dest, '.claude');
    fs.cpSync(claudeSrc, claudeDest, { recursive: true });
    tick('.claude/skills/', `${countFiles(claudeDest)} files`);
  } else {
    skip('.claude/skills/', 'skipped (--no-claude)');
  }

  // ── Copy: .github/ ────────────────────────────────────────────────────────
  if (!noCopilot) {
    const githubSrc      = path.join(PKG_ROOT, '.github', 'copilot-agents');
    const githubDest     = path.join(dest, '.github', 'copilot-agents');
    const instructSrc    = path.join(PKG_ROOT, '.github', 'copilot-instructions.md');
    const instructDest   = path.join(dest, '.github', 'copilot-instructions.md');
    ensureDir(path.join(dest, '.github'));
    fs.cpSync(githubSrc, githubDest, { recursive: true });
    fs.copyFileSync(instructSrc, instructDest);
    const total = countFiles(githubDest) + 1;
    tick('.github/', `${total} files`);
  } else {
    skip('.github/', 'skipped (--no-copilot)');
  }

  // ── Copy: templates/ ──────────────────────────────────────────────────────
  const tmplSrc  = path.join(PKG_ROOT, 'templates');
  const tmplDest = path.join(dest, 'templates');
  fs.cpSync(tmplSrc, tmplDest, { recursive: true });
  tick('templates/', `${countFiles(tmplDest)} files`);

  // ── Copy: CLAUDE.md ───────────────────────────────────────────────────────
  const claudeMdSrc  = path.join(PKG_ROOT, 'CLAUDE.md');
  const claudeMdDest = path.join(dest, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdDest) || force) {
    fs.copyFileSync(claudeMdSrc, claudeMdDest);
    tick('CLAUDE.md', '');
  } else {
    skip('CLAUDE.md', 'already exists (use --force to overwrite)');
  }

  // ── Create: docs/ structure ───────────────────────────────────────────────
  const docsDir = path.join(dest, 'docs', 'architecture-decisions');
  ensureDir(docsDir);

  const planPath = path.join(dest, 'docs', 'plan.md');
  if (!fs.existsSync(planPath)) {
    const today = new Date().toISOString().split('T')[0];
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
  tick('docs/', 'plan.md + architecture-decisions/');

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log();
  console.log(`  ${c.green(c.bold('Done!'))} Your VS Framework team is ready.\n`);

  const w = 45;
  const box = (title, lines) => {
    console.log(`  ┌─ ${title} ${'─'.repeat(w - title.length - 2)}┐`);
    for (const l of lines) console.log(`  │  ${l.padEnd(w - 2)}│`);
    console.log(`  └${'─'.repeat(w + 1)}┘`);
    console.log();
  };

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

  if (projectArg) {
    console.log(`  ${c.dim('Next:')} cd ${projectArg}\n`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
const [,, command, ...rest] = process.argv;

if (!command || command === '--help' || command === '-h') {
  printHelp();
} else if (command === '--version' || command === '-v') {
  printVersion();
} else if (command === 'init') {
  runInit(rest);
} else {
  console.error(`\n  Unknown command: ${command}\n  Run with --help for usage.\n`);
  process.exit(1);
}
