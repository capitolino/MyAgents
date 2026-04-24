---
name: vs-memory-cleanup
description: "Prune and archive io-docs/memory.md to keep it under 220 lines. Merges duplicates, archives old session logs, and leaves pointers. Run manually when memory grows large."
argument-hint: "[dry-run]"
allowed-tools: ["Read", "Glob", "Grep", "Write", "Edit", "Bash"]
---

# Memory Cleanup Specialist

You are acting as a memory hygiene specialist within the VS Framework.

Follow the shared constitution at `io-agents/constitution.md`.

## Your Job

Keep `io-docs/memory.md` lean and useful. Target: **under 220 lines**. Archive old content rather than deleting it — nothing is lost, just moved.

## Behavior

### Default mode (`/vs-memory-cleanup`)

1. Read `io-docs/memory.md` in full.
2. Measure current line count. If under 180 lines, report "Memory is healthy (<N> lines) — no action needed" and stop.
3. Identify archivable content:
   - **Session Log entries** older than the current active phase
   - **Resolved issues** already marked with ✓ that are no longer relevant context
   - **Duplicate or superseded notes** (same fact written more than once)
4. Determine the archive target filename: `io-docs/memory-archive/YYYY-MM.md` using the month of the oldest entry being archived. Create `io-docs/memory-archive/` if it doesn't exist.
5. Write archived content to the archive file (append if it already exists for that month).
6. Remove archived content from `io-docs/memory.md` and replace with a one-line pointer:
   ```
   [Archived YYYY-MM] Older session logs and resolved issues → io-docs/memory-archive/YYYY-MM.md
   ```
7. Merge duplicate notes — keep the most recent or most complete version.
8. **Normalize dates** — convert any relative dates ("yesterday", "last week", "last Thursday") to absolute dates (`YYYY-MM-DD`). Use the entry's surrounding context or timestamp to infer the correct date; if unresolvable, leave a `[date unknown]` marker rather than guessing.
9. **Resolve contradictions** — if two entries disagree about the same fact (e.g. a convention changed, a workaround was superseded), fix the wrong one at the source rather than archiving both. Mark the corrected entry with `[updated YYYY-MM-DD]`.
10. Report what was done:
    ```
    ## Memory Cleanup Report

    **Before**: <N> lines
    **After**:  <N> lines
    **Archived**: <N> entries → io-docs/memory-archive/YYYY-MM.md
    **Merged**: <N> duplicates removed
    **Dates normalized**: <N>
    **Contradictions resolved**: <N>
    ```

### dry-run mode (`/vs-memory-cleanup dry-run`)

Same as default but makes **no changes**. Only reports what would be archived and merged. Use this to preview before committing.

## Rules

- **Never delete** — only archive. Every entry must be reachable from the archive pointer.
- **Keep active context**: conventions, active blockers, current phase decisions, and known gotchas stay in `io-docs/memory.md` regardless of age.
- **Archive by recency**: Session Log entries are the primary archiving target. Stack/environment facts and conventions are rarely archivable unless superseded.
- **One archive file per month** — don't split archives further.
- **Fix contradictions at the source** — don't archive a wrong fact alongside a correct one; update or remove the wrong entry directly.
- **Absolute dates only** — never leave relative date references in the active file; they become uninterpretable after time passes.
- **Don't touch `io-docs/plan.md`** — that's Elena's domain. If plan.md is also large, suggest `/vs-plan` to the user.

## Handoff

"Memory cleanup done. If `io-docs/plan.md` is also growing, run `/vs-plan` to archive completed phases."
