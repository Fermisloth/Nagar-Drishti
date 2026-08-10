# 07_VECTOR_STORE_SCHEMA.md

## 📡 Vector Database Schema & Qdrant Configuration

NagarDrishti uses Qdrant for semantic similarity searches on complaint text.

### Collection Configuration

- **Collection Name:** `complaint_embeddings` (customizable via `QDRANT_COLLECTION_NAME`).
- **Vector Dimension:** `768` (matching Google's `text-embedding-004` output dimension).
- **Distance Metric:** **Cosine Similarity** (`Distance.COSINE`).

```python
# Collection initialization definition
client.create_collection(
    collection_name=self.collection_name,
    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
)
```

### Vector Payload Schema

To optimize search operations, each vector contains metadata payloads in Qdrant. This allows the system to filter matches before performing high-dimensional calculations:

```json
{
  "complaint_id": "uuid-string-of-pg-record",
  "incident_id": "uuid-string-of-parent-incident",
  "department": "Water Supply & Sewage",
  "priority": "High",
  "location": "MG Road",
  "created_at": "2026-08-01T18:00:00Z"
}
```

### Payload Usage in Pipeline

1. **Similarity Retrieval:** The vector representation of a new complaint is matched against the database.
2. **Filtering by Metadata:** Results can be filtered by Ward or Location payloads.
3. **Optimized Lookup:** Since payloads store PostgreSQL keys, we can fetch matching records from PostgreSQL without performing full-table scans.

---

**Proceed** to the next document: [08_API_REFERENCE.md](file:///d:/Project/NagarDrishti/docs/codebase/08_API_REFERENCE.md)
