# 02_ARCHITECTURE.md

## 🛠️ Tech Stack & Architecture

NagarDrishti separates business logic, AI operations, and persistence components to ensure scalability, ease of deployment, and high operational reliability.

### Overall System Block Diagram

```
[ Citizen Web Client ]
       │ (Submits complaint raw text, location, image)
       ▼
[ FastAPI App Container ]
   ├── Correlation ID & Security Middlewares
   ├── Authentication Guard (API Key / JWT verification)
   ├── Input Sanitizer (XSS Stripper)
   └── IncidentService Pipeline
         ├── GeminiService (Gemini-1.5-Flash extraction)
         ├── Vector Generation (text-embedding-004)
         ├── Vector Matching (Qdrant Client Vector DB)
         ├── IncidentDecisionEngine (Scoring logic)
         └── Repository Persistence (PostgreSQL async engine)
```

### Components Summary

1. **API Layer (FastAPI):**
   - Purely async, typing-driven endpoints.
   - Decoupled from service layer by using Pydantic Schemas for validation.
2. **Business Service Layer:**
   - [IncidentService](file:///d:/Project/NagarDrishti/app/services/incident_service.py) coordinates data retrieval, updates, and pipeline stages.
   - [IncidentDecisionEngine](file:///d:/Project/NagarDrishti/app/services/incident_engine.py) performs composite similarity calculations.
3. **AI Layer (Google Gemini API):**
   - Uses `gemini-1.5-flash` with structured Pydantic schema validation.
   - Uses `text-embedding-004` generating 768-dimensional float arrays.
4. **Relational Database (PostgreSQL):**
   - Connected via `asyncpg` driver in SQLAlchemy async engine.
   - Provides transactional ACID guarantees for Complaints, Incidents, and Users.
5. **Vector Store (Qdrant DB):**
   - Configured with Cosine Distance.
   - Runs locally in embedded folder mode under `./qdrant_db`.
6. **Task Broker (Celery & Redis):**
   - Offloads slow tasks like AI extraction into asynchronous background worker tasks.

---

**Proceed** to the next document: [03_AI_PIPELINE.md](file:///d:/Project/NagarDrishti/docs/codebase/03_AI_PIPELINE.md)
