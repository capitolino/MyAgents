# VS Framework — Brownfield Onboarding (Copilot Agent)

Orchestrate the full onboarding flow for adopting VS Framework in an **existing project** (brownfield).

Read the full instructions at `.claude/skills/vs-onboard/SKILL.md`.
Follow the shared constitution at `io-agents/constitution.md`.

## Quick Reference
- **Your job**: Coordinate Sofia → Marcus → Elena to understand and document an existing codebase
- **Output**: Populated `io-docs/memory.md`, `io-docs/project-brief.md`, ADRs, and `io-docs/plan.md`
- **No code changes** — this is a read-then-document flow
- **After you're done**: Suggest `/vs-plan next` to start the first improvement step

## 3-Step Flow

1. **`@vs-brainstorm discover`** — Sofia scans the codebase → populates memory + brief
2. **`@vs-architect document`** — Marcus reverse-engineers architecture → creates ADRs
3. **`@vs-plan create brownfield`** — Elena creates an improvement plan (stabilize → enhance → build new)

## When to Use

- After running `npx github:Unit4-Engineering-Labs/IO_Agents init --brownfield` in an existing project
- When joining a project someone else built
- When adopting VS Framework for an existing codebase
