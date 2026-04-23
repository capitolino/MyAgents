# Contributing to VS Framework

Thanks for contributing. This document covers everything you need to know.

## Branching strategy

```
main   ← production-ready releases only (requires @JoaoCapitolino_unit4 approval)
  └── dev  ← integration branch (requires 1 review from any maintainer)
        └── your-branch  ← your work
```

**Always branch from `dev`, never from `main`:**

```bash
git checkout dev
git pull origin dev
git checkout -b fix/your-fix-name   # or feat/your-feature-name
```

## Making a change

1. **Branch** from `dev` using `feat/`, `fix/`, or `docs/` prefix
2. **Make your changes** — follow existing conventions in `agents/` and `.claude/skills/`
3. **Test** — activate the affected agent and verify the behavior works as expected
4. **PR to `dev`** — fill in the PR template, 1 maintainer approval required
5. **Maintainers** merge `dev → main` via PR — requires `@JoaoCapitolino_unit4` approval

## What can be contributed

| Area | Notes |
|------|-------|
| Agent improvements (`agents/`) | Follow existing structure — role, constraints, behavior, handoff |
| New skills (`.claude/skills/`) | Add both Claude Code skill and Copilot counterpart (`.github/copilot-agents/`) |
| Bug fixes | Reference the issue or describe the bug in the PR |
| Templates (`templates/`) | Keep minimal — agents fill in the content |
| Documentation (`README.md`) | Keep accurate and concise |

## What NOT to do

- Do NOT push directly to `dev` or `main` — always use a PR
- Do NOT add agent personas or skills that overlap with existing agents' roles
- Do NOT add external dependencies to `bin/vs-framework.js` (keep it zero-dep)
- Do NOT commit secrets, tokens, or `.env` files
- Do NOT modify `docs/` project files — those belong to the project using the framework

## Conventions

- **Agent files**: `# AgentName — Role` heading, sections: Identity, Goal, Constraints, MCPs, Behavior, Handoff
- **Skill files**: YAML frontmatter with `name`, `description`, `argument-hint`, `allowed-tools`
- **Instruction deduplication**: keep runner-specific command syntax in `CLAUDE.md` and `.github/copilot-instructions.md`, but place shared workflow/policy text in `docs/` and reference it (see `docs/framework-operating-model.md` and ADR-0001)
- **Commit messages**: `type(scope): description` — types: `feat`, `fix`, `docs`, `chore`, `refactor`
- **Severity levels**: use `CRITICAL / WARNING / SUGGESTION / NIT` (not HIGH/MEDIUM/LOW for code findings)

## Getting access (new org members)

This is a private repo. If you've joined the organization and can't see it yet, ask a maintainer to add you to the **`io-agents-contributors`** team — that gives you write access to this repo without changing any org-level settings.

Maintainers: [Unit4-Engineering-Labs/io-agents-maintainers](https://github.com/orgs/Unit4-Engineering-Labs/teams/io-agents-maintainers)

## Getting help

Open an issue or ping `@JoaoCapitolino_unit4` on the PR.
