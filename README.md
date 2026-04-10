# VS Framework

A lightweight development framework with named AI agents. Works with both **Claude Code** and **GitHub Copilot**. Inspired by BMAD, without the overhead.

## The Team

| Name | Role | Claude Code | GitHub Copilot |
|------|------|-------------|----------------|
| **John** | **Project Manager** *(orchestrator)* | `/vs-pm` or `/vs-john` | `@vs-pm` or `@vs-john` |
| **Sofia** | Brainstormer | `/vs-brainstorm` or `/vs-sofia` | `@vs-brainstorm` or `@vs-sofia` |
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

## Adding to a Project

### New project (greenfield)

```bash
npx github:Unit4-Engineering-Labs/IO_Agents init my-project
cd my-project
```

Then start with `/vs-john` or `/vs-sofia` to brainstorm your idea.

### Existing project (brownfield)

```bash
cd your-existing-project
npx github:Unit4-Engineering-Labs/IO_Agents init --brownfield
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
npx github:Unit4-Engineering-Labs/IO_Agents init
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
npx github:Unit4-Engineering-Labs/IO_Agents init my-project

# Existing project, brownfield mode
npx github:Unit4-Engineering-Labs/IO_Agents init --brownfield

# Specific branch
npx github:Unit4-Engineering-Labs/IO_Agents init --branch dev

# Pinned release (stable)
npx github:Unit4-Engineering-Labs/IO_Agents init --tag v1.0.0

# New project, pinned release, Claude Code only
npx github:Unit4-Engineering-Labs/IO_Agents init my-project --tag v1.0.0 --no-copilot
```

### What gets installed

```
your-project/
├── CLAUDE.md                     # Claude Code constitution (auto-loaded)
├── agents/                       # Shared agent definitions (8 agents)
├── .claude/skills/               # Claude Code slash commands (19 skills)
├── .github/
│   ├── copilot-instructions.md   # Copilot constitution
│   └── copilot-agents/           # Copilot agent files (10 agents)
├── templates/                    # Document templates (brief, plan, ADR, memory)
└── docs/
    ├── plan.md                   # Project plan (stub, filled by Elena)
    ├── memory.md                 # Project knowledge base (updated by all agents)
    └── architecture-decisions/   # ADR records (filled by Marcus)
```

### Manual install (without npx)

```bash
git clone https://github.com/Unit4-Engineering-Labs/IO_Agents.git
node MyAgents/bin/vs-framework.js init
rm -rf MyAgents
```

---

## Quick Start

### Starting a new project (greenfield)

```bash
npx github:Unit4-Engineering-Labs/IO_Agents init my-project
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
npx github:Unit4-Engineering-Labs/IO_Agents init --brownfield
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
      John reads docs/plan.md + brief, analyzes feature scope
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
| Existing project, first time | `/vs-onboard` |
| New project, full flow | `/vs-john` |
| Complex multi-agent task | `/vs-john` |
| You know exactly what you need | Direct agent |
| Quick fix or single task | Direct agent |
| "What should I do next?" | `/vs-plan next` |

You can switch between orchestrated and direct at any time — `docs/plan.md` always carries the shared state.

## Switching Between Tools

The `docs/` directory is the interchange layer — both Claude Code and Copilot read and write the same files:

| File | Purpose | Who updates it |
|------|---------|----------------|
| `docs/project-brief.md` | What we're building | Sofia |
| `docs/plan.md` | Phased checklist | All agents |
| `docs/memory.md` | Living knowledge base | All agents |
| `docs/architecture-decisions/` | Binding tech decisions | Marcus |

Start with Claude Code, switch to Copilot mid-phase, switch back — the shared `docs/` state means nothing is lost.

## Project Memory

`docs/memory.md` is the project's long-term knowledge base. Every agent reads it before starting work and appends learnings after finishing. It captures what can't be inferred from the code:

- **Stack & Environment** — runtime, frameworks, key libraries
- **Conventions** — project-specific deviations from language defaults
- **Architecture Notes** — informal decisions not worth a full ADR
- **Known Issues & Workarounds** — bugs, quirks, and their solutions
- **Gotchas** — things that will bite you if you forget them
- **External Dependencies & Quirks** — API rate limits, sandbox URLs, token expiry
- **Session Log** — brief entries after each significant work session

This solves the "starting fresh every session" problem — the AI always has the full project context regardless of when or which tool you're using.

## Structure

```
your-project/
├── CLAUDE.md                    # Claude Code constitution
├── .claude/skills/              # Claude Code skills (slash commands)
├── .github/
│   ├── copilot-instructions.md  # Copilot constitution
│   └── copilot-agents/          # Copilot agent definitions
├── agents/                      # Shared agent definitions (both tools)
│   ├── constitution.md          # Shared rules
│   ├── john-pm.md               # John — Orchestrator (optional)
│   ├── sofia-brainstormer.md
│   ├── marcus-architect.md
│   ├── elena-planner.md
│   ├── james-developer.md
│   ├── priya-reviewer.md
│   ├── alex-qa.md
│   └── nina-writer.md
├── templates/                   # Document templates
│   ├── project-brief.md
│   ├── architecture-decision.md
│   └── phase-plan.md
└── docs/                        # Living project documentation
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

Use the skill to list, enable, or disable MCPs — it reads `templates/mcp-config.json` and writes to your local settings:

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

The agent will create or update `.vscode/mcp.json`. Sensitive tokens go in VS Code User Settings (`settings.json`) as environment variable references — never hardcoded in `.vscode/mcp.json` (which is committed).

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

The full config template for both platforms is at `templates/mcp-config.json`.

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
