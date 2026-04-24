# VS Framework

This project uses the VS Framework — a lightweight development methodology with named agents.

## Instruction Sources

- Claude-specific command usage stays in this file.
- Shared operating model lives in `docs/framework-operating-model.md`.
- Shared engineering rules live in `io-agents/constitution.md`.
- Approved optimization policy lives in `docs/architecture-decisions/adr-0001-llm-credit-optimization.md`.
- Recurring dependency workflow lives in `docs/maintenance/dependency-hygiene-workflow.md`.

## Agents

| Name | Role | Command |
|------|------|---------|
| **John** | **Project Manager** *(optional orchestrator)* | `/vs-pm` or `/vs-john` |
| Sofia | Brainstormer | `/vs-brainstorm` or `/vs-sofia` |
| Diego | Debugger | `/vs-debug` or `/vs-diego` |
| Marcus | Architect | `/vs-architect` or `/vs-marcus` |
| Elena | Planner | `/vs-plan` or `/vs-elena` |
| James | Developer | `/vs-develop` or `/vs-james` |
| Priya | Reviewer | `/vs-review` or `/vs-priya` |
| Alex | QA Engineer | `/vs-qa` or `/vs-alex` |
| Luna | UX Designer | `/vs-ux` or `/vs-luna` |
| Ravi | Security Specialist | `/vs-security` or `/vs-ravi` |
| Nina | Tech Writer | `/vs-docs` or `/vs-nina` |

## Shared Operating Model

Use `docs/framework-operating-model.md` for:
- project state read/write rules
- engineering discipline and code standards
- workflow, development loop, and definition of done

Use `io-agents/constitution.md` for full policy details.

## Specialist Skills

No persona — invoked by role when that step comes up:

| Skill | When to use |
|-------|-------------|
| `/vs-env-setup` | First step of a new project — folder structure, `.env.example`, `.gitignore` |
| `/vs-db-design` | Designing data models and generating migrations |
| `/vs-api-integration` | Generating typed client code from OpenAPI / Swagger / GraphQL schemas |
| `/vs-perf` | Performance profiling, bottleneck analysis, load testing |
| `/vs-feature-flags` | Design and implement feature flags for gradual rollouts and safe deployments |
| `/vs-deploy` | Deployment config, CI/CD, health checks, monitoring, and `io-docs/deploy.md` runbook |
| `/vs-mcp-setup` | Configure MCP servers (GitHub, SQLite, docs, web) to extend agent capabilities |
| `/vs-onboard` | Brownfield onboarding — discover existing codebase, document architecture, plan improvements |
| `/vs-deps` | Dependency freshness audit and upgrade planning (run recurring workflow in `docs/maintenance/dependency-hygiene-workflow.md`) |
| `/vs-ticketize` | Turn raw input (email, chat, meeting notes) into structured plan-entry drafts |
| `/vs-commit` | Generate commit messages and PR descriptions from a git diff |
| `/vs-memory-cleanup` | Prune and archive `io-docs/memory.md` when it exceeds 220 lines |

## Recurring Maintenance Workflow

Use the shared dependency hygiene workflow at `docs/maintenance/dependency-hygiene-workflow.md`.

Claude quick run:
1. `/vs-deps audit`
2. `/vs-plan update`
3. `/vs-security deps` only when CVE signals are found

### Memory hygiene

Run `/vs-memory-cleanup` whenever `io-docs/memory.md` feels large. It archives old session logs to `io-docs/memory-archive/` and keeps the active file under 220 lines.

## Command-Specific Routing

- Brownfield: `/vs-onboard` or `/vs-sofia discover` → `/vs-marcus document` → `/vs-elena create brownfield`
- Greenfield: `/vs-sofia` → `/vs-marcus` → `/vs-elena create`
- Orchestrated: `/vs-john "<goal>"`
- Next action: `/vs-plan next`

All workflow semantics (parallel, pipeline, review gates, done criteria) are defined in `docs/framework-operating-model.md`.
