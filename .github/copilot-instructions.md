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

## Engineering Discipline (quality, tokens, anti-hallucination)

Apply to every code-producing or code-reviewing interaction. These override convenience and cleverness. Full text: `io-agents/constitution.md` → *Engineering Discipline*.

1. **Think Before Coding** — state assumptions; if ambiguous, ask. If confused, stop. Never guess past a point of confusion.
2. **Simplicity First** — minimum code that solves the stated problem. No speculative abstractions, no "just in case" parameters. YAGNI is a hard rule.
3. **Surgical Changes** — touch only the files/lines needed. Match surrounding style. Don't refactor unrelated code, don't reformat untouched files.
4. **Goal-Driven Execution** — restate success criteria before starting, verify against them before claiming done. If you couldn't verify, say so.
5. **No Fabricated APIs** — never invent method names, config keys, env vars, or library behaviour. Look it up (context7 MCP, source, docs) or ask. Uncertainty is information — flag it.
6. **Match Output to Request Scope** — one-line question → one-line answer. Focused fix → focused diff. No preambles, no recaps, no closing summaries unless asked. File paths + line numbers over prose.

**Priya reviews against these rules:** overengineering / scope creep / unverified claims = WARNING; fabricated APIs = CRITICAL.

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
   └─ Pipeline: if next step interface is defined, Alex writes [pending-impl] tests in parallel
2. Alex finalises + runs tests (≥80% coverage; 100% on auth/payment/mutation paths)
3. Priya reviews code + tests together
   └─ CRITICAL or WARNING? → James fixes → back to step 3
4. IF frontend AND auth/PII/money → @vs-luna + @vs-ravi IN PARALLEL (mandatory)
   IF frontend only              → @vs-luna
   IF auth/PII/money only        → @vs-ravi
   └─ Collect both reports, fix all findings in one pass, re-review with flagging agent only
5. Elena marks step done in io-docs/plan.md
```

**Step 4 is a mandatory gate** — never skip Luna or Ravi for the relevant feature types. When both apply, run them simultaneously to save a full review cycle.

### Parallel patterns (Elena tags these in the plan)

| Tag | Meaning |
|-----|---------|
| `[parallel]` | Multiple independent James steps — run on separate branches simultaneously |
| `[pipeline]` | Interface defined — Alex writes tests while James implements |
| `[parallel-skills]` | vs-db-design ‖ vs-api-integration — run simultaneously, James waits for both |

## Definition of Done

| Check | Owner | Required when |
|-------|-------|---------------|
| Implementation complete | James | Always |
| Tests pass (≥80% coverage) | Alex | Always |
| No CRITICAL or WARNING review findings | Priya | Always |
| No CRITICAL security findings | Ravi | Auth, PII, or money features |
| No CRITICAL UX findings, WCAG 2.1 AA | Luna | Any frontend feature |
| `io-docs/plan.md` step marked done | Elena | Always |
