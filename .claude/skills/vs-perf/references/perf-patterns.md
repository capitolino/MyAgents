# Performance Reference Patterns

## When to Optimize

> "Premature optimization is the root of all evil." — but ignoring performance until users complain is the other extreme.

**Optimize when:**
- Response time > 500ms on a typical request (p95)
- A page load > 2s on a 4G connection
- A background job takes longer than its schedule interval
- A query returns more rows than the UI can display (missing pagination)
- CPU or memory grows unbounded over time (memory leak)

**Don't optimize until you've profiled** — find the actual bottleneck before changing anything.

---

## Backend Performance

### N+1 Query Detection (most common issue)

```python
# BAD — N+1: 1 query for orders + N queries for each user
orders = db.query(Order).all()
for order in orders:
    print(order.user.name)  # triggers separate query each time

# GOOD — eager load in one query
from sqlalchemy.orm import joinedload
orders = db.query(Order).options(joinedload(Order.user)).all()
```

```javascript
// BAD — N+1 in Express/Knex
const orders = await db('orders').select()
for (const order of orders) {
  order.user = await db('users').where('id', order.user_id).first() // N queries
}

// GOOD — JOIN or IN clause
const orders = await db('orders')
  .join('users', 'orders.user_id', 'users.id')
  .select('orders.*', 'users.name as user_name')
```

**Detection**: Look for DB calls inside loops. If the loop iterates over a DB result, it's almost certainly an N+1.

### Index Strategy

```sql
-- Always index:
-- 1. Foreign keys (if not auto-indexed)
-- 2. Columns used in WHERE clauses in hot paths
-- 3. Columns used in ORDER BY on large tables
-- 4. Composite index for multi-column WHERE

CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
-- Covers: WHERE user_id = ? ORDER BY created_at DESC

-- Check missing indexes (SQLite)
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE user_id = 1;
-- Look for "SCAN" — bad. "SEARCH USING INDEX" — good.
```

### Query Optimization Checklist
- [ ] Use `EXPLAIN` / `EXPLAIN QUERY PLAN` to verify indexes are used
- [ ] Paginate all list queries (`LIMIT` + `OFFSET` or cursor-based)
- [ ] Select only needed columns (`SELECT id, name` not `SELECT *`)
- [ ] Use `COUNT(1)` for existence checks, not `SELECT *`
- [ ] Avoid `LIKE '%term'` (can't use index) — use full-text search for fuzzy matching

### Caching Patterns

```python
# Simple in-memory cache (single process)
from functools import lru_cache

@lru_cache(maxsize=128)
def get_config(key: str) -> str:
    return db.query(Config).filter_by(key=key).first().value

# Redis cache (multi-process / distributed)
import redis
cache = redis.Redis()

def get_user(user_id: int):
    cached = cache.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)
    user = db.query(User).get(user_id)
    cache.setex(f"user:{user_id}", 300, json.dumps(user.to_dict()))  # 5min TTL
    return user
```

Cache strategy:
- Cache expensive reads that change infrequently (config, reference data, user profiles)
- **Never cache** user-specific data without scoping by user ID
- Set appropriate TTLs — shorter for dynamic data, longer for static
- Invalidate on write: when a user updates their profile, delete `user:{user_id}`

### Async / Background Jobs

```python
# Don't block the HTTP request for slow operations
# BAD — user waits for email to send
@app.post("/register")
def register(user_data):
    user = create_user(user_data)
    send_welcome_email(user.email)  # blocks 2-5 seconds
    return {"ok": True}

# GOOD — queue the email, respond immediately
@app.post("/register")
def register(user_data):
    user = create_user(user_data)
    queue.enqueue(send_welcome_email, user.email)  # returns instantly
    return {"ok": True}
```

Offload to background:
- Email / SMS sending
- Image/file processing
- PDF generation
- External API calls with no immediate response needed
- Data exports and reports

---

## Frontend Performance

### Core Web Vitals Targets

| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | When main content is visible |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability (no jumping) |
| FID / INP (Interaction to Next Paint) | < 200ms | Responsiveness to input |

### Bundle Size

```bash
# Analyze bundle — identify large dependencies
npx webpack-bundle-analyzer
# or for Next.js:
npx @next/bundle-analyzer

# Target: initial JS bundle < 200KB gzipped
```

Common culprits:
- `moment.js` → replace with `date-fns` or native `Intl`
- Large icon libraries → import individually, not the whole library
- `lodash` → import individual functions: `import debounce from 'lodash/debounce'`

### React Performance

```javascript
// Avoid re-renders with memo and useCallback
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  // Only re-renders when data or onAction changes
})

// Stable references — don't create functions/objects inline in JSX
// BAD — new function on every render
<Button onClick={() => handleClick(id)} />

// GOOD
const handleItemClick = useCallback(() => handleClick(id), [id])
<Button onClick={handleItemClick} />
```

### Image Optimization
- Use `<img loading="lazy">` for below-the-fold images
- Serve WebP with JPEG fallback
- Specify `width` and `height` to prevent layout shift
- Use CDN for large assets

### API Response Optimization
- Paginate lists — never return all rows
- Return only fields the UI needs (avoid overfetching)
- Use HTTP caching headers (`Cache-Control`, `ETag`) for static or rarely-changing data

---

## Load Testing

### Quick Load Test (k6)

```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,        // 50 virtual users
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:8000/api/invoices');
  check(res, { 'status 200': (r) => r.status === 200 });
}
```

```bash
k6 run load-test.js
```

### Load Testing Goals
- Baseline: measure current p50/p95/p99 response times under normal load
- Stress: find where the system degrades (2×, 5×, 10× normal traffic)
- Soak: run at normal load for 30+ minutes to detect memory leaks

### Profiling Tools

| Stack | Tool | Command |
|-------|------|---------|
| Python | cProfile | `python -m cProfile -o output.prof app.py` |
| Python | py-spy | `py-spy top --pid <PID>` |
| Node.js | clinic.js | `clinic doctor -- node server.js` |
| Node.js | built-in | `node --inspect server.js` + Chrome DevTools |
| SQLite | EXPLAIN | `EXPLAIN QUERY PLAN SELECT ...` |
| SQL Server | Query Store | Management Studio → Query Store |
| Browser | DevTools | Performance tab → record + analyze |
| Browser | Lighthouse | `npx lighthouse http://localhost:3000` |
