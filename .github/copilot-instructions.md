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
| Nina | Tech Writer | `@vs-docs` or `@vs-nina` |

**John never writes anything.** He only delegates to the right agents in the right order. Use `@vs-john` for complex multi-step tasks; go directly to an agent for focused work.

## Project State

Before acting, check these files for context:
- `docs/project-brief.md` — What we're building
- `docs/plan.md` — Current phase and progress
- `docs/architecture-decisions/` — Binding tech decisions

After completing work, update `docs/plan.md` to reflect progress.

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

## Workflow

**Orchestrated** — John coordinates everything:
```
@vs-john "build a user authentication module"
  → John decides the agent sequence and delegates each step
```

**Direct** — you choose the agent:
```
Sofia → Marcus → Elena → [James ↔ Priya ↔ Alex] loop → Nina
```

Use `@vs-plan next` or `@vs-elena next` to find the next step when working directly.
