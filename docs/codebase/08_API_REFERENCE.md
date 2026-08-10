# 08_API_REFERENCE.md

## 🔌 API Reference & Endpoints

All endpoints are versioned under `/api/v1` and return structured JSON responses.

### 🏢 Public Endpoints

#### 1. Ingest Complaint
- **Method & Route:** `POST /api/v1/complaints/`
- **Controller:** [complaints.py](file:///d:/Project/NagarDrishti/app/api/v1/endpoints/complaints.py)
- **Request Body:**
  ```json
  {
    "raw_text": "There is a massive water leak near MG Road metro station.",
    "location": "MG Road",
    "image_url": "https://storage.city/img.jpg"
  }
  ```
- **Response:** `201 Created`
  Returns the saved `ComplaintResponse` schema containing the assigned `incident_id`.

#### 2. Get Complaint
- **Method & Route:** `GET /api/v1/complaints/{id}`
- **Response:** `200 OK`
  Returns detailed metadata for the specified complaint.

---

### 🛡️ Secure Officer Endpoints
*These endpoints require a valid API key passed in the `X-API-Key` header.*

#### 1. List Grouped Incidents
- **Method & Route:** `GET /api/v1/incidents/`
- **Controller:** [incidents.py](file:///d:/Project/NagarDrishti/app/api/v1/endpoints/incidents.py)
- **Query Parameters:**
  - `department` (Optional string)
  - `priority` (Optional string)
  - `skip` (Default: 0)
  - `limit` (Default: 100)
- **Response:** `200 OK`
  Returns a list of `IncidentResponse` objects, including the dynamic `duplicate_count`.

#### 2. Get Incident Detail
- **Method & Route:** `GET /api/v1/incidents/{id}`
- **Response:** `200 OK`
  Returns the incident details along with a list of all linked raw complaints.

---

### 📊 System Monitoring

#### 1. Health Status
- **Route:** `GET /api/v1/health`
- **Response:**
  ```json
  {
    "status": "healthy",
    "project": "UrbanMind AI",
    "environment": "development"
  }
  ```

#### 2. Dependency Readiness Probe
- **Route:** `GET /api/v1/ready`
- **Response:** Checks active connections to PostgreSQL, Qdrant, and Gemini.
  ```json
  {
    "status": "ready",
    "dependencies": {
      "database": true,
      "qdrant": true,
      "gemini": true
    }
  }
  ```

---

**Proceed** to the next document: [09_SECURITY_MODEL.md](file:///d:/Project/NagarDrishti/docs/codebase/09_SECURITY_MODEL.md)
