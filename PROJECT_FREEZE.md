# PROJECT_FREEZE.md — NagarDrishti Baseline Freeze & Reconciliation

---
## 1. Freeze Metadata
- **Freeze Date**: August 11, 2026 (00:59 IST) / August 10, 2026 (19:35 UTC)
- **Git Commit Hash**: `0fbda345bffcdf162be0745f7343fdbd4a5a6527`
- **Environment & Runtime**:
  - Python: `3.13.11`
  - OS: Windows 11
  - Web Framework: `FastAPI 0.110.0` / `Starlette`
  - Database: PostgreSQL 15 (running on `localhost:5432/urbanmind_db`)
  - Vector Store: `qdrant-client 1.10.0` (local embedded path `./qdrant_db`)
  - ORM & Driver: SQLAlchemy 2.0 (asyncio) + `asyncpg 0.29.0`
  - Password Hashing: `argon2-cffi 21.3.0`
  - JWT Signing: `python-jose 3.3.0` (HS256)

---
## 2. Actual Repository Architecture

```
NagarDrishti/
├── app/
│   ├── main.py                     # FastAPI app, lifespan, CORS, middleware setup
│   ├── api/v1/
│   │   ├── router.py               # Main V1 router including complaints, incidents, monitoring
│   │   └── endpoints/
│   │       ├── complaints.py       # POST /complaints (public), GET /complaints (protected)
│   │       ├── incidents.py        # GET /incidents, GET /incidents/{id} (protected)
│   │       ├── monitoring.py       # GET /health, /live, /ready, /metrics
│   │       └── health.py           # Standalone health route (deprecated duplicate)
│   ├── core/
│   │   ├── config.py               # Pydantic BaseSettings (DB, JWT, Gemini, Qdrant config)
│   │   ├── database.py             # Async engine & sessionmaker (postgresql+asyncpg)
│   │   ├── logging_config.py      # Structlog/JSON logger configuration ("nagardrishti")
│   │   ├── qdrant.py               # Qdrant client initialization (path="./qdrant_db")
│   │   └── security.py             # Argon2 password hashing & JWT create/decode
│   ├── dependencies/
│   │   └── auth.py                 # get_current_user (JWT Bearer) & require_roles (RBAC)
│   ├── enums/
│   │   ├── account_status.py       # Active, Suspended, Locked, Deactivated
│   │   ├── department.py           # Water, Roads, Electricity, Sanitation
│   │   ├── token_type.py           # Access, Refresh
│   │   └── user_role.py            # Citizen, Officer, DepartmentAdmin, SystemAdmin
│   ├── exceptions/
│   │   └── base.py                 # UrbanMindException & sub-exceptions (500, 502, 401, 422)
│   ├── middleware/
│   │   ├── correlation.py          # Request correlation ID header/context
│   │   ├── rate_limit.py           # In-memory IP rate limiter (100 req / 60 s)
│   │   └── security.py             # HSTS, CSP, X-Frame-Options, X-Content-Type-Options headers
│   ├── models/
│   │   ├── __init__.py             # Exports Incident, Complaint, User
│   │   ├── complaint.py           # Complaint model (raw_text, location, metadata, incident_id FK)
│   │   ├── incident.py            # Incident model (title, department, priority, summary)
│   │   └── user.py                # User model (Argon2 hash, role, account_status, version)
│   ├── repositories/
│   │   ├── base.py                 # Generic BaseRepository CRUD & optimistic locking
│   │   ├── complaint_repository.py # Complaint-specific repository
│   │   └── incident_repository.py  # Incident-specific repository with preloading
│   ├── schemas/
│   │   ├── complaint.py           # ComplaintCreate, ExtractedComplaintMetadata, ComplaintResponse
│   │   └── incident.py            # IncidentResponse, IncidentDetailResponse (computed duplicate_count)
│   ├── services/
│   │   ├── gemini_service.py       # Gemini metadata extraction & embedding (with mock fallback)
│   │   ├── incident_engine.py      # IncidentDecisionEngine (0.82 similarity, guardrails, composite)
│   │   ├── incident_service.py     # Orchestrates 10-stage complaint deduplication pipeline
│   │   └── vector_service.py       # Qdrant upsert & similarity search wrapper
│   ├── utils/
│   │   ├── image_validator.py      # File extension & size validation
│   │   └── sanitizer.py            # HTML tag stripping & XSS sanitization
│   └── workers/
│       └── tasks.py                # Placeholder Celery task decorator (inactive)
├── alembic/
│   ├── env.py                      # Async Alembic environment script
│   └── versions/
│       └── 7eb115524e5e_initial_schema.py # Initial migration revision
├── tests/
│   ├── conftest.py                 # sys.path setup for pytest
│   ├── test_auth_integration.py    # 20 JWT/RBAC/Argon2 integration tests
│   ├── test_incident_clustering.py # IncidentService process_new_complaint pipeline tests
│   ├── test_incident_engine.py     # IncidentDecisionEngine guardrail & composite score tests
│   ├── test_repositories.py        # BaseRepository optimistic locking tests
│   └── test_security_auth.py       # Security utilities tests
├── pytest.ini                      # asyncio_mode = auto, testpaths = tests
├── .env                            # Active environment file (tracked on disk)
├── .env.example                    # Redacted configuration template
└── docker-compose.yml              # PostgreSQL & Qdrant local services configuration
```

---
## 3. Classification of Components

### A. VERIFIED WORKING
- **FastAPI Web Core**: `app.title = "NagarDrishti AI Engine"`. Starts cleanly via Uvicorn/TestClient.
- **Monitoring & Health Endpoints**: `/api/v1/health` (200), `/api/v1/live` (200), `/api/v1/ready` (200), `/api/v1/metrics` (200).
- **Security Middlewares**: `SecurityHeadersMiddleware` (CSP, HSTS, X-Frame-Options), `RateLimiterMiddleware` (100 req/60s), `CORSMiddleware`.
- **Argon2 Password Hashing**: `hash_password()` and `verify_password()` working using `argon2-cffi`. Unique salt per hash verified.
- **JWT Helper Functions**: `create_access_token()`, `create_refresh_token()`, `decode_token()` working using `python-jose` (HS256). Expiration & claim checks verified.
- **JWT & RBAC Dependencies**: `get_current_user` extracts Bearer JWT token, checks DB `User` active status. `require_roles` enforces role restrictions (`UserRole.OFFICER`, etc.). Tested across 20 unit tests.
- **PostgreSQL Database Connectivity**: Async connection via `postgresql+asyncpg://` succeeds. Auto-creation of `incidents` and `complaints` tables at startup verified.
- **Qdrant Collection Initialization**: Collection `complaint_embeddings` initialized with 768 dimensions and Cosine metric.
- **Qdrant Vector Upsert**: `vector_service.upsert_complaint()` succeeds when using valid UUID point IDs.
- **Incident Decision Engine**: `IncidentDecisionEngine.evaluate_merge_candidate()` verified (0.82 similarity cutoff, department hard guardrail, recency, location, priority, density).
- **Test Suite**: `python -m pytest -v` passes 27/27 tests with 0 warnings.

### B. IMPLEMENTED BUT NOT VERIFIED / PARTIALLY WORKING
- **Complaint Submission Endpoint (`POST /api/v1/complaints/`)**: Ingests complaint, extracts metadata, creates Complaint and Incident records in PostgreSQL. However, vector search failure causes every complaint to create a new incident rather than deduplicating.
- **Gemini Extraction & Embedding**: Real Gemini API calls (`gemini-1.5-flash` and `text-embedding-004`) fail with `404 NOT_FOUND` using current `.env` API key. Retries 3 times with backoff, then successfully falls back to deterministic mock metadata and 768-dim mock vector.
- **Alembic Migration System**: Async `env.py` and revision script `7eb115524e5e_initial_schema.py` exist. However, `users` table does NOT exist in actual PostgreSQL DB because `alembic upgrade head` was not executed after adding `User` model to `models/__init__.py`.

### C. BROKEN
- **Qdrant Similarity Search (`VectorService.search_similar_complaints`)**: Calls `client.search(...)`, which does NOT exist on `QdrantClient` in `qdrant-client` 1.10 local mode (`QdrantClient` uses `query_points()`). At runtime, this raises `AttributeError: 'QdrantClient' object has no attribute 'search'`, which is caught by a try/except block in `vector_service.py` and silently returns `[]`.

### D. NOT IMPLEMENTED
- **User Authentication Endpoints (`POST /auth/login`, `POST /auth/register`)**: No endpoints exist for user registration or credential-based login. Real users cannot obtain a JWT through the API.
- **Background Workers**: `app/workers/tasks.py` contains an unused Celery task decorator. No Redis broker or Celery worker process is configured or running. Ingestion is synchronous.
- **Frontend User Interface**: No `frontend/` directory or UI codebase exists. Repo is backend-only.
- **CI/CD Pipeline**: No `.github/workflows` directory or automated build configuration exists.

---
## 4. Exact Test Verification Results

Command: `python -m pytest -v` & `python -m pytest --cov=app --cov-report=term-missing`

- **Items Collected**: 27
- **Passed**: 27
- **Failed**: 0
- **Errors**: 0
- **Warnings**: 0
- **Total Statement Coverage**: 54% (916 total statements, 418 missed)

### Test Suite Inventory
1. `tests/test_auth_integration.py` (20 tests):
   - `test_access_token_contains_correct_claims` (PASSED)
   - `test_refresh_token_type_claim` (PASSED)
   - `test_access_token_decode_fails_when_using_refresh_secret` (PASSED)
   - `test_expired_token_raises_security_exception` (PASSED)
   - `test_malformed_token_raises_security_exception` (PASSED)
   - `test_empty_token_raises_security_exception` (PASSED)
   - `test_user_role_enum_values` (PASSED)
   - `test_user_role_values` (PASSED)
   - `test_password_hash_is_not_plaintext` (PASSED)
   - `test_correct_password_verifies_true` (PASSED)
   - `test_wrong_password_verifies_false` (PASSED)
   - `test_each_hash_is_unique` (PASSED)
   - `test_get_current_user_no_credentials_raises_401` (PASSED)
   - `test_get_current_user_invalid_token_raises_401` (PASSED)
   - `test_get_current_user_valid_token_but_user_not_in_db_raises_401` (PASSED)
   - `test_get_current_user_inactive_user_raises_403` (PASSED)
   - `test_get_current_user_active_user_returns_dict` (PASSED)
   - `test_require_roles_permitted_role_passes` (PASSED)
   - `test_require_roles_insufficient_role_raises_403` (PASSED)
   - `test_require_roles_system_admin_passes_any_protected_route` (PASSED)
2. `tests/test_incident_clustering.py` (2 tests):
   - `test_process_new_complaint_creates_new_incident` (PASSED)
   - `test_process_new_complaint_clusters_to_existing_incident` (PASSED)
3. `tests/test_incident_engine.py` (2 tests):
   - `test_incident_engine_department_mismatch_never_merges` (PASSED)
   - `test_incident_engine_same_department_high_similarity_merges` (PASSED)
4. `tests/test_repositories.py` (1 test):
   - `test_base_repository_optimistic_locking_conflict` (PASSED)
5. `tests/test_security_auth.py` (2 tests):
   - `test_password_hashing_and_verification` (PASSED)
   - `test_jwt_token_encode_decode` (PASSED)

---
## 5. Exact API Inventory

| Method | Endpoint Path | Auth Required | Status | Handled By |
|---|---|---|---|---|
| `GET` | `/docs` | None | 200 OK | FastAPI Swagger UI |
| `GET` | `/api/v1/health` | None | 200 OK | `app/api/v1/endpoints/monitoring.py` |
| `GET` | `/api/v1/live` | None | 200 OK | `app/api/v1/endpoints/monitoring.py` |
| `GET` | `/api/v1/ready` | None | 200 OK | `app/api/v1/endpoints/monitoring.py` |
| `GET` | `/api/v1/metrics` | None | 200 OK | `app/api/v1/endpoints/monitoring.py` |
| `POST` | `/api/v1/complaints/` | None | 201 Created | `app/api/v1/endpoints/complaints.py` |
| `GET` | `/api/v1/complaints/` | JWT Bearer (`Officer+`) | 401 Unauth | `app/api/v1/endpoints/complaints.py` |
| `GET` | `/api/v1/complaints/{id}` | JWT Bearer (`Officer+`) | 401 Unauth | `app/api/v1/endpoints/complaints.py` |
| `GET` | `/api/v1/incidents/` | JWT Bearer (`Officer+`) | 401 Unauth | `app/api/v1/endpoints/incidents.py` |
| `GET` | `/api/v1/incidents/{id}` | JWT Bearer (`Officer+`) | 401 Unauth | `app/api/v1/endpoints/incidents.py` |
| `POST` | `/auth/login` | — | **NOT IMPLEMENTED** | Missing Router |
| `POST` | `/auth/register` | — | **NOT IMPLEMENTED** | Missing Router |

---
## 6. Detailed Layer Verification

### A. Authentication State
- **Active Auth Mechanism**: JWT Bearer token (`Authorization: Bearer <jwt>`).
- **Dependencies**: `get_current_user` decodes token and queries `User` table; `require_roles` verifies `UserRole`.
- **Legacy Auth (`X-API-KEY`)**: Completely removed from active endpoint paths. Remains only as unused `OFFICER_API_KEY` setting in `config.py`.
- **Gap**: No login or registration router exists. JWTs cannot be generated via HTTP endpoints.

### B. Database State
- **PostgreSQL Connection**: Operational on `localhost:5432/urbanmind_db`.
- **Actual DB Tables**: `incidents` (9 cols), `complaints` (7 cols), `alembic_version` (1 col).
- **Missing Table in DB**: `users` table defined in SQLAlchemy model is NOT in actual database because startup `create_all` ran before `User` was registered in `models/__init__.py`, and `alembic upgrade head` was not executed.
- **Alembic**: Current head in DB is marked `7eb115524e5e`, but DDL for `users` table was never applied.

### C. Qdrant Vector Store State
- **Mode**: Local embedded directory (`./qdrant_db`).
- **Collection**: `complaint_embeddings` (768 dimensions, Cosine metric).
- **Upsert**: Functional when point IDs are valid UUID strings.
- **Search**: BROKEN due to `client.search` method missing on `QdrantClient` in 1.10.

### D. AI Pipeline State
- **Extraction**: `GeminiService.extract_metadata` calls `gemini-1.5-flash`.
- **Embedding**: `GeminiService.generate_embedding` calls `text-embedding-004`.
- **API Status**: Key in `.env` returns `404 NOT_FOUND`. Service retries 3 times then invokes mock extraction and mock 768-dim vector fallback.
- **Fallback**: Functional and deterministic.

### E. Security State
- **Passwords**: Argon2 hashing (`argon2-cffi`, time_cost=2, memory_cost=102400).
- **Headers**: CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff.
- **Rate Limiting**: 100 requests per 60 seconds per IP.
- **Secrets in Source**: `.env` file on disk contains raw `POSTGRES_PASSWORD` and `GEMINI_API_KEY`. (File is excluded in `.gitignore`).

---
## 7. Known Contradictions in Documentation (Reconciled)

1. **`X-API-Key` vs JWT**: `README.md` and `docs/codebase/` claim protected endpoints use `X-API-Key` header. **Fact**: Code uses JWT Bearer tokens via `require_roles`.
2. **Login Flow**: Documentation references authenticated users. **Fact**: `/auth/login` and `/auth/register` endpoints are not implemented.
3. **Qdrant Search**: Documentation claims deduplication pipeline is operational. **Fact**: Runtime vector search fails due to `client.search` method name mismatch, causing fallback to zero matches.
4. **Database Migration**: Context claimed migrations were missing. **Fact**: Migration file exists, but `users` table has not been created in live DB.

---
## 8. DO NOT CLAIM Section (Explicit Boundaries)

- **DO NOT CLAIM** the system is production-ready.
- **DO NOT CLAIM** users can log in or register via the API.
- **DO NOT CLAIM** Qdrant semantic deduplication works end-to-end at runtime (it fails silently due to `client.search` AttributeError).
- **DO NOT CLAIM** real Gemini API calls succeed with the configured `.env` key (it relies on mock fallback).
- **DO NOT CLAIM** background tasks are processed asynchronously (Celery/Redis worker is not active).
- **DO NOT CLAIM** a frontend UI exists.
- **DO NOT CLAIM** `users` table exists in the live PostgreSQL database.

---
## 9. Recommended Next Development Phase

1. **Fix Qdrant Search API**: Update `vector_service.py` to use `client.query_points()` instead of `client.search()` so runtime vector search succeeds.
2. **Apply DB Migrations**: Execute `alembic upgrade head` (or sync schema) so `users` table is created in PostgreSQL.
3. **Implement Auth Endpoints**: Add `POST /api/v1/auth/register` and `POST /api/v1/auth/login` so users can register and obtain JWT Bearer tokens.
4. **Fix Gemini API Key / Model Name**: Configure valid Gemini API credentials or update model version strings if live LLM extraction is desired.
