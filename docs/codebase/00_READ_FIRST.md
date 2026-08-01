# 00_READ_FIRST.md

## 📖 Welcome to the NagarDrishti Backend Developer Handbook

**THIS IS NOT A SUMMARY.** This document is the first thing every new engineer (or SIH judge) must read **in its entirety** before touching any code.

### Why this handbook exists
- The codebase blends **AI pipelines**, **geospatial complaint handling**, **asynchronous FastAPI services**, and **security‑critical authentication**.  Understanding the whole stack is essential before making any change.
- The project follows **production‑grade standards** (optimistic locking, soft‑delete, JWT, Argon2, Alembic migrations, Docker, structured JSON logging).  These standards are documented here, not scattered across README files.
- The handbook is the **single source of truth** for architecture, design decisions, request flow, security model, and operational concerns.  It will be the reference for code reviews, audits, and the SIH judging panel.

### What you will learn by reading this file
1. **How the handbook is organized** – a map of the 20 markdown files that follow.
2. **The reading order** – why you should start with high‑level overviews before diving into low‑level file indexes.
3. **When to update the handbook** – guidelines for keeping the documentation in sync with code changes.
4. **Where to find the full documentation** – the path `docs/codebase/` inside the repository.

### How to use this handbook
- **Read sequentially**: start with `01_PROJECT_OVERVIEW.md`, then `02_ARCHITECTURE.md`, and so on.
- **Use internal links**: each document contains markdown links to the next sections and to the source files (e.g., `[User model](file:///d:/Project/NagarDrishti/app/models/user.py)`).
- **Bookmark the file index** (`05_FILE_INDEX.md`).  It is the exhaustive map of every Python file, its responsibilities, import graph, and lifecycle.
- **Refer to the design decisions** (`17_DESIGN_DECISIONS.md`) when you need justification for a technology choice.
- **If you add a new module** – add a new entry to `05_FILE_INDEX.md` and, if appropriate, update the dependency graph (`16_DEPENDENCY_GRAPH.md`).  The handbook is considered living documentation.

### When this file should be updated
- Whenever the folder structure (`app/` sub‑directories) changes.
- When the overall project scope (e.g., a new AI pipeline component) is altered.
- If the onboarding process or required reading order changes.

---

**Proceed** to the next document: `01_PROJECT_OVERVIEW.md`.
