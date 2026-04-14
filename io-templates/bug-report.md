# Bug Report: {short description}

**Date**: {YYYY-MM-DD}
**Reported by**: Diego (Debugger)
**Severity**: CRITICAL | HIGH | MEDIUM | LOW

> CRITICAL = data loss / security breach / production down
> HIGH = core feature broken, no workaround
> MEDIUM = degraded experience, workaround exists
> LOW = cosmetic issue or rare edge case

## Symptom

{What the user or system observes — exact error message, wrong behaviour, reproduction steps}

## Root Cause

{Why it actually happens — be specific: file:line if known. Distinguish root cause from symptom.}

## Evidence

- {Stack trace line X points to ...}
- {Log entry at [timestamp] shows ...}
- {The value of X at this point is Y instead of Z because ...}

## Contributing Factors

- {e.g. No input validation on this field}
- {e.g. Missing null check after DB query}

## Proposed Solutions

1. **[PRIMARY]** Fix X in file Y — minimal change, addresses root cause directly
2. **[ALTERNATIVE]** Fix at layer above — more defensive but slightly more work
3. **[WORKAROUND]** Only if root cause can't be fixed immediately — document why

## Regression Risk

- Files affected: ...
- Tests that should be added: ...
- Edge cases to watch: ...

## Action Items

- [ ] James implements fix | `/vs-james`
- [ ] Alex adds regression test | `/vs-alex`
- [ ] {If security-related} Ravi audits | `/vs-security audit`
