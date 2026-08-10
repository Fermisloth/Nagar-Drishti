# 14_REPOSITORIES_PATTERN.md

## 💾 The Repository Pattern

NagarDrishti uses the Repository pattern to isolate database queries and updates from the business service layer.

### Base Repository Design
- Code Reference: [base.py](file:///d:/Project/NagarDrishti/app/repositories/base.py)
- Features:

#### 1. Transaction Boundaries
Repositories are initialized with an `AsyncSession`, allowing them to participate in transaction blocks:
```python
async def begin_transaction(self):
    return self.db.begin()
```

#### 2. Optimistic Locking
Uses a version field to detect and prevent concurrent write conflicts:
```python
if hasattr(self.model, "version") and "version" in obj_in:
    current_version = getattr(db_obj, "version")
    if current_version != obj_in["version"]:
        raise RepositoryException("Conflict detected. Optimistic lock failed.")
    obj_in["version"] = current_version + 1
```

#### 3. Soft Delete
For models that support it, soft deletes are handled by setting the `is_deleted` column to `True` instead of removing the record from the database.

---

### Entity Repositories

- **Complaint Repository:** [complaint_repository.py](file:///d:/Project/NagarDrishti/app/repositories/complaint_repository.py)
  Handles `Complaint` DB actions.
- **Incident Repository:** [incident_repository.py](file:///d:/Project/NagarDrishti/app/repositories/incident_repository.py)
  Preloads nested relations using `selectinload` for optimized querying:
  ```python
  query = select(Incident).options(selectinload(Incident.complaints))
  ```

---

**Proceed** to the next document: [15_ERROR_HANDLING.md](file:///d:/Project/NagarDrishti/docs/codebase/15_ERROR_HANDLING.md)
