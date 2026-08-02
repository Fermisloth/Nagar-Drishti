import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from app.schemas.complaint import ComplaintCreate
from app.services.incident_service import IncidentService
from app.models.complaint import Complaint
from app.models.incident import Incident

@pytest.mark.asyncio
async def test_process_new_complaint_creates_new_incident():
    """
    Test that when there are no matches (scores below threshold), a new incident is created.
    """
    db_mock = AsyncMock()
    complaint_in = ComplaintCreate(
        raw_text="Major pothole on MG Road near the metro station.",
        location="MG Road",
        image_url="http://example.com/pothole.jpg"
    )
    
    # Mock repositories and services
    with patch("app.services.incident_service.ComplaintRepository") as MockComplaintRepo, \
         patch("app.services.incident_service.IncidentRepository") as MockIncidentRepo, \
         patch("app.services.incident_service.gemini_service") as MockGeminiService, \
         patch("app.services.incident_service.vector_service") as MockVectorService:
         
        # Mock Gemini service responses
        mock_metadata = MagicMock()
        mock_metadata.summary = "Pothole on MG Road"
        mock_metadata.department = "Roads & Maintenance"
        mock_metadata.issue_type = "Pothole"
        mock_metadata.priority = "Low"
        mock_metadata.location = "MG Road"
        mock_metadata.model_dump.return_value = {"mock": "data"}
        
        MockGeminiService.extract_metadata = AsyncMock(return_value=mock_metadata)
        MockGeminiService.generate_embedding = AsyncMock(return_value=[0.1] * 768)
        
        # Qdrant returns no matches
        MockVectorService.search_similar_complaints = MagicMock(return_value=[])
        
        # DB calls mock setup
        complaint_repo_instance = MockComplaintRepo.return_value
        complaint_repo_instance.create = AsyncMock(side_effect=lambda x: x)
        
        incident_repo_instance = MockIncidentRepo.return_value
        incident_repo_instance.create = AsyncMock(side_effect=lambda x: x)
        
        # Run pipeline
        result = await IncidentService.process_new_complaint(db_mock, complaint_in)
        
        # Verify repository calls
        assert result is not None
        assert result.raw_text == complaint_in.raw_text
        incident_repo_instance.create.assert_called_once()
        complaint_repo_instance.create.assert_called_once()
        MockVectorService.upsert_complaint.assert_called_once()


@pytest.mark.asyncio
async def test_process_new_complaint_clusters_to_existing_incident():
    """
    Test that when a vector match is found above the 0.82 threshold, the new complaint clusters into the existing incident.
    """
    db_mock = AsyncMock()
    complaint_in = ComplaintCreate(
        raw_text="Another pothole spotted on MG Road, very deep.",
        location="MG Road"
    )
    
    with patch("app.services.incident_service.ComplaintRepository") as MockComplaintRepo, \
         patch("app.services.incident_service.IncidentRepository") as MockIncidentRepo, \
         patch("app.services.incident_service.gemini_service") as MockGeminiService, \
         patch("app.services.incident_service.vector_service") as MockVectorService:
         
        mock_metadata = MagicMock()
        mock_metadata.summary = "Pothole on MG Road"
        mock_metadata.department = "Roads & Maintenance"
        mock_metadata.issue_type = "Pothole"
        mock_metadata.priority = "Low"
        mock_metadata.location = "MG Road"
        mock_metadata.model_dump.return_value = {"mock": "data"}
        
        MockGeminiService.extract_metadata = AsyncMock(return_value=mock_metadata)
        MockGeminiService.generate_embedding = AsyncMock(return_value=[0.1] * 768)
        
        # Vector match found with high similarity score of 0.89
        MockVectorService.search_similar_complaints = MagicMock(return_value=[
            {"complaint_id": "matched-comp-123", "score": 0.89}
        ])
        
        # DB calls mock setup
        complaint_repo_instance = MockComplaintRepo.return_value
        
        # Mock finding the matched complaint and returning its incident
        matched_complaint_db = Complaint(id="matched-comp-123", incident_id="inc-999")
        complaint_repo_instance.get = AsyncMock(return_value=matched_complaint_db)
        
        existing_incident_db = Incident(id="inc-999", title="Road Pothole MG Road")
        incident_repo_instance_mock = MockIncidentRepo.return_value
        incident_repo_instance_mock.get = AsyncMock(return_value=existing_incident_db)
        
        complaint_repo_instance.create = AsyncMock(side_effect=lambda x: x)
        
        # Run pipeline
        result = await IncidentService.process_new_complaint(db_mock, complaint_in)
        
        # Verify no new incident was created
        incident_repo_instance_mock.create.assert_not_called()
        # Verify complaint was linked to existing incident ID
        assert result.incident_id == "inc-999"
        complaint_repo_instance.create.assert_called_once()
        MockVectorService.upsert_complaint.assert_called_once()
