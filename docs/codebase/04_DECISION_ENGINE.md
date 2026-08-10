# 04_DECISION_ENGINE.md

## 🤖 The Incident Decision Engine

The [IncidentDecisionEngine](file:///d:/Project/NagarDrishti/app/services/incident_engine.py) regulates deduplication. It ensures that complaints are grouped under the correct Master Incident while enforcing strict municipal guardrails.

### Decision Scoring Configuration

The engine combines semantic, spatial, temporal, priority, and ticket density factors:

```python
class IncidentDecisionEngine:
    def __init__(
        self,
        similarity_weight: float = 0.60,
        location_weight: float = 0.20,
        priority_weight: float = 0.10,
        density_weight: float = 0.10,
        min_composite_threshold: float = 0.80
    ):
        ...
```

### Hard Guardrails

Before calculating composite scores, the engine evaluates two hard constraints. If either fails, the candidate is discarded (minimum score of `0.0` is returned):

1. **Department Match (Hard Guardrail):**
   - Department values must be identical (case-insensitive, whitespace-trimmed).
   - *Example:* "Water Supply & Sewage" cannot merge with "Roads & Maintenance".
2. **Recency Boundary (Hard Guardrail):**
   - Candidate incident age must not exceed `DECISION_RECENCY_DAYS_THRESHOLD` (default: 30 days).
   - This prevents outdated tickets from absorbing fresh issues.

### Scoring Factors

1. **Vector Similarity (Weight: 60%):**
   - The raw cosine similarity score returned by Qdrant.
2. **Location Match (Weight: 20%):**
   - If both locations are identified and one is a substring of the other (e.g., "MG Road near Metro" and "MG Road"), we assign a location score of `1.0`.
   - If they differ completely, the score drops to `0.2`.
   - If location data is missing, we default to `0.5`.
3. **Priority Match (Weight: 10%):**
   - If the incoming complaint priority matches the candidate incident priority, score is `1.0`; otherwise `0.6`.
4. **Density Boost (Weight: 10%):**
   - Represents the count of complaints already linked to the candidate:
     $$\text{Density Score} = \min\left(\frac{\text{Complaint Count}}{10.0}, 1.0\right)$$
   - This boosts active, widely reported incidents.

### Decision Evaluation Code

```python
# Calculate Composite Score
composite_score = (
    (sim_score * self.similarity_weight) +
    (loc_score * self.location_weight) +
    (prio_score * self.priority_weight) +
    (density_score * self.density_weight)
)
should_merge = composite_score >= self.min_composite_threshold
```

---

**Proceed** to the next document: [05_FILE_INDEX.md](file:///d:/Project/NagarDrishti/docs/codebase/05_FILE_INDEX.md)
