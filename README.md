# VS Framework

A lightweight development framework with named AI agents. Works with both **Claude Code** and **GitHub Copilot**. Inspired by BMAD, without the overhead.

## The Team

| Name | Role | Claude Code | GitHub Copilot |
|------|------|-------------|----------------|
| **John** | **Project Manager** *(orchestrator)* | `/vs-pm` or `/vs-john` | `@vs-pm` or `@vs-john` |
| **Sofia** | Brainstormer | `/vs-brainstorm` or `/vs-sofia` | `@vs-brainstorm` or `@vs-sofia` |
| **Diego** | Debugger | `/vs-debug` or `/vs-diego` | `@vs-debug` or `@vs-diego` |
| **Marcus** | Architect | `/vs-architect` or `/vs-marcus` | `@vs-architect` or `@vs-marcus` |
| **Elena** | Planner | `/vs-plan` or `/vs-elena` | `@vs-plan` or `@vs-elena` |
| **James** | Developer | `/vs-develop` or `/vs-james` | `@vs-develop` or `@vs-james` |
| **Priya** | Reviewer | `/vs-review` or `/vs-priya` | `@vs-review` or `@vs-priya` |
| **Alex** | QA Engineer | `/vs-qa` or `/vs-alex` | `@vs-qa` or `@vs-alex` |
| **Luna** | UX Designer | `/vs-ux` or `/vs-luna` | `@vs-ux` or `@vs-luna` |
| **Ravi** | Security Specialist | `/vs-security` or `/vs-ravi` | `@vs-security` or `@vs-ravi` |
| **Nina** | Tech Writer | `/vs-docs` or `/vs-nina` | `@vs-docs` or `@vs-nina` |

> **John is a pure orchestrator** — he never writes code, documentation, tests, or anything else. He only delegates to the right agent in the right order. He's optional: go directly to any agent when you know what you need.

**Specialist skills** (invoked by role, no persona):
- `/vs-env-setup` — Scaffold project structure, `.env.example`, `.gitignore`
- `/vs-db-design` — Database schema design and migrations
- `/vs-api-integration` — Generate API client code from schemas
- `/vs-perf` — Performance profiling, bottleneck analysis, load testing
- `/vs-feature-flags` — Feature flags for gradual rollouts and safe deployments
- `/vs-deploy` — Deployment config, CI/CD, health checks, monitoring, runbook
- `/vs-mcp-setup` — Configure MCP servers (GitHub, SQLite, docs, web) to extend agent capabilities
- `/vs-onboard` — Brownfield onboarding: discover codebase, document architecture, plan improvements
- `/vs-deps` — Dependency freshness audit and upgrade planning (security CVEs → Ravi)
- `/vs-ticketize` — Turn raw input (email, chat, meeting notes) into structured plan-entry drafts
- `/vs-commit` — Generate commit messages and PR descriptions from a git diff

> **Diego is a read-only agent** — he never touches code. He diagnoses, proposes solutions, and routes to James to fix.

## Adding to a Project

### New project (greenfield)

```bash
npx github:capitolino/MyAgents init my-project
cd my-project
```

Then start with `/vs-john` or `/vs-sofia` to brainstorm your idea.

### Existing project (brownfield)

```bash
cd your-existing-project
npx github:capitolino/MyAgents init --brownfield
```

Then run `/vs-onboard` to let the agents discover your codebase, document the architecture, and create an improvement plan. No code is changed — the agents only read and document.

**Brownfield onboarding flow:**
```
/vs-onboard
  → Sofia discovers codebase (stack, conventions, tech debt)
  → Marcus documents existing architecture (creates ADRs)
  → Elena creates improvement plan (stabilize → enhance → build new)
```

Or step by step: `/vs-sofia discover` → `/vs-marcus document` → `/vs-elena create brownfield`

### Install without a project name

Run from any directory — it copies framework files into the current folder:

```bash
npx github:capitolino/MyAgents init
```

Every run **fetches the latest files directly from GitHub** — npx cache is bypassed at install time, so you always get the current version.

**Source flags** — control which version to install:

| Flag | Effect |
|------|--------|
| *(none)* | Latest from `main` branch |
| `--branch <name>` | Any branch (e.g. `--branch dev`) |
| `--tag <name>` | Pinned release tag (e.g. `--tag v1.0.0`) |
| `--offline` | Use cached package — no download |

**Other flags:**

| Flag | Effect |
|------|--------|
| `--force` | Overwrite existing framework files |
| `--brownfield` | Install into existing project (skip scaffolding, show onboarding guide) |
| `--no-copilot` | Skip `.github/` — Claude Code only |
| `--no-claude` | Skip `.claude/` — Copilot only |

**Examples:**

```bash
# New project, always latest
npx github:capitolino/MyAgents init my-project

# Existing project, brownfield mode
npx github:capitolino/MyAgents init --brownfield

# Specific branch
npx github:capitolino/MyAgents init --branch dev

# Pinned release (stable)
npx github:capitolino/MyAgents init --tag v1.0.0

# New project, pinned release, Claude Code only
npx github:capitolino/MyAgents init my-project --tag v1.0.0 --no-copilot
```

### What gets installed

```
your-project/
├── CLAUDE.md                     # Claude Code constitution (auto-loaded)
├── io-agents/                    # Shared agent definitions (8 agents)
├── .claude/skills/               # Claude Code slash commands (22 skills)
├── .github/
│   ├── copilot-instructions.md   # Copilot constitution
│   └── copilot-agents/           # Copilot agent files (10 agents)
├── io-templates/                 # Document templates (brief, plan, ADR, memory)
└── io-docs/
    ├── plan.md                   # Project plan (stub, filled by Elena)
    ├── memory.md                 # Project knowledge base (updated by all agents)
    └── architecture-decisions/   # ADR records (filled by Marcus)
```

### Updating an existing installation

If the framework is already installed in your project, run `update` to pull the latest agents, skills, and templates — **your project files are never touched**:

```bash
npx github:capitolino/MyAgents update
```

| What gets updated | What is preserved |
|---|---|
| `io-agents/` | `io-docs/` (your plan, memory, ADRs) |
| `.claude/skills/` | `CLAUDE.md` |
| `.github/copilot-agents/` | `.gitignore` |
| `io-templates/` | `.env`, `.env.example` |

**Source flags** — same as `init`:

```bash
npx github:capitolino/MyAgents update                  # latest main
npx github:capitolino/MyAgents update --branch dev     # from dev branch
npx github:capitolino/MyAgents update --tag v1.2.0    # pinned release
npx github:capitolino/MyAgents update --no-copilot    # skip Copilot files
```

> **Tip:** Running `init` in a project that already has the framework will also prompt you to update instead of blocking.

### Migrating from v1.2.0 or earlier (folder rename)

Versions before v1.3.0 installed into `agents/`, `docs/`, and `templates/`. These have been renamed to `io-agents/`, `io-docs/`, and `io-templates/` to avoid conflicts with your existing project folders.

**Do NOT rename the whole folder.** Your project may have other content in `docs/`, `agents/`, or `templates/` that has nothing to do with the framework. Move only the framework-owned files:

```bash
# 1. Pull latest framework files — this creates io-agents/ and io-templates/ alongside the old folders
npx github:capitolino/MyAgents update

# 2. Move only the VS Framework docs — never move the whole docs/ folder
mkdir -p io-docs/architecture-decisions
mv docs/plan.md           io-docs/plan.md           2>/dev/null || true
mv docs/memory.md         io-docs/memory.md         2>/dev/null || true
mv docs/project-brief.md  io-docs/project-brief.md  2>/dev/null || true
mv docs/architecture-decisions/* io-docs/architecture-decisions/ 2>/dev/null || true
# docs/ stays in place — it may have other content you own

# 3. Remove old framework folders only if they contained only framework files
#    (step 1 already wrote fresh copies into io-agents/ and io-templates/)
rm -rf agents/      # safe if you never added custom files here
rm -rf templates/   # safe if you never added custom files here
```

> If you added custom files to `agents/` or `templates/`, move them to `io-agents/` or `io-templates/` before deleting the old folders.

### Manual install (without npx)

```bash
git clone https://github.com/capitolino/MyAgents.git
node MyAgents/bin/vs-framework.js init
rm -rf MyAgents
```

---

## Quick Start

### Starting a new project (greenfield)

```bash
npx github:capitolino/MyAgents init my-project
cd my-project
```

Then let John coordinate, or go direct:

| | Claude Code | GitHub Copilot |
|--|-------------|----------------|
| John coordinates | `/vs-john build me a task manager` | `@vs-john build me a task manager` |
| Brainstorm first | `/vs-sofia` | `@vs-brainstorm` |
| What's next? | `/vs-plan next` | `@vs-plan next` |

### Adopting an existing project (brownfield)

```bash
cd your-existing-project
npx github:capitolino/MyAgents init --brownfield
```

Then run the onboarding skill — it maps your codebase, documents the architecture, and creates an improvement plan. **No code is changed.**

| | Claude Code | GitHub Copilot |
|--|-------------|----------------|
| Full auto-onboard | `/vs-onboard` | `@vs-onboard` |
| Step 1 — discover | `/vs-sofia discover` | `@vs-brainstorm discover` |
| Step 2 — document | `/vs-marcus document` | `@vs-architect document` |
| Step 3 — plan | `/vs-elena create brownfield` | `@vs-plan create brownfield` |
| Then continue | `/vs-plan next` | `@vs-plan next` |

## Workflow

### Bug / Error (something is broken)
```
/vs-debug "TypeError: Cannot read property 'id' of undefined"
  → Diego diagnoses root cause (Bug Report)
  → James implements the fix
  → Alex adds regression test
  → Priya reviews
```

Diego has 3 modes:
| Mode | Command | Use when |
|------|---------|----------|
| `debug` (default) | `/vs-debug` | Error thrown or unexpected behaviour |
| `trace` | `/vs-debug trace` | Need to follow code execution to find where it breaks |
| `postmortem` | `/vs-debug postmortem` | Incident resolved — document it and prevent recurrence |

### Recurring maintenance (dependency hygiene)

Use the shared workflow in `docs/maintenance/dependency-hygiene-workflow.md`.

| Goal | Claude Code | GitHub Copilot |
|------|-------------|----------------|
| Weekly dependency audit | `/vs-deps audit` | `@vs-deps audit` |
| Plan major/abandoned upgrades | `/vs-plan update` | `@vs-plan update` |
| Security handoff when CVEs appear | `/vs-security deps` | `@vs-security deps` |

### Cleanup: automatic vs manual

Cleanup in VS Framework is **semi-automatic**:

- **Automatic**: the cleanup policy and workflow are persisted in framework docs, so every new session can follow the same rules without re-explaining them:
  - `docs/architecture-decisions/adr-0001-llm-credit-optimization.md`
  - `docs/framework-operating-model.md`
  - `docs/maintenance/dependency-hygiene-workflow.md`
- **Manual trigger**: you still start a cleanup run by invoking commands (there is no background scheduler).

Typical cleanup run:
1. Run dependency audit (`/vs-deps audit` or `@vs-deps audit`)
2. Route upgrade planning (`/vs-plan update` or `@vs-plan update`)
3. Only when CVE signals appear, hand off security dependency review (`/vs-security deps` or `@vs-security deps`)
4. Implement patch/minor upgrades, and schedule major/abandoned migrations in the plan

### Brownfield (existing project)
```
/vs-onboard
  → Sofia discovers codebase → Marcus documents architecture → Elena plans improvements
  → Phase 0: Stabilize (tests, CI, critical fixes)
  → Phase 1+: Normal development loop
```

### Orchestrated (via John)
```
/vs-john "build a login feature"
         ↓
      John reads io-docs/plan.md + brief, analyzes feature scope
         ↓
  Sofia? → Marcus? → Elena →
    [design: Ravi (auth) → Luna (login UX) → vs-db-design?] →
    James → Alex → Priya → [fixes loop] →
    [audit: Ravi (security) → Luna (UX review)] →
    Elena (mark done) → vs-deploy? → Nina?
```
John uses **Smart Routing** — automatically inserts Luna, Ravi, vs-db-design, etc. based on what the feature touches (auth, UI, database, etc.).

### Direct (you decide)
```
Sofia → Marcus → Elena → vs-env-setup →
  [design: Luna / Ravi / vs-db-design / vs-api-integration as needed] →
  [James → Alex → Priya → fixes loop] →
  [audit: Luna review / Ravi audit / vs-perf as needed] →
  vs-deploy → Nina
```

### Hotfix (fast path)
```
James (fix) → Alex (regression test) → Priya (fast review) → deploy
```

### When to use which

| Situation | Use |
|-----------|-----|
| Something is broken | `/vs-debug` |
| Existing project, first time | `/vs-onboard` |
| New project, full flow | `/vs-john` |
| Complex multi-agent task | `/vs-john` |
| You know exactly what you need | Direct agent |
| Quick fix or single task | Direct agent |
| "What should I do next?" | `/vs-plan next` |

You can switch between orchestrated and direct at any time — `io-docs/plan.md` always carries the shared state.

## Switching Between Tools

The `io-docs/` directory is the interchange layer — both Claude Code and Copilot read and write the same files:

| File | Purpose | Who updates it |
|------|---------|----------------|
| `io-docs/project-brief.md` | What we're building | Sofia |
| `io-docs/plan.md` | Phased checklist | All agents |
| `io-docs/memory.md` | Living knowledge base | All agents |
| `io-docs/architecture-decisions/` | Binding tech decisions | Marcus |

Start with Claude Code, switch to Copilot mid-phase, switch back — the shared `io-docs/` state means nothing is lost.

## Project Memory

`io-docs/memory.md` is the project's long-term knowledge base. Every agent reads it before starting work and appends learnings after finishing. It captures what can't be inferred from the code:

- **Stack & Environment** — runtime, frameworks, key libraries
- **Conventions** — project-specific deviations from language defaults
- **Architecture Notes** — informal decisions not worth a full ADR
- **Known Issues & Workarounds** — bugs, quirks, and their solutions
- **Gotchas** — things that will bite you if you forget them
- **External Dependencies & Quirks** — API rate limits, sandbox URLs, token expiry
- **Session Log** — brief entries after each significant work session

### Keep memory and plan lean

Both `io-docs/plan.md` and `io-docs/memory.md` are commonly read at startup, so keep them focused on active context.

- Keep in `io-docs/plan.md`: current phase, near-term next phases, and recently completed checkpoints.
- Move older completed phases to archive files such as `io-docs/plan-archive/2026-Q2.md`.
- Keep in `io-docs/memory.md`: current conventions, active blockers, latest decisions, and concise operating notes.
- Move older memory history to archive files such as `io-docs/memory-archive/2026-04.md`.
- Leave a short pointer in active files when details are archived.

This solves the "starting fresh every session" problem — the AI always has the full project context regardless of when or which tool you're using.

## Structure

```
your-project/
├── CLAUDE.md                    # Claude Code constitution
├── .claude/skills/              # Claude Code skills (slash commands)
├── .github/
│   ├── copilot-instructions.md  # Copilot constitution
│   └── copilot-agents/          # Copilot agent definitions
├── io-agents/                   # Shared agent definitions (both tools)
│   ├── constitution.md          # Shared rules
│   ├── john-pm.md               # John — Orchestrator (optional)
│   ├── sofia-brainstormer.md
│   ├── marcus-architect.md
│   ├── elena-planner.md
│   ├── james-developer.md
│   ├── priya-reviewer.md
│   ├── alex-qa.md
│   └── nina-writer.md
├── io-templates/                # Document templates
│   ├── project-brief.md
│   ├── architecture-decision.md
│   └── phase-plan.md
└── io-docs/                     # Living project documentation
    ├── project-brief.md
    ├── plan.md
    └── architecture-decisions/
```

## Optional MCP Servers

MCP (Model Context Protocol) servers extend agent capabilities by connecting them to external tools — GitHub, databases, documentation libraries, and more. They are **opt-in** and never required to use the framework.

| MCP Server | What it enables | Setup needed |
|------------|-----------------|--------------|
| **context7** | Live library docs for Marcus, James, Nina — no more outdated knowledge | None |
| **github** | Browse repos, issues, PRs; Sofia researches competitors; Ravi checks advisories | `GITHUB_TOKEN` |
| **azure-devops** | Work items, pipelines, PRs — for teams on Azure DevOps | `AZURE_DEVOPS_PAT` + org + project |
| **sqlite** | James and Alex query SQLite directly — inspect schema, verify migrations | `--db-path` |
| **mssql** | James and Alex query SQL Server — inspect schema, analyze performance | connection string |
| **fetch** | Sofia fetches competitor pages; Ravi checks CVE databases | None |
| **filesystem** | Agents access files outside the project directory | allowed paths list |
| **playwright** | Alex runs E2E tests in a real browser; Luna verifies UX and accessibility live | None |

### Claude Code

Use the skill to list, enable, or disable MCPs — it reads `io-templates/mcp-config.json` and writes to your local settings:

```
/vs-mcp-setup              # list all available MCPs and their status
/vs-mcp-setup enable github
/vs-mcp-setup disable sqlite
```

| | Tokens / secrets | Zero-config MCPs |
|--|-----------------|------------------|
| **Claude Code** | `.claude/settings.local.json` (gitignored) | `.claude/settings.json` (committed) |
| **Copilot (VS Code)** | VS Code env settings — never in files | `.vscode/mcp.json` (committed) |

**GitHub + SQLite project:**
```
/vs-mcp-setup enable context7    ← zero config
/vs-mcp-setup enable github      ← needs GITHUB_TOKEN env var
/vs-mcp-setup enable sqlite      ← needs path to your .db file
/vs-mcp-setup enable playwright  ← zero config, E2E testing
```

**Azure DevOps + SQL Server (enterprise):**
```
/vs-mcp-setup enable context7       ← zero config
/vs-mcp-setup enable azure-devops   ← needs AZURE_DEVOPS_PAT, org, project
/vs-mcp-setup enable mssql          ← needs MSSQL_CONNECTION_STRING
/vs-mcp-setup enable playwright     ← zero config, E2E testing
```

### GitHub Copilot (VS Code)

Copilot reads MCPs from **`.vscode/mcp.json`** in your project root. Use the agent to configure it:

```
@vs-mcp-setup              # list available MCPs and their status
@vs-mcp-setup enable github
@vs-mcp-setup disable sqlite
```

The agent will create or update `.vscode/mcp.json`. Credentials use VS Code's `${input:id}` mechanism — VS Code **prompts you securely on first connect** and stores the value. No manual env var setup needed, and `.vscode/mcp.json` is safe to commit (no secrets inside).

**GitHub + SQLite project:**
```
@vs-mcp-setup enable context7   ← zero config
@vs-mcp-setup enable github     ← set GITHUB_TOKEN in VS Code env settings
@vs-mcp-setup enable sqlite     ← set path to your .db file
```

**Azure DevOps + SQL Server (enterprise):**
```
@vs-mcp-setup enable context7       ← zero config
@vs-mcp-setup enable azure-devops   ← set AZURE_DEVOPS_PAT, org, project in VS Code env
@vs-mcp-setup enable mssql          ← set MSSQL_CONNECTION_STRING in VS Code env
```

The full config template for both platforms is at `io-templates/mcp-config.json`.

---

## Extending the Framework

### Add a Project-Specific Skill
Create a new skill with your own prefix (not `vs-`):
```
.claude/skills/myapp-deploy/SKILL.md
.github/copilot-agents/myapp-deploy.md
```

### Add Reference Material
Drop markdown files into a skill's `references/` directory:
```
.claude/skills/vs-api-integration/references/stripe-patterns.md
```

## Core Principles

1. **Plan-Driven** — Read the plan before acting, update it after
2. **Minimal Docs** — Just enough to guide development
3. **Phase Boundaries** — Each agent stays in their lane
4. **Convention First** — Follow existing project patterns
5. **Ask, Don't Assume** — Clarify ambiguity before acting
