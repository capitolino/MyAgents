# VS Framework — Copilot Instructions

This project uses the VS Framework. Follow these conventions when generating code.

> **Keep the framework up to date** — run `npx github:capitolino/MyAgents update` periodically. *(Claude Code users get an automatic daily notice; Copilot users update manually.)*

## Agents

This project has named agents you can activate with `@` in Copilot Chat. Each has a corresponding file in `.github/copilot-agents/`.

| Name | Role | Invoke |
|------|------|--------|
| **John** | **Project Manager** *(optional orchestrator)* | `@vs-pm` or `@vs-john` |
| Sofia | Brainstormer | `@vs-brainstorm` or `@vs-sofia` |
| Diego | Debugger | `@vs-debug` or `@vs-diego` |
| Marcus | Architect | `@vs-architect` or `@vs-marcus` |
| Elena | Planner | `@vs-plan` or `@vs-elena` |
| James | Developer | `@vs-develop` or `@vs-james` |
| Priya | Reviewer | `@vs-review` or `@vs-priya` |
| Alex | QA Engineer | `@vs-qa` or `@vs-alex` |
| Luna | UX Designer | `@vs-ux` or `@vs-luna` |
| Ravi | Security Specialist | `@vs-security` or `@vs-ravi` |
| Nina | Tech Writer | `@vs-docs` or `@vs-nina` |

**John never writes anything.** He only delegates to the right agents in the right order. Use `@vs-john` for complex multi-step tasks; go directly to an agent for focused work.

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
| `@vs-env-setup` | First step of a new project — folder structure, `.env.example`, `.gitignore` |
| `@vs-db-design` | Designing data models and generating migrations |
| `@vs-api-integration` | Generating typed client code from OpenAPI / Swagger / GraphQL schemas |
| `@vs-perf` | Performance profiling, bottleneck analysis, load testing |
| `@vs-feature-flags` | Feature flags for gradual rollouts and safe deployments |
| `@vs-deploy` | Deployment config, CI/CD, health checks, monitoring, and `io-docs/deploy.md` runbook |
| `@vs-mcp-setup` | Configure MCP servers (GitHub, SQLite, docs, web) to extend agent capabilities |
| `@vs-onboard` | Brownfield onboarding: discover codebase, document architecture, plan improvements |
| `@vs-deps` | Dependency freshness audit and upgrade planning (run recurring workflow in `docs/maintenance/dependency-hygiene-workflow.md`) |
| `@vs-ticketize` | Turn raw input (email, chat, meeting notes) into structured plan-entry drafts |
| `@vs-commit` | Generate commit messages and PR descriptions from a git diff |

## Recurring Maintenance Workflow

Use the shared dependency hygiene workflow at `docs/maintenance/dependency-hygiene-workflow.md`.

Copilot quick run:
1. `@vs-deps audit`
2. `@vs-plan update`
3. `@vs-security deps` only when CVE signals are found

## Command-Specific Routing

- Brownfield: `@vs-brainstorm discover` → `@vs-architect document` → `@vs-plan create brownfield`
- Greenfield: `@vs-brainstorm` → `@vs-architect` → `@vs-plan create`
- Orchestrated: `@vs-john "<goal>"`
- Next action: `@vs-plan next`

All workflow semantics (parallel, pipeline, review gates, done criteria) are defined in `docs/framework-operating-model.md`.
