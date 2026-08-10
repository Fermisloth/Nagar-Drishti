# 17_DESIGN_DECISIONS.md

## 📑 Technical Design Decisions

This document logs key design decisions and architectural trade-offs made during the development of NagarDrishti.

### 1. Hybrid Persistence Strategy (PostgreSQL + Qdrant)
- **Decision:** Split data storage between PostgreSQL and Qdrant DB.
- **Rationale:** 
  - PostgreSQL acts as the relational source of truth, managing transactional safety, referential integrity, and SQL reports.
  - Qdrant manages high-dimensional vector embeddings and similarity queries. Using an external vector database instead of in-database extensions like `pgvector` keeps the database size smaller and prevents database lockups under heavy query loads.

### 2. Local Embedded Qdrant Mode
- **Decision:** Run Qdrant in local embedded folder mode (`./qdrant_db`) for development.
- **Rationale:** 
  - Allows the system to run locally without requiring Docker or managing port configuration conflicts during initial development.
  - Can be easily transitioned to a standalone Qdrant service in production by updating the connection parameters.

### 3. Middleware-Level Security Controls
- **Decision:** Implement security headers and rate limits directly in FastAPI middleware.
- **Rationale:** 
  - Ensures these security controls are active in all development and containerized environments without relying on reverse-proxy (e.g., Nginx) configurations.
  - Enhances portability.

### 4. Custom Repository Wrapper
- **Decision:** Implement a generic `BaseRepository` class wrapping SQLAlchemy operations.
- **Rationale:** 
  - Standardizes common database patterns like optimistic locking, soft deletes, and pagination across all tables.
  - Prevents database-specific code from cluttering the business services layer.

---

**Proceed** to the next document: [18_DEVELOPMENT_WORKFLOW.md](file:///d:/Project/NagarDrishti/docs/codebase/18_DEVELOPMENT_WORKFLOW.md)
