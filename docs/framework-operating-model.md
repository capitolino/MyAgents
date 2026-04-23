# VS Framework Operating Model

Last updated: 2026-04-23

This document is the shared operating model used by both Claude Code and GitHub Copilot instruction entry points.

## Project State

Before acting, read:
- `io-docs/project-brief.md`
- `io-docs/plan.md`
- `io-docs/memory.md`
- `io-docs/architecture-decisions/`

After completing work, update:
- `io-docs/plan.md`
- `io-docs/memory.md`

## Context Size Management

Keep startup context focused by separating active context from history.

- `io-docs/plan.md`: keep active and near-term phases. Keep recently completed steps for traceability, but archive older completed phases.
- `io-docs/memory.md`: keep only current stack, active conventions, live blockers, and recent decisions.
- Archive history in project-owned files such as:
	- `io-docs/plan-archive/*.md`
	- `io-docs/memory-archive/*.md`
- In active files, leave short pointers to the archive entries when older detail is moved.

## Engineering Discipline

Full source of truth: `io-agents/constitution.md`.

1. Think Before Coding
2. Simplicity First
3. Surgical Changes
4. Goal-Driven Execution
5. No Fabricated APIs
6. Match Output to Request Scope

## Code Standards

- Follow project conventions
- Error handling at system boundaries
- Input validation at data entry points
- Parameterized queries for SQL
- Typed parameters where supported
- No dead code or commented-out code

## Workflow

Brownfield onboarding:
- Brainstorm discover
- Architect document
- Plan create brownfield

Greenfield kickoff:
- Brainstorm
- Architect
- Plan create

Direct flow:
- Design/specialists as needed
- James implement
- Alex test
- Priya review
- Optional Luna/Ravi audit gates

Hotfix flow:
- James fix
- Alex regression tests
- Priya fast review

## Development Loop

1. James implements
2. Alex finalizes and runs tests
3. Priya reviews code and tests
4. Luna and/or Ravi mandatory gate when feature type requires it
5. Elena marks step done in `io-docs/plan.md`

## Definition of Done

- Implementation complete (James)
- Tests pass (Alex)
- No CRITICAL/WARNING review findings (Priya)
- No CRITICAL security findings for auth/PII/money (Ravi)
- No CRITICAL UX findings for frontend (Luna)
- Plan step marked done (Elena)

## Related Shared Docs

- `docs/architecture-decisions/adr-0001-llm-credit-optimization.md`
- `docs/maintenance/dependency-hygiene-workflow.md`
