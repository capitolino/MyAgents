# VS Framework

This project uses the VS Framework — a lightweight development methodology with named agents.

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

## Constitution

All agents follow the shared constitution at `io-agents/constitution.md`. Key rules:

1. **Plan-Driven** — Read `io-docs/plan.md` before acting, update it after
2. **Minimal Docs** — Just enough to guide development, no filler
3. **Phase Boundaries** — Each agent stays in their lane
4. **Convention First** — Follow existing project patterns
5. **Ask, Don't Assume** — Clarify ambiguity before acting
6. **Respect Existing Code** — In brownfield projects, understand before changing. Improve incrementally.

## Project State

- `io-docs/project-brief.md` — What we're building (created by Sofia)
- `io-docs/plan.md` — Phased checklist (created by Elena, updated by all)
- `io-docs/memory.md` — Living knowledge base (updated by all agents after every session)
- `io-docs/architecture-decisions/` — ADR-lite records (created by Marcus)

## Engineering Discipline

Six rules every agent follows when writing, reviewing, or debugging code. Full text in `io-agents/constitution.md`:

1. **Think Before Coding** — state assumptions; ask when ambiguous; never guess past confusion
2. **Simplicity First** — minimum code that solves the stated problem; YAGNI is a hard rule
3. **Surgical Changes** — touch only what's needed; match surrounding style; no unrelated refactors
4. **Goal-Driven Execution** — define "done" before starting; verify before claiming done
5. **No Fabricated APIs** — never invent methods, config keys, or env vars; look them up or ask
6. **Match Output to Request Scope** — one-line question → one-line answer; no preambles or recaps

Priya enforces these at review: overengineering / scope creep / unverified claims = WARNING; fabricated APIs = CRITICAL.

## Code Standards

- Follow existing project conventions
- Error handling at system boundaries
- Parameterized queries for all SQL
- Typed parameters where supported
- No dead code, no orphan TODOs

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
| `/vs-deps` | Dependency freshness audit and upgrade planning (security CVEs → Ravi) |
| `/vs-ticketize` | Turn raw input (email, chat, meeting notes) into structured plan-entry drafts |
| `/vs-commit` | Generate commit messages and PR descriptions from a git diff |

## Workflow

**Brownfield** (adopt existing project):
```
/vs-onboard
  → Sofia discovers codebase → Marcus documents architecture → Elena plans improvements
  → Normal development loop from here
```

**Greenfield** (new project):

**Orchestrated** (John coordinates everything):
```
/vs-john "build a login feature"
  → John routes to the right agents in sequence automatically
```

**Direct** (you choose the agents):
```
Sofia → Marcus → Elena → vs-env-setup →
  [design: Luna / Ravi / vs-db-design / vs-api-integration as needed] →
  [James → Alex → Priya → fixes loop] →
  [audit: Luna review / Ravi audit / vs-perf as needed] →
  vs-deploy → Nina
```

**Hotfix** (fast path):
```
James (fix) → Alex (regression test) → Priya (fast review) → deploy
```

John is optional. Go direct when you know what you need. Use `/vs-plan next` (or `/vs-elena next`) to find what's next.

## Development Loop (per step)

```
1. James implements → 2. Alex tests → 3. Priya reviews both
   └─ CRITICAL/WARNING? → James fixes → back to 3
4. IF frontend → Luna reviews  |  IF auth/money → Ravi audits
5. Elena marks step done
```

## Definition of Done

| Check | Owner | When required |
|-------|-------|---------------|
| Implementation complete | James | Always |
| Tests pass (≥80% coverage) | Alex | Always |
| No CRITICAL/WARNING review findings | Priya | Always |
| No CRITICAL security findings | Ravi | Auth, PII, or money |
| No CRITICAL UX findings, WCAG 2.1 AA | Luna | Frontend features |
| `io-docs/plan.md` step marked done | Elena | Always |
