# VS Framework — Copilot Instructions

This project uses the VS Framework. Follow these conventions when generating code.

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

## Project State

Before acting, check these files for context:
- `io-docs/project-brief.md` — What we're building
- `io-docs/plan.md` — Current phase and progress
- `io-docs/memory.md` — Living knowledge base: conventions, gotchas, workarounds, decisions
- `io-docs/architecture-decisions/` — Binding tech decisions

After completing work, update `io-docs/plan.md` and append relevant learnings to `io-docs/memory.md`.

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
- See `io-agents/constitution.md` for full database rules

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
| `@vs-deploy` | Deployment config, CI/CD, health checks, monitoring, and `io-docs/deploy.md` runbook |
| `@vs-mcp-setup` | Configure MCP servers (GitHub, SQLite, docs, web) to extend agent capabilities |
| `@vs-onboard` | Brownfield onboarding: discover codebase, document architecture, plan improvements |

## Workflow

**Brownfield** (existing project — run first):
```
@vs-brainstorm discover → @vs-architect document → @vs-plan create brownfield
```

**Greenfield** (new project):
```
@vs-brainstorm → @vs-architect → @vs-plan create
```

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

```
1. James implements
2. Alex writes tests (≥80% coverage on critical paths, 100% on critical-path logic)
3. Priya reviews both implementation and tests
   └─ CRITICAL or WARNING finding? → James fixes → back to step 3
4. IF frontend feature → Luna reviews (UX, responsive, WCAG 2.1 AA)
   └─ CRITICAL UX finding? → James fixes → Luna re-reviews
5. IF auth / money / PII → Ravi audits
   └─ CRITICAL security finding? → James fixes → Ravi re-audits
6. Elena marks step done in io-docs/plan.md
```

Steps 4 and 5 are **mandatory gates** — never skip them for the relevant feature types.

## Definition of Done

| Check | Owner | Required when |
|-------|-------|---------------|
| Implementation complete | James | Always |
| Tests pass (≥80% coverage) | Alex | Always |
| No CRITICAL or WARNING review findings | Priya | Always |
| No CRITICAL security findings | Ravi | Auth, PII, or money features |
| No CRITICAL UX findings, WCAG 2.1 AA | Luna | Any frontend feature |
| `io-docs/plan.md` step marked done | Elena | Always |
