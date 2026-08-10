# 10_RATE_LIMITING.md

## 🚦 Client-IP Rate Limiting

To protect API endpoints from brute-force attempts and Denial of Service (DoS) attacks, NagarDrishti implements an IP-based sliding-window rate limiter.

### Middleware Implementation
- Code Reference: [rate_limit.py](file:///d:/Project/NagarDrishti/app/middleware/rate_limit.py)
- Applied globally in [main.py](file:///d:/Project/NagarDrishti/app/main.py):
  ```python
  app.add_middleware(RateLimiterMiddleware, limit=100, window_seconds=60)
  ```

### How It Works

1. **Exempt Routes:**
   - Routes like `/api/v1/health`, `/docs`, and `/openapi.json` bypass rate limiting to prevent monitoring failures.
2. **Sliding-Window Tracking:**
   - Tracks request timestamps in an in-memory dictionary keyed by client IP (`request.client.host`).
   - Cleans up timestamps older than `60 seconds` on each request.
3. **Rejection Handling:**
   - If the number of requests from an IP exceeds the limit (`100` within `60` seconds), it rejects the request with an `HTTP 429 Too Many Requests` error.
   - It includes a `retry_after` field in the response payload indicating when the limit will reset.

---

**Proceed** to the next document: [11_CORRELATION_TRACKING.md](file:///d:/Project/NagarDrishti/docs/codebase/11_CORRELATION_TRACKING.md)
