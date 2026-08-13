# NagarDrishti - Future API Requirements Specification

This document details proposed backend API endpoints and schema extensions to enhance real-time observability, live decision tracing, and frontend-backend synchronization across NagarDrishti (UrbanMind AI).

---

## 1. Metrics Endpoint Extension (`GET /api/v1/metrics`)

### Current State vs Required Extension
- **Current Response**:
```json
{
  "app_uptime_seconds": 88200.45,
  "prompt_version": "v1",
  "embedding_model": "text-embedding-004",
  "decision_threshold": 0.82
}
```
- **Required Extension**: Extend `/api/v1/metrics` in `app/api/v1/endpoints/monitoring.py` to directly expose `embedding_dimensions` (from 768-D vector spec) and `llm_model` (from `settings.GEMINI_GENERATION_MODEL`):
```json
{
  "app_uptime_seconds": 88200.45,
  "prompt_version": "v1",
  "embedding_model": "text-embedding-004",
  "embedding_dimensions": 768,
  "decision_threshold": 0.82,
  "llm_model": "gemini-1.5-flash"
}
```

### Frontend Fallback Behavior
Until the backend endpoint is updated:
- The frontend client in `frontend/src/api/api.ts` extracts `embedding_model` and `decision_threshold` directly from the API response.
- Missing fields fall back to `embedding_dimensions = 768` and `llm_model = "gemini-1.5-flash"`.

---

## 2. Incident Decision Trace & Similarity Endpoints

### `GET /api/v1/incidents/{id}/similarity`
* **Description**: Returns exact Cosine similarity vectors and distance matrix for all complaints aggregated under a given master incident cluster.
* **Response Schema**:
```json
{
  "incident_id": "inc-901",
  "threshold": 0.82,
  "matches": [
    {
      "complaint_id": "comp-101",
      "raw_text": "Water main burst near Sector 15 market...",
      "similarity_score": 0.94,
      "distance_metric": "cosine",
      "exceeds_threshold": true
    },
    {
      "complaint_id": "comp-102",
      "raw_text": "Heavy water leak outside shop 42 in Sector 15...",
      "similarity_score": 0.91,
      "distance_metric": "cosine",
      "exceeds_threshold": true
    }
  ]
}
```

---

### `GET /api/v1/incidents/{id}/decision-trace`
* **Description**: Exposes step-by-step execution metrics and stage timing for the 10-stage AI pipeline for a given incident or complaint.
* **Response Schema**:
```json
{
  "incident_id": "inc-901",
  "total_latency_ms": 340,
  "stages": [
    {
      "stage_number": 1,
      "name": "Citizen Ingestion",
      "status": "COMPLETED",
      "duration_ms": 12,
      "output_summary": "Raw payload validated"
    },
    {
      "stage_number": 2,
      "name": "Gemini Extraction",
      "status": "COMPLETED",
      "duration_ms": 180,
      "output_summary": "Department: Water Supply, Priority: EMERGENCY"
    },
    {
      "stage_number": 3,
      "name": "Qdrant Vector Embedding",
      "status": "COMPLETED",
      "duration_ms": 45,
      "output_summary": "768-D dense vector generated via text-embedding-004"
    },
    {
      "stage_number": 4,
      "name": "Decision Engine Audit",
      "status": "COMPLETED",
      "duration_ms": 15,
      "output_summary": "Spatial & Recency filters verified"
    }
  ]
}
```

---

### `GET /api/v1/incidents/{id}/candidate-matches`
* **Description**: Retrieves top-$K$ nearest neighbor candidate incidents returned by Qdrant during deduplication lookup.
* **Response Schema**:
```json
{
  "complaint_id": "comp-341",
  "candidates": [
    {
      "incident_id": "inc-901",
      "similarity_score": 0.94,
      "department_match": true,
      "location_distance_meters": 120,
      "decision": "MERGED"
    },
    {
      "incident_id": "inc-704",
      "similarity_score": 0.48,
      "department_match": false,
      "location_distance_meters": 4200,
      "decision": "REJECTED"
    }
  ]
}
```

---

## 3. System Configuration & Telemetry Endpoints

### `GET /api/v1/system/config`
* **Description**: Exposes active pipeline hyperparameters dynamically to eliminate hardcoded frontend constants.
* **Response Schema**:
```json
{
  "embedding_model": "text-embedding-004",
  "embedding_dimensions": 768,
  "similarity_threshold": 0.82,
  "llm_model": "gemini-1.5-flash",
  "spatial_radius_meters": 500,
  "recency_window_hours": 48
}
```

---

### `GET /api/v1/system/pipeline-health`
* **Description**: Detailed telemetry health breakdown including vector collection index size, database connection pool statistics, and LLM quota metrics.
* **Response Schema**:
```json
{
  "status": "HEALTHY",
  "qdrant": {
    "collection": "complaints_vector_index",
    "points_count": 2847,
    "indexing_status": "COMPLETED",
    "latency_p95_ms": 18
  },
  "database": {
    "pool_active": 4,
    "pool_size": 20,
    "acid_status": "OK"
  },
  "gemini": {
    "status": "OPERATIONAL",
    "quota_remaining_pct": 94.2
  }
}
```
