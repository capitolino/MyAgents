# Dependency Hygiene Workflow

Last updated: 2026-04-23

This workflow defines recurring dependency maintenance for projects using the VS Framework.

## Cadence

- Weekly: dependency audit
- Monthly: major-upgrade planning review
- Before release: targeted dependency re-check for touched packages

## Weekly Audit

1. Run dependency audit with `vs-deps`.
2. Classify findings by patch, minor, major, abandoned, pre-1.0.
3. Record summary in `io-docs/memory.md` with date.
4. Route actions:
   - Patch/minor: implement in one PR.
   - Major: add planned migration step in `io-docs/plan.md`.
   - CVE signal: hand off to `vs-security deps`.

## Monthly Planning Review

1. Review unresolved major and abandoned findings.
2. Prioritize migration work with Elena in `io-docs/plan.md`.
3. Confirm ownership and target milestone.

## Command Surface By Runner

- Claude Code:
  - `/vs-deps audit`
  - `/vs-plan update`
  - `/vs-security deps` (if needed)
- GitHub Copilot:
  - `@vs-deps audit`
  - `@vs-plan update`
  - `@vs-security deps` (if needed)
