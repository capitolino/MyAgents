# Project Memory: {Project Name}

> Living document. All agents read this before starting work and append learnings after completing work.
> Format: `[YYYY-MM-DD] (Agent) Note`

---

## Stack & Environment

- **Language / Runtime**: {e.g. Python 3.12 / Node 20}
- **Framework**: {e.g. FastAPI / Express / React}
- **Database**: {SQLite (dev) / SQL Server (prod)}
- **Key libraries**: {list key dependencies}
- **Dev setup**: {how to run locally}

---

## Conventions

> Project-specific decisions that deviate from language/framework defaults.

<!-- Example:
- snake_case for all JS variables (team preference)
- All dates stored as UTC ISO strings, never Unix timestamps
- API responses always wrapped in { data, error, meta }
-->

---

## Architecture Notes

> Decisions too small for a full ADR but important enough to remember.

<!-- Example:
- [2026-04-09] (Marcus) Chose NOT to use Redux — useState is sufficient for current scope
- [2026-04-09] (James) Auth uses JWT in httpOnly cookie, not Authorization header
-->

---

## Known Issues & Workarounds

> Bugs, quirks, and their solutions. Never delete entries — mark as resolved instead.

<!-- Example:
- [2026-04-09] (Alex) Stripe rate limits at ~100 req/min on free tier — added 1.2s delay in PaymentService ✓ resolved
- [2026-04-10] (James) SQL Server datetime2 precision differs from SQLite — use ISO string comparison ⚠ open
-->

---

## Gotchas

> Things that will bite you if you forget them.

<!-- Example:
- `user_id` field is UUID not INT despite the name — legacy, do not change
- The `orders` table has soft deletes — always filter WHERE is_deleted = 0
- External API returns 200 even on errors — always check response.status field
-->

---

## External Dependencies & Quirks

> Notes on third-party APIs, services, and libraries.

<!-- Example:
- PaymentAPI: sandbox and prod use different base URLs (check .env)
- EmailService: rate limit 50/hour on free plan, queue large batches
- Auth provider token expiry is 1h but refresh token is 30 days
-->

---

## Test Coverage

> What's covered, what's not, and known gaps.

<!-- Example:
- Auth module: happy path + token expiry covered. Concurrent session edge case not yet tested.
- Payment flow: mocked in tests — no real Stripe calls in CI
- Framework: pytest (Python) / Jest (Node) — run with `pytest` or `npm test`
- Overall coverage: 84% — run `pytest --cov` or `npx jest --coverage`
-->

---

## Tech Debt

> Known shortcuts, deferred improvements, and accumulated complexity. Format: [date] (Agent) Description — priority: HIGH/MEDIUM/LOW

<!-- Example:
- [2026-04-09] (James) Auth token validation duplicated in 3 routes — should be middleware. priority: MEDIUM
- [2026-04-10] (Priya) N+1 query in invoices list endpoint — deferred until Phase 3. priority: HIGH
- [2026-04-11] (Alex) Integration tests only cover happy path for payment flow. priority: HIGH ✓ resolved 2026-04-15
-->

---

## Deployment

> Platform, environment variables required, and how to deploy.

<!-- Example:
- Platform: Railway (prod), Docker locally
- Required env vars: DATABASE_URL, SECRET_KEY, STRIPE_API_KEY — see .env.example
- Deploy: push to main → GitHub Actions runs tests → auto-deploys to Railway
- Rollback: Railway dashboard → Deployments → redeploy previous
- Logs: `railway logs` or Railway dashboard
-->

---

## Session Log

> Brief notes from each work session. Most recent first.

<!-- Example:
- [2026-04-09] (John) Completed Phase 1. Login + registration working. Started Phase 2 (dashboard).
- [2026-04-09] (Priya) Reviewed auth module — 2 CRITICAL findings fixed by James. Code is clean.
-->
