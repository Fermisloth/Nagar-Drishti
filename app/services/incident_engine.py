from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Tuple
from app.models.incident import Incident
from app.schemas.complaint import ExtractedComplaintMetadata
from app.core.config import settings
import logging

logger = logging.getLogger("nagardrishti")

class IncidentDecisionEngine:
    def __init__(
        self,
        similarity_weight: float = 0.60,
        location_weight: float = 0.20,
        priority_weight: float = 0.10,
        density_weight: float = 0.10,
        min_composite_threshold: float = 0.80
    ):
        self.similarity_weight = similarity_weight
        self.location_weight = location_weight
        self.priority_weight = priority_weight
        self.density_weight = density_weight
        self.min_composite_threshold = min_composite_threshold

    def evaluate_merge_candidate(
        self,
        new_metadata: ExtractedComplaintMetadata,
        vector_similarity_score: float,
        existing_incident: Incident
    ) -> Tuple[bool, float, str]:
        """
        Evaluates whether a new complaint should merge into an existing incident based on:
        - Department (HARD GUARDRAIL: Must match exactly)
        - Recency (HARD GUARDRAIL: Must be within recency threshold)
        - Vector Similarity
        - Location matching
        - Priority alignment
        - Complaint density
        
        Returns tuple of (should_merge: bool, composite_score: float, reason: str).
        """
        # Guardrail 1: Department Check
        new_dept = (new_metadata.department or "").strip().lower()
        existing_dept = (existing_incident.department or "").strip().lower()
        
        if new_dept != existing_dept:
            return False, 0.0, f"Department mismatch ('{new_metadata.department}' vs '{existing_incident.department}'). Complaints about different departments must never merge."

        # Guardrail 2: Recency Check
        if existing_incident.created_at:
            # Ensure the comparison is timezone-aware
            created = existing_incident.created_at
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            age_days = (datetime.now(timezone.utc) - created).days
            if age_days > settings.DECISION_RECENCY_DAYS_THRESHOLD:
                return False, 0.0, f"Incident {existing_incident.id} exceeds max recency threshold ({age_days} days old)."

        # Factor 1: Vector Similarity Score
        sim_score = min(max(vector_similarity_score, 0.0), 1.0)

        # Factor 2: Location Match Score
        loc_score = 0.5
        new_loc = (new_metadata.location or "").strip().lower()
        existing_loc = (existing_incident.location or "").strip().lower()
        
        if new_loc and existing_loc:
            if new_loc in existing_loc or existing_loc in new_loc:
                loc_score = 1.0
            else:
                loc_score = 0.2

        # Factor 3: Priority Alignment Score
        prio_score = 1.0 if new_metadata.priority == existing_incident.priority else 0.6

        # Factor 4: Density Boost
        complaint_count = len(existing_incident.complaints) if existing_incident.complaints else 1
        density_score = min(complaint_count / 10.0, 1.0)

        # Calculate Composite Score
        composite_score = (
            (sim_score * self.similarity_weight) +
            (loc_score * self.location_weight) +
            (prio_score * self.priority_weight) +
            (density_score * self.density_weight)
        )

        should_merge = composite_score >= self.min_composite_threshold
        reason = f"Composite score: {composite_score:.2f} (Sim: {sim_score:.2f}, Loc: {loc_score:.2f}, Prio: {prio_score:.2f}, Density: {density_score:.2f})"
        
        return should_merge, composite_score, reason

decision_engine = IncidentDecisionEngine()
