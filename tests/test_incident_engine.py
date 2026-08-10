import pytest
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock
from app.services.incident_engine import IncidentDecisionEngine
from app.schemas.complaint import ExtractedComplaintMetadata
from app.models.incident import Incident

def test_incident_engine_department_mismatch_never_merges():
    engine = IncidentDecisionEngine()
    
    new_meta = ExtractedComplaintMetadata(
        issue_type="Water Leakage",
        department="Water Supply & Sewage",
        priority="Medium",
        location="MG Road",
        summary="Water pipe leak"
    )
    
    existing_incident = Incident(
        id="inc-001",
        title="Broken Streetlight",
        department="Electricity & Streetlights",
        issue_type="Streetlight Broken",
        priority="Low",
        location="MG Road",
        created_at=datetime.now(timezone.utc)
    )

    
    # High similarity (0.95) should still FAIL because departments differ!
    should_merge, score, reason = engine.evaluate_merge_candidate(
        new_metadata=new_meta,
        vector_similarity_score=0.95,
        existing_incident=existing_incident
    )
    
    assert should_merge is False
    assert score == 0.0
    assert "Department mismatch" in reason

def test_incident_engine_same_department_high_similarity_merges():
    engine = IncidentDecisionEngine()
    
    new_meta = ExtractedComplaintMetadata(
        issue_type="Water Leakage",
        department="Water Supply & Sewage",
        priority="Medium",
        location="MG Road",
        summary="Water pipe burst"
    )
    
    existing_incident = Incident(
        id="inc-002",
        title="Water Leakage MG Road",
        department="Water Supply & Sewage",
        issue_type="Water Leakage",
        priority="Medium",
        location="MG Road",
        created_at=datetime.now(timezone.utc)
    )

    
    should_merge, score, reason = engine.evaluate_merge_candidate(
        new_metadata=new_meta,
        vector_similarity_score=0.90,
        existing_incident=existing_incident
    )
    
    assert should_merge is True
    assert score >= 0.80
