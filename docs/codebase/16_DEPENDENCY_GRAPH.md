# 16_DEPENDENCY_GRAPH.md

## 🕸️ Codebase Import & Dependency Graph

To prevent circular imports and keep dependencies clean, NagarDrishti organizes imports in a unidirectional flow.

### Direct Import Dependencies

```
[ API Endpoints ]
   │
   ├── Imports Schemas (Pydantic validations)
   ├── Enforces Security dependencies (app/dependencies/auth.py)
   └── Calls IncidentService
         │
         ▼
[ Services Layer (app/services/) ]
   ├── Calls Gemini & Vector Services
   ├── Calls IncidentDecisionEngine
   └── Calls Repository Classes (app/repositories/)
         │
         ▼
[ Repositories Layer ]
   ├── Executes Queries via AsyncSession (app/core/database.py)
   └── Maps DB Records to Models (app/models/)
```

### Import Rules

1. **Unidirectional Flow:** Higher-level layers (endpoints) can import from lower-level layers (services, schemas), but lower-level layers must never import from higher-level ones.
2. **Models Registration:** Models must register with the SQLAlchemy metadata on application startup. This is handled by importing the models package in [main.py](file:///d:/Project/NagarDrishti/app/main.py):
   ```python
   import app.models
   ```
3. **No Circular Imports:** Service classes must never import other service classes directly. Inter-service communication should be managed by higher-level orchestrator services or API routers.

---

**Proceed** to the next document: [17_DESIGN_DECISIONS.md](file:///d:/Project/NagarDrishti/docs/codebase/17_DESIGN_DECISIONS.md)
