#!/usr/bin/env node
'use strict';
// VS Framework daily update check
// Invoked by Claude Code via a UserPromptSubmit hook.
// Silent on success; writes one notice to stderr when a newer version is available.
// Throttled to once per 24 h via .claude/.vs-last-check.

const fs    = require('fs');
const https = require('https');
const path  = require('path');

const REPO       = 'Unit4-Engineering-Labs/IO_Agents';
const DIR        = __dirname;                                        // .claude/
const MARKER     = path.join(DIR, '.vs-last-check');
const SHA_FILE   = path.join(DIR, '.vs-installed-sha');
const DAY_MS     = 24 * 60 * 60 * 1000;

// ── Guard: no SHA recorded means we can't compare — skip silently ─────────────
if (!fs.existsSync(SHA_FILE)) process.exit(0);

// ── Throttle: skip if checked within the last 24 h ────────────────────────────
if (fs.existsSync(MARKER)) {
  const last = parseInt(fs.readFileSync(MARKER, 'utf8').trim(), 10);
  if (!isNaN(last) && Date.now() - last < DAY_MS) process.exit(0);
}
// Write timestamp immediately so a network failure doesn't cause a retry storm
try { fs.writeFileSync(MARKER, String(Date.now()), 'utf8'); } catch { process.exit(0); }

const installedSha = fs.readFileSync(SHA_FILE, 'utf8').trim();

// ── Fetch latest commit SHA from GitHub API ───────────────────────────────────
// Accept: application/vnd.github.sha returns just the 40-char SHA — minimal payload
const req = https.get(
  `https://api.github.com/repos/${REPO}/commits/main`,
  {
    headers: {
      'User-Agent': 'vs-framework-update-check/1.0',
      'Accept': 'application/vnd.github.sha',
    },
  },
  (res) => {
    let body = '';
    res.on('data', chunk => { body += chunk; });
    res.on('end', () => {
      const latestSha = body.trim();
      if (latestSha.length === 40 && latestSha !== installedSha) {
        process.stderr.write(
          `\n  ⚡ VS Framework update available!\n` +
          `     Run: npx github:${REPO} update\n\n`
        );
      }
    });
  }
);

req.setTimeout(5000, () => req.destroy());   // don't hang the session
req.on('error', () => {});                   // no network = no problem
