# 06_DATABASE_SCHEMA.md

## 🗄️ Relational Database Schema & Models

NagarDrishti utilizes PostgreSQL for relational persistence, structured query operations, and data integrity.

### Entity-Relationship Diagram

```
┌──────────────────┐             ┌──────────────────┐
│     incidents    │             │    complaints    │
├──────────────────┤             ├──────────────────┤
│ id (PK)          │1           *│ id (PK)          │
│ title            ├────────────>│ raw_text         │
│ department       │             │ location         │
│ issue_type       │             │ image_url        │
│ priority         │             │ incident_id (FK) │
│ location         │             │ ext_metadata     │
│ summary          │             │ created_at       │
│ created/updated  │             └──────────────────┘
└──────────────────┘
```

### Models Analysis

#### 1. Complaint Model (`complaints` table)
- Code Reference: [complaint.py](file:///d:/Project/NagarDrishti/app/models/complaint.py)
- **Primary Key:** `id` (String UUID generation).
- **Incident Link:** `incident_id` (ForeignKey linking to `incidents.id`, indexed for speed).
- **Audit Columns:**
  - `extracted_metadata` (JSON column containing raw AI attributes: `issue_type`, `department`, `priority`, `location`, `summary`, along with model credentials and timestamp).
  - `created_at` (DateTime with timezone support).

#### 2. Incident Model (`incidents` table)
- Code Reference: [incident.py](file:///d:/Project/NagarDrishti/app/models/incident.py)
- Represents grouped issues.
- **Relationship:** `complaints = relationship("Complaint", back_populates="incident", cascade="all, delete-orphan")`
- Columns:
  - `title`: Short label, maps to the initial complaint summary.
  - `department`: Indexed string.
  - `issue_type`: Standard issue class.
  - `priority`: Defaults to "Medium".
  - `location`: Inferred incident location.
  - `summary`: Inferred incident summary.

#### 3. User Model (`users` table)
- Code Reference: [user.py](file:///d:/Project/NagarDrishti/app/models/user.py)
- Handles user administration and officer roles.
- Features **Optimistic Locking** using SQLAlchemy `version_id_col` mapping:
  ```python
  version = Column(Integer, nullable=False, default=1)
  __mapper_args__ = {
      "version_id_col": version
  }
  ```
- Features **Soft Delete** logic via the `deleted_at` field.

---

**Proceed** to the next document: [07_VECTOR_STORE_SCHEMA.md](file:///d:/Project/NagarDrishti/docs/codebase/07_VECTOR_STORE_SCHEMA.md)
