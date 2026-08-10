# 15_ERROR_HANDLING.md

## 🚨 Error Handling & Custom Exceptions

NagarDrishti defines structured, typed exceptions for common application failures.

### Exception Hierarchy
- Code Reference: [base.py](file:///d:/Project/NagarDrishti/app/exceptions/base.py)

```
                       ┌─────────────────────┐
                       │ UrbanMindException  │
                       │ (Base App Error)    │
                       └──────────┬──────────┘
             ┌────────────────────┼───────────────────┐
             ▼                    ▼                   ▼
┌───────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│RepositoryException│    │   AIException    │    │SecurityException │
│ (PostgreSQL CRUD) │    │ (Gemini/Embed)   │    │  (Authentication)│
└───────────────────┘    └──────────────────┘    └──────────────────┘
```

### Exception Details

- **`RepositoryException`:** Raised on database query failures or optimistic locking conflicts. Returns an HTTP 500 error.
- **`AIException`:** Raised when Gemini API calls or embedding generation tasks fail. Returns an HTTP 502 Bad Gateway error.
- **`VectorStoreException`:** Raised on Qdrant connection issues. Returns an HTTP 502 Bad Gateway error.
- **`SecurityException`:** Raised on invalid credentials or API key mismatches. Returns an HTTP 401 Unauthorized or HTTP 403 Forbidden error.
- **`ValidationException`:** Raised on schema validation failures. Returns an HTTP 422 Unprocessable Entity error.

---

**Proceed** to the next document: [16_DEPENDENCY_GRAPH.md](file:///d:/Project/NagarDrishti/docs/codebase/16_DEPENDENCY_GRAPH.md)
