# Plan Template Reference

Use this format when creating `io-docs/plan.md`:

```markdown
# Project Plan: {Project Name}

**Last updated**: {date}
**Current phase**: Phase {N} — {Phase Name}

## Phase 1: {Name}
- [x] Completed step (checked)
- [ ] Pending step (unchecked)  <-- current
- [ ] Future step

## Phase 2: {Name}
- [ ] Step description

## Notes
- {Blockers, decisions, changes}
```

## Guidelines for Elena (Planner)

- **3-5 phases** per project (not more)
- **3-7 steps** per phase (keep granular but not micro)
- Steps should be concrete and actionable (not "think about X")
- Use verb-first format: "Create user login endpoint", "Design database schema"
- Mark current step with a comment `<-- current` for easy scanning
- Add Notes section for blockers, discovered work, or scope changes
- When routing to the next agent, match step keywords:
  - "design schema" / "database" → `/vs-db-design`
  - "API" / "integrate" / "consume" → `/vs-api-integration`
  - "implement" / "create" / "build" → `/vs-develop` (James)
  - "test" / "verify" / "validate" → `/vs-qa` (Alex)
  - "review" / "check" → `/vs-review` (Priya)
  - "document" / "guide" / "manual" → `/vs-docs` (Nina)
