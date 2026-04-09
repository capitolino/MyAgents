# VS Framework

This project uses the VS Framework — a lightweight development methodology with named agents.

## Agents

| Name | Role | Command |
|------|------|---------|
| **John** | **Project Manager** *(optional orchestrator)* | `/vs-pm` or `/vs-john` |
| Sofia | Brainstormer | `/vs-brainstorm` or `/vs-sofia` |
| Marcus | Architect | `/vs-architect` or `/vs-marcus` |
| Elena | Planner | `/vs-plan` or `/vs-elena` |
| James | Developer | `/vs-develop` or `/vs-james` |
| Priya | Reviewer | `/vs-review` or `/vs-priya` |
| Alex | QA Engineer | `/vs-qa` or `/vs-alex` |
| Luna | UX Designer | `/vs-ux` or `/vs-luna` |
| Ravi | Security Specialist | `/vs-security` or `/vs-ravi` |
| Nina | Tech Writer | `/vs-docs` or `/vs-nina` |

## Constitution

All agents follow the shared constitution at `agents/constitution.md`. Key rules:

1. **Plan-Driven** — Read `docs/plan.md` before acting, update it after
2. **Minimal Docs** — Just enough to guide development, no filler
3. **Phase Boundaries** — Each agent stays in their lane
4. **Convention First** — Follow existing project patterns
5. **Ask, Don't Assume** — Clarify ambiguity before acting

## Project State

- `docs/project-brief.md` — What we're building (created by Sofia)
- `docs/plan.md` — Phased checklist (created by Elena, updated by all)
- `docs/memory.md` — Living knowledge base (updated by all agents after every session)
- `docs/architecture-decisions/` — ADR-lite records (created by Marcus)

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
| `/vs-deploy` | Generating deployment config, CI/CD pipelines, monitoring, and `docs/deploy.md` runbook |

## Workflow

**Orchestrated** (John coordinates everything):
```
/vs-john "build a login feature"
  → John routes to the right agents in sequence automatically
```

**Direct** (you choose the agent):
```
Sofia → Marcus → Elena → vs-env-setup → [James ↔ Priya ↔ Alex] loop → vs-deploy → Nina
                                               ↑
                                 /vs-db-design or /vs-api-integration
                                 inserted when those steps come up
```

John is optional. Go direct when you know what you need. Use `/vs-plan next` (or `/vs-elena next`) to find what's next.

## Definition of Done

A feature step is done when:
- Implementation complete (James)
- No CRITICAL/WARNING review findings (Priya)
- All tests pass, happy path + edge cases covered (Alex)
- `docs/plan.md` step marked done (Elena)
