# 11_CORRELATION_TRACKING.md

## 🔍 Request Correlation & Structured Logging

To track requests in high-concurrency production environments, NagarDrishti implements request correlation and structured JSON logging.

### Correlation ID Middleware
- Code Reference: [correlation.py](file:///d:/Project/NagarDrishti/app/middleware/correlation.py)
- Processes requests as follows:
  1. Checks for an `X-Correlation-ID` header in the incoming request. If missing, it generates a unique UUID4 string.
  2. Stores this ID in a thread-safe `contextvars.ContextVar`.
  3. Appends the correlation ID as an `X-Correlation-ID` header in the HTTP response.

---

### Structured JSON Logging
- Code Reference: [logging_config.py](file:///d:/Project/NagarDrishti/app/core/logging_config.py)
- Formats logs as JSON objects rather than raw strings:
  ```json
  {
    "timestamp": "2026-08-01T18:30:00.123456Z",
    "level": "INFO",
    "logger": "urbanmind",
    "correlation_id": "8e3b97cd-9f4a-4d2c-88c1-1fb8e61258ef",
    "message": "Invoking Gemini extraction attempt 1/3...",
    "module": "gemini_service",
    "func_name": "extract_metadata",
    "line_number": 68
  }
  ```
- This structured output makes logs easy to parse and query in monitoring tools like ELK, Datadog, or Grafana Loki.

---

**Proceed** to the next document: [12_IMAGE_VALIDATION.md](file:///d:/Project/NagarDrishti/docs/codebase/12_IMAGE_VALIDATION.md)
