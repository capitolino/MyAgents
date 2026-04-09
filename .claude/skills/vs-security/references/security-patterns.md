# Security Reference Patterns

## OWASP Top 10 Checklist (2021)

| # | Risk | Key checks |
|---|------|-----------|
| A01 | Broken Access Control | Every route checks authorization; no IDOR; enforce least privilege |
| A02 | Cryptographic Failures | No PII/passwords in plaintext; TLS everywhere; strong hashing |
| A03 | Injection | Parameterized queries; no `eval`; sanitize before shell/OS calls |
| A04 | Insecure Design | Threat model exists; auth flows reviewed; rate limiting in place |
| A05 | Security Misconfiguration | No default credentials; debug off in prod; no unnecessary services |
| A06 | Vulnerable Components | Dependencies up to date; CVE scan before release |
| A07 | Auth & Session Failures | Brute-force protection; session invalidation on logout; MFA available |
| A08 | Software & Data Integrity | Dependency lockfiles; signed artifacts; no unverified CDN scripts |
| A09 | Logging & Monitoring | Auth failures logged; sensitive data NOT logged; alerts on anomalies |
| A10 | SSRF | Validate/allowlist URLs before outbound requests |

---

## Authentication Patterns

### Password storage
```python
# Python — always use bcrypt or argon2
from argon2 import PasswordHasher
ph = PasswordHasher()
hash = ph.hash(password)          # on register
ph.verify(hash, password)         # on login — raises exception if wrong

# Never: md5, sha1, sha256 alone (no salt, too fast)
# Acceptable: bcrypt (cost ≥ 12), argon2id (preferred)
```

```javascript
// Node — bcrypt
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 12);    // on register
const match = await bcrypt.compare(password, hash); // on login
```

### JWT (stateless API auth)
```
Access token:  short-lived (15min – 1h), signed with HS256 or RS256
Refresh token: long-lived (7–30 days), stored httpOnly cookie, rotated on use
Storage: access token in memory (SPA) or httpOnly cookie — NEVER localStorage

Checklist:
  [ ] Validate signature on every request
  [ ] Check exp claim — reject expired tokens
  [ ] Check aud/iss claims
  [ ] Rotate refresh tokens on use (refresh token rotation)
  [ ] Revoke refresh tokens on logout (store in DB or Redis)
  [ ] Short access token lifetime limits blast radius of leaked tokens
```

### Session-based auth
```
Checklist:
  [ ] Session ID: min 128 bits, cryptographically random (use framework defaults)
  [ ] Cookie flags: Secure, HttpOnly, SameSite=Lax (or Strict)
  [ ] Regenerate session ID after login (prevent session fixation)
  [ ] Invalidate session on logout (server-side deletion)
  [ ] Idle timeout + absolute timeout
  [ ] CSRF token for state-changing operations (or use SameSite=Strict)
```

### OAuth2 / OIDC
```
Authorization Code + PKCE (for SPAs and mobile — replaces implicit flow)
Authorization Code (for server-side apps with client_secret)

Checklist:
  [ ] Validate state parameter (CSRF protection)
  [ ] Validate PKCE code_verifier (SPAs)
  [ ] Validate id_token signature and claims (iss, aud, exp, nonce)
  [ ] Never use implicit flow (deprecated)
  [ ] Store access/refresh tokens server-side, not in localStorage
```

---

## Authorization Patterns

### RBAC (Role-Based Access Control)
```python
# Define roles and permissions centrally
PERMISSIONS = {
    'admin': ['read', 'write', 'delete', 'manage_users'],
    'editor': ['read', 'write'],
    'viewer': ['read'],
}

def require_permission(permission):
    def decorator(f):
        def wrapper(*args, **kwargs):
            if permission not in PERMISSIONS.get(current_user.role, []):
                raise Forbidden("Insufficient permissions")
            return f(*args, **kwargs)
        return wrapper
    return decorator

# Usage
@require_permission('delete')
def delete_record(id): ...
```

### Resource ownership check (prevent IDOR)
```python
# Bad — anyone with a valid session can access any record
def get_invoice(invoice_id):
    return db.query(Invoice).filter_by(id=invoice_id).first()

# Good — always scope to current user
def get_invoice(invoice_id, current_user):
    invoice = db.query(Invoice).filter_by(id=invoice_id, user_id=current_user.id).first()
    if not invoice:
        raise NotFound()  # 404, not 403 — don't confirm existence
    return invoice
```

---

## Input Validation

### SQL — always parameterized
```python
# Bad
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# Good
cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
# or with ORM (SQLAlchemy, Django ORM) — parameterized by default
```

### Shell commands — avoid, validate if unavoidable
```python
# Bad
os.system(f"convert {filename} output.png")

# Better — use libraries, not shell
from PIL import Image
img = Image.open(filename)

# If shell is unavoidable — use list form, never string interpolation
import subprocess
subprocess.run(["convert", filename, "output.png"], check=True)
```

### XSS — output encoding
```
- Template engines (Jinja2, Handlebars, React JSX): auto-escape by default — don't disable it
- Jinja2: never use |safe on untrusted input
- React: never use dangerouslySetInnerHTML with user input
- Content-Security-Policy header: blocks inline scripts as defense-in-depth
```

---

## Secrets Management

```
Rules:
  [ ] Never commit secrets to git (use .gitignore for .env)
  [ ] Use .env.example with empty values — document every variable
  [ ] In production: use platform secret manager (Railway, Vercel env vars, AWS SSM)
  [ ] Rotate secrets if accidentally exposed — immediately
  [ ] Different secrets for dev/staging/prod

Detection: run `git log -p | grep -i "secret\|password\|api_key\|token"` to check history
```

---

## Secure Cookie Config

```python
# Python / Flask
app.config.update(
    SESSION_COOKIE_SECURE=True,      # HTTPS only
    SESSION_COOKIE_HTTPONLY=True,    # No JS access
    SESSION_COOKIE_SAMESITE='Lax',   # CSRF protection
)

# Python / FastAPI with starlette
response.set_cookie(
    key="session",
    value=token,
    httponly=True,
    secure=True,
    samesite="lax",
    max_age=3600,
)
```

```javascript
// Express
res.cookie('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 3600 * 1000,
});
```

---

## Rate Limiting

```python
# FastAPI — slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/login")
@limiter.limit("5/minute")   # block brute force
async def login(request: Request, ...): ...
```

```javascript
// Express — express-rate-limit
const rateLimit = require('express-rate-limit');
app.use('/api/auth', rateLimit({ windowMs: 60_000, max: 5 }));
```

Apply rate limiting to:
- Login / register / password reset endpoints
- OTP / MFA verification endpoints
- Any endpoint that sends emails or SMS

---

## Security Headers

```python
# Python — add to all responses
headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), camera=()",
}
```

Use `helmet` (Express) or `secure-headers` (FastAPI/Flask) middleware to apply all at once.
