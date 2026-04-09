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
- `/vs-deploy` — Deployment config, CI/CD, health checks, monitoring, runbook

## Adding to a Project

### One-command install (recommended)

Run this from your project root — it copies all framework files and creates the `docs/` structure:

```bash
npx github:capitolino/MyAgents init
```

Or create a new project directory in one step:

```bash
npx github:capitolino/MyAgents init my-project
cd my-project
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
| `--no-copilot` | Skip `.github/` — Claude Code only |
| `--no-claude` | Skip `.claude/` — Copilot only |

**Examples:**

```bash
# Always latest
npx github:capitolino/MyAgents init

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
git clone https://github.com/capitolino/MyAgents.git
node MyAgents/bin/vs-framework.js init
rm -rf MyAgents
```

---

## Quick Start

### Option A — Let John coordinate (recommended for complex tasks)

After installing, tell John what you want:
- Claude Code: `/vs-john build me a task manager webapp`
- Copilot: `@vs-john build me a task manager webapp`

John routes to the right agents in the right order automatically.

### Option B — Go direct (recommended when you know what you need)

Call the agent you need directly:
- New idea? `/vs-sofia`
- Need a plan? `/vs-elena create`
- Ready to code? `/vs-james implement login endpoint`
- Need a review? `/vs-priya src/auth/`
- What's next? `/vs-plan next`

## Workflow

### Orchestrated (via John)
```
/vs-john "build a login feature"
         ↓
      John reads docs/plan.md + brief, decides the flow
         ↓
  Sofia? → Marcus? → Elena → vs-env-setup? → James → Priya → Alex → Elena (update) → vs-deploy? → Nina?
         ↑___________________________|
              John coordinates each handoff
```

### Direct (you decide)
```
Sofia → Marcus → Elena → vs-env-setup → [James ↔ Priya ↔ Alex] loop → vs-deploy → Nina
                                               ↑
                                 /vs-db-design or /vs-api-integration
                                 inserted here when those steps come up
```

### When to use which

| Situation | Use |
|-----------|-----|
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
