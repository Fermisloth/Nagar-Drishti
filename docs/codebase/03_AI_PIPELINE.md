# 03_AI_PIPELINE.md

## 🧠 The 10-Stage Unified AI Pipeline

The pipeline starts the moment a citizen inputs a complaint. It parses the request, compares it with existing issues, and clusters them to prevent duplicated tickets.

```
Citizen Ingestion
   │
   ├── 1. Ingestion & Sanitization (app/utils/sanitizer.py)
   ▼
AI Meta-Extraction
   │
   ├── 2. Gemini Model Prompting (app/services/gemini_service.py)
   ├── 3. Pydantic Extraction Validation (app/schemas/complaint.py)
   ▼
Vector Embedding
   │
   ├── 4. text-embedding-004 Vector Generation
   ├── 5. Similarity Search Query (app/services/vector_service.py)
   ▼
Clustering Engine
   │
   ├── 6. Candidate Retrieve & Evaluate (app/services/incident_engine.py)
   ├── 7. Department Check & Recency Filter
   ├── 8. Composite Scoring calculation
   ▼
Database Persistence
   │
   ├── 9. Incident Linking or New Creation
   └── 10. PostgreSQL Flush & Qdrant Payload Upsert
```

### Stages Breakdown

#### Stage 1: Ingestion & Sanitization
The endpoint cleanses text strings by stripping HTML elements via `sanitize_input_text()` to prevent stored Cross-Site Scripting (XSS).

#### Stage 2: AI Extraction
The raw text is structured using Google Gemini 1.5 Flash. We specify JSON mode output and pass Pydantic specifications.

#### Stage 3: Schema Validation
The response is parsed and validated into the `ExtractedComplaintMetadata` Pydantic model. If it fails, fallback mocks route it to the manual verification queue.

#### Stage 4: Embedding Generation
The text is mapped to a 768-dimensional floating-point array using `text-embedding-004`.

#### Stage 5: Similarity Search
The embedding vector is sent to the Qdrant DB. We query using Cosine Similarity, requesting points above a predefined threshold (`0.82`).

#### Stage 6: Candidate Evaluation
For each matched candidate, we retrieve the linked SQLAlchemy Incident record.

#### Stage 7: Guardrail Validation
We verify:
- **Department Identity:** Department must match exactly.
- **Recency Bounds:** Incident must not exceed `30` days in age.

#### Stage 8: Composite Scoring
We compute:
$$\text{Score} = (\text{Sim} \times 0.6) + (\text{Loc} \times 0.2) + (\text{Prio} \times 0.1) + (\text{Density} \times 0.1)$$

#### Stage 9: Incident Resolving
If a candidate exceeds `0.80`, we merge the complaint into it. If not, a new `Incident` record is generated.

#### Stage 10: Sync Commit
We write the `Complaint` record to PostgreSQL with the `incident_id` foreign key. We also upsert the complaint vector and metadata payload to Qdrant.

---

**Proceed** to the next document: [04_DECISION_ENGINE.md](file:///d:/Project/NagarDrishti/docs/codebase/04_DECISION_ENGINE.md)
