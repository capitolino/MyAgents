---
name: vs-onboard
description: "Onboard the VS Framework into an existing (brownfield) project. Discovers codebase, documents architecture, and creates an improvement plan."
argument-hint: "[path-to-existing-project]"
allowed-tools: ["Read", "Glob", "Grep", "Write", "Edit", "Bash", "WebSearch", "WebFetch", "Agent"]
---

# VS Framework — Brownfield Onboarding

This skill orchestrates the full onboarding flow for adopting VS Framework in an **existing project** (brownfield). It coordinates Sofia, Marcus, and Elena in sequence.

## When to Use

- You just ran `npx github:capitolino/MyAgents init` inside an existing project
- You want the VS Framework agents to understand your codebase before starting work
- You're joining a project someone else built and need to ramp up

## What This Does (3-step flow)

### Step 1: Discover (Sofia)
Invoke `/vs-sofia discover` — Sofia will:
- Scan the codebase for stack, conventions, architecture, and health
- Populate `docs/memory.md` with findings (stack, conventions, known issues, tech debt)
- Create `docs/project-brief.md` from what the code reveals
- Output a Discovery Report

### Step 2: Document Architecture (Marcus)
Invoke `/vs-marcus document` — Marcus will:
- Read Sofia's discovery notes
- Create ADRs for major architecture decisions already in the code
- Flag architectural concerns and tech debt
- Output an Architecture Documentation summary

### Step 3: Plan Improvements (Elena)
Invoke `/vs-elena create brownfield` — Elena will:
- Read discovery report, ADRs, and memory
- Create a phased improvement plan starting with stabilization (Phase 0)
- Plan new features only after foundation is solid
- Output `docs/plan.md` with brownfield-appropriate phases

## On Activation

1. Check if the project has existing code (look for `src/`, `app/`, `package.json`, `requirements.txt`, `*.py`, `*.js`, `*.ts`, etc.)
2. If **no code found**: This is a greenfield project — say: *"This looks like a new project. Use `/vs-john` or `/vs-sofia` to start from scratch instead."* and stop.
3. If **code found**: Run the 3-step flow above in sequence
4. After all 3 steps complete, summarize:

```
## Onboarding Complete!

### What was created:
- docs/project-brief.md — Project overview (from codebase analysis)
- docs/memory.md — Stack, conventions, known issues, tech debt
- docs/architecture-decisions/ — ADRs for existing architecture
- docs/plan.md — Improvement plan (brownfield phases)

### Next steps:
- Review the generated docs and correct anything Sofia/Marcus got wrong
- Run `/vs-plan next` to start working on the first improvement step
- Or run `/vs-john` to let John coordinate the team from here
```

## Important Notes

- This is a **read-then-document** flow — no code changes are made
- Sofia, Marcus, and Elena will ask clarifying questions if they can't infer something from the code
- The generated docs are a starting point — the user should review and refine them
- After onboarding, the normal Development Loop applies for all new work
