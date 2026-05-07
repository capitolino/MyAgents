# ADR-0001: LLM Credit Optimization For VS Framework

- Status: Approved
- Date: 2026-04-23
- Scope: VS Framework repository only

## Context

The framework must support both Claude Code and GitHub Copilot. Some duplication is required because each tool needs its own instruction and command surface. However, avoidable duplication across framework docs and agent instructions increases token usage and maintenance cost.

## Decision

1. Preserve required runner duplication:
   - Keep Claude-specific command surfaces in `CLAUDE.md` and `.claude/skills/*`.
   - Keep Copilot-specific command surfaces in `.github/copilot-instructions.md` and `.github/copilot-agents/*`.
2. Reduce avoidable duplication:
   - Store shared policy and recurring workflows in shared docs under `docs/`.
   - Reference shared docs from runner-specific files instead of rewriting policy prose in multiple places.
3. Add a recurring maintenance-skill workflow:
   - Standardize periodic dependency hygiene using `vs-deps` and planning follow-up with `vs-plan`.
4. Do not modify distributed starter artifacts:
   - No changes to `io-templates/`.
   - No changes to generated greenfield or brownfield starter content.

## Consequences

- Lower token and maintenance overhead for framework updates.
- Better consistency across Claude and Copilot behavior.
- Clear audit trail for optimization decisions in a durable repository file.

## Implementation Notes

- Shared recurring workflow lives in `io-agents/maintenance/dependency-hygiene-workflow.md`.
- Runner-specific files keep only tool-specific command syntax and links to shared references.
