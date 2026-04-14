# Project Plan: {Project Name}

**Last updated**: {date}
**Current phase**: Phase {N} — {Phase Name}
**Next milestone**: {version or target}

---

## Phase 1: Foundation [v0.1 — scaffold + core setup]

> Target: {date or "week 1"}

- [ ] Set up project structure and environment | agent: vs-env-setup
- [ ] Design database schema | agent: vs-db-design
- [ ] Implement core data models | agent: James
- [ ] Write unit tests for models | agent: Alex
- [ ] Code review | agent: Priya

## Phase 2: Core Features [v1.0 — MVP release]

> Target: {date or "week 2-3"}

- [ ] Design auth system | agent: Ravi
- [ ] Design login/register UX | agent: Luna
- [ ] Implement auth endpoints | agent: James
- [ ] Implement main feature | agent: James
- [ ] Write tests | agent: Alex
- [ ] Code + security review | agent: Priya, Ravi
- [ ] UX review | agent: Luna

## Phase 3: Polish & Harden [v1.1]

> Target: {date}

- [ ] Performance profiling | agent: vs-perf
- [ ] Security audit | agent: Ravi
- [ ] Documentation | agent: Nina
- [ ] Deployment setup | agent: vs-deploy

<!-- Add more phases as needed for ongoing features -->

## Ongoing / Backlog

> Features planned for future releases. Move to a numbered phase when ready to start.

- [ ] {Future feature 1}
- [ ] {Future feature 2}

---

## Hotfixes

> Log hotfixes applied between planned phases.

<!-- Example:
- [x] [2026-04-15] Fix: login broken on mobile — James fix → Alex test → Priya review → deployed
-->

## Notes

- {Blockers, decisions needed, or changes from original plan}

---

### Step format reference

Each step should be 1-3 days of work. Use this format:
```
- [ ] Description | agent: {who does this} | depends: {step if blocked by another}
- [x] Completed step | agent: James | done: 2026-04-10
- [ ] ⚠️ BLOCKED: Description | reason: {why} | resolution: {path}
```
