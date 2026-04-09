# API Integration Patterns Reference

## Pagination Strategies

### Cursor-based (preferred for large datasets)
```
GET /items?cursor=abc123&limit=50
Response: { data: [...], next_cursor: "def456", has_more: true }
```
- Use when: API supports it, data changes frequently
- Implementation: loop until `has_more` is false

### Offset-based
```
GET /items?offset=0&limit=50
Response: { data: [...], total: 500 }
```
- Use when: API only supports offset, dataset is small/stable
- Watch out for: data shifting between pages

## Retry Strategy

### Exponential Backoff
```
attempt 1: wait 1s
attempt 2: wait 2s
attempt 3: wait 4s
max retries: 3-5
```
- Retry on: 429 (rate limited), 500, 502, 503, 504
- Do NOT retry on: 400, 401, 403, 404, 422

### Rate Limiting
- Respect `Retry-After` header when present
- Implement token bucket or sliding window for proactive rate limiting
- Log rate limit events for monitoring

## Authentication Patterns

### API Key
- Pass in header: `X-API-Key: {key}` or `Authorization: Bearer {key}`
- Store in environment variables, never in code

### OAuth 2.0
- Client Credentials flow for server-to-server
- Authorization Code flow for user-delegated access
- Refresh tokens before expiry (buffer of 60s)

### Token Management
- Cache tokens with TTL
- Handle token refresh transparently in the client
- Log auth failures at WARNING level

## Error Handling

### Structured Error Response
```python
class ApiError:
    status_code: int
    error_type: str      # "rate_limit", "auth", "validation", "server"
    message: str
    retry_after: int?    # seconds, if rate limited
    raw_response: dict   # original API response for debugging
```

### Error Categories
| HTTP Status | Type | Action |
|-------------|------|--------|
| 400 | validation | Fix request, do not retry |
| 401 | auth | Refresh token, retry once |
| 403 | auth | Check permissions, do not retry |
| 404 | not_found | Handle gracefully |
| 429 | rate_limit | Wait and retry |
| 500-504 | server | Retry with backoff |

## Service Layer Pattern

```
API Schema → Models (types) → Client (HTTP) → Service (business logic)
```

- **Models**: Generated from schema, typed, validated
- **Client**: Handles HTTP, auth, retries, pagination — no business logic
- **Service**: Business-level methods that the app calls — translates between domain and API
