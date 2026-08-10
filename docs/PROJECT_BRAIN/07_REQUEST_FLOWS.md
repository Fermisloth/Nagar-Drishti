# Request Flows

This document outlines the primary API request flows in **NagarDrishti**.

## 1. Ingestion Flow
- **Endpoint**: `POST /api/v1/incidents`
- **Purpose**: Accept raw traffic incident data.
- **Process**:
  1. Validate payload against `IncidentIngestionSchema`.
  2. Store raw JSON in PostgreSQL `incidents_raw` table.
  3. Trigger async processing pipeline (Kafka → Celery worker).

## 2. Processing Flow
- **Async Worker** reads from the queue, performs:
  - Data cleaning & enrichment.
  - Vector embedding generation via OpenAI model.
  - Storage of embeddings in Qdrant.
  - Creation of normalized records in `incidents_processed`.

## 3. Query Flow
- **Endpoint**: `GET /api/v1/incidents/search`
- **Parameters**:
  - `q` – free‑text search term.
  - `limit` – number of results (default 10).
- **Process**:
  1. Convert query to embedding.
  2. Perform similarity search in Qdrant.
  3. Retrieve matching incident IDs.
  4. Return enriched incident data from PostgreSQL.

## 4. Feedback Flow
- **Endpoint**: `POST /api/v1/feedback`
- **Purpose**: Capture analyst feedback on clustering results.
- **Process**:
  1. Store feedback record.
  2. Update clustering model retraining dataset.

*Generated on ${new Date().toISOString()}*
