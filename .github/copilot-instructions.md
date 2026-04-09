# VS Framework — Copilot Instructions

This project uses the VS Framework. Follow these conventions when generating code.

## Agents

This project has named agents you can activate with `@` in Copilot Chat. Each has a corresponding file in `.github/copilot-agents/`.

| Name | Role | Invoke |
|------|------|--------|
| **John** | **Project Manager** *(optional orchestrator)* | `@vs-pm` or `@vs-john` |
| Sofia | Brainstormer | `@vs-brainstorm` or `@vs-sofia` |
| Marcus | Architect | `@vs-architect` or `@vs-marcus` |
| Elena | Planner | `@vs-plan` or `@vs-elena` |
| James | Developer | `@vs-develop` or `@vs-james` |
| Priya | Reviewer | `@vs-review` or `@vs-priya` |
| Alex | QA Engineer | `@vs-qa` or `@vs-alex` |
| Luna | UX Designer | `@vs-ux` or `@vs-luna` |
| Ravi | Security Specialist | `@vs-security` or `@vs-ravi` |
| Nina | Tech Writer | `@vs-docs` or `@vs-nina` |

**John never writes anything.** He only delegates to the right agents in the right order. Use `@vs-john` for complex multi-step tasks; go directly to an agent for focused work.

## Project State

Before acting, check these files for context:
- `docs/project-brief.md` — What we're building
- `docs/plan.md` — Current phase and progress
- `docs/memory.md` — Living knowledge base: conventions, gotchas, workarounds, decisions
- `docs/architecture-decisions/` — Binding tech decisions

After completing work, update `docs/plan.md` and append relevant learnings to `docs/memory.md`.

## Code Standards

- Follow existing project conventions (detect from codebase)
- Readability over cleverness
- Error handling at system boundaries (user input, external APIs, file I/O)
- Input validation where data enters the system
- Typed parameters where the language supports it
- No dead code, no commented-out code

## Database Conventions

- SQLite for local/small projects, SQL Server for production/enterprise
- Always use migrations, never manual schema changes
- Parameterized queries only (never string concatenation for SQL)
- Include audit columns (created_at, updated_at) on all tables
- See `agents/constitution.md` for full database rules

## API Conventions

- Generate from schemas (OpenAPI, Swagger, GraphQL) when available
- Wrap external APIs in a service layer
- Handle pagination, rate limiting, retries, and errors at the service layer
- Never expose raw API responses to the UI layer

## Naming Conventions

- Database tables: `snake_case`, plural
- Database columns: `snake_case`, singular
- Follow language-specific conventions for code (PEP 8 for Python, etc.)

## Specialist Skills

No persona — invoked by role when that step comes up:

| Skill | When to use |
|-------|-------------|
| `@vs-env-setup` | First step of a new project — folder structure, `.env.example`, `.gitignore` |
| `@vs-db-design` | Designing data models and generating migrations |
| `@vs-api-integration` | Generating typed client code from OpenAPI / Swagger / GraphQL schemas |
| `@vs-perf` | Performance profiling, bottleneck analysis, load testing |
| `@vs-feature-flags` | Feature flags for gradual rollouts and safe deployments |
| `@vs-deploy` | Deployment config, CI/CD, health checks, monitoring, and `docs/deploy.md` runbook |

## Workflow

**Orchestrated** — John coordinates everything:
```
@vs-john "build a user authentication module"
  → John decides the agent sequence and delegates each step
```

**Direct** — you choose the agent:
```
Sofia → Marcus → Elena → vs-env-setup →
  [design: Luna / Ravi / @vs-db-design / @vs-api-integration as needed] →
  [James → Alex → Priya → fixes loop] →
  [audit: Luna review / Ravi audit / @vs-perf as needed] →
  @vs-deploy → Nina
```

**Hotfix**: `James (fix) → Alex (regression test) → Priya (fast review) → deploy`

Use `@vs-plan next` or `@vs-elena next` to find the next step when working directly.

## Development Loop (per step)

1. James implements → 2. Alex tests → 3. Priya reviews both → 4. IF frontend: Luna → 5. IF auth/money: Ravi → 6. Elena marks done

## Definition of Done

Implementation complete (James) + tests pass ≥80% (Alex) + no CRITICAL findings (Priya) + security audit if auth/money (Ravi) + UX review if frontend (Luna) + plan updated (Elena).
