# 05_FILE_INDEX.md

## 📂 Exhaustive Codebase File Index

This file indexes every significant module within the backend application directory, listing its responsibilities, dependencies, and imports.

### ⚙️ Core Modules (`app/core/`)

- [config.py](file:///d:/Project/NagarDrishti/app/core/config.py)
  - **Responsibility:** Configures application parameters using Pydantic Settings. Loads configurations from `.env` and validates environment variables.
  - **Imports:** `pydantic_settings.BaseSettings`, `pydantic.field_validator`.
- [database.py](file:///d:/Project/NagarDrishti/app/core/database.py)
  - **Responsibility:** Database connection management. Initializes the asynchronous SQLAlchemy engine and provides the `get_db()` session dependency.
  - **Imports:** `sqlalchemy.ext.asyncio.create_async_engine`, `sqlalchemy.ext.asyncio.AsyncSession`.
- [qdrant.py](file:///d:/Project/NagarDrishti/app/core/qdrant.py)
  - **Responsibility:** Vector database connection management. Initializes local embedded client collection on start.
  - **Imports:** `qdrant_client.QdrantClient`.
- [security.py](file:///d:/Project/NagarDrishti/app/core/security.py)
  - **Responsibility:** Cryptographic functions, password hashing (Argon2id), and JWT generation/validation.
  - **Imports:** `argon2.PasswordHasher`, `jwt`.
- [logging_config.py](file:///d:/Project/NagarDrishti/app/core/logging_config.py)
  - **Responsibility:** Formats logs as JSON strings including correlation IDs for tracing.
  - **Imports:** `logging.Formatter`.

### 🛡️ Middleware (`app/middleware/`)

- [security.py](file:///d:/Project/NagarDrishti/app/middleware/security.py)
  - **Responsibility:** Appends HTTP headers (CSP, HSTS, Clickjacking, MIME sniffing, and XSS mitigations) to responses.
  - **Imports:** `starlette.middleware.base.BaseHTTPMiddleware`.
- [rate_limit.py](file:///d:/Project/NagarDrishti/app/middleware/rate_limit.py)
  - **Responsibility:** Enforces request rate-limiting based on client IP. Excludes health and docs paths.
  - **Imports:** `starlette.responses.JSONResponse`.
- [correlation.py](file:///d:/Project/NagarDrishti/app/middleware/correlation.py)
  - **Responsibility:** Injects a correlation ID into request context for log tracing.
  - **Imports:** `contextvars.ContextVar`.

### 🗄️ Database Models (`app/models/`)

- [complaint.py](file:///d:/Project/NagarDrishti/app/models/complaint.py)
  - **Responsibility:** Defines the `Complaint` table representing individual citizen submissions.
- [incident.py](file:///d:/Project/NagarDrishti/app/models/incident.py)
  - **Responsibility:** Defines the `Incident` table representing clustered complaints.
- [user.py](file:///d:/Project/NagarDrishti/app/models/user.py)
  - **Responsibility:** Defines the `User` table for authentication, authorization roles, and security audit fields.

### 💾 Repositories (`app/repositories/`)

- [base.py](file:///d:/Project/NagarDrishti/app/repositories/base.py)
  - **Responsibility:** Implements the generic repository pattern. Supports optimistic locking, soft deletes, and transaction boundaries.
- [complaint_repository.py](file:///d:/Project/NagarDrishti/app/repositories/complaint_repository.py)
  - **Responsibility:** Database operations for `Complaint` entities.
- [incident_repository.py](file:///d:/Project/NagarDrishti/app/repositories/incident_repository.py)
  - **Responsibility:** Database operations for `Incident` entities, including relationship preloading.

### 🛠️ Services (`app/services/`)

- [gemini_service.py](file:///d:/Project/NagarDrishti/app/services/gemini_service.py)
  - **Responsibility:** Handles Google Gemini API calls for metadata extraction and embeddings. Includes exponential backoff retries.
- [vector_service.py](file:///d:/Project/NagarDrishti/app/services/vector_service.py)
  - **Responsibility:** Operations on Qdrant, including vector storage and semantic search.
- [incident_engine.py](file:///d:/Project/NagarDrishti/app/services/incident_engine.py)
  - **Responsibility:** Business rules engine evaluating duplicate merges.
- [incident_service.py](file:///d:/Project/NagarDrishti/app/services/incident_service.py)
  - **Responsibility:** Orchestrates the complaint ingestion pipeline.

---

**Proceed** to the next document: [06_DATABASE_SCHEMA.md](file:///d:/Project/NagarDrishti/docs/codebase/06_DATABASE_SCHEMA.md)
