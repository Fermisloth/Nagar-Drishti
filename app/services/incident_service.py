from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.complaint_repository import ComplaintRepository
from app.repositories.incident_repository import IncidentRepository
from app.services.gemini_service import gemini_service
from app.services.vector_service import vector_service
from app.services.incident_engine import decision_engine
from app.models.complaint import Complaint
from app.models.incident import Incident
from app.schemas.complaint import ComplaintCreate
import uuid
import logging

logger = logging.getLogger("urbanmind")

class IncidentService:
    @staticmethod
    async def process_new_complaint(db: AsyncSession, complaint_in: ComplaintCreate) -> Complaint:
        """
        Runs the 10-stage pipeline with the advanced Incident Decision Engine.
        """
        complaint_repo = ComplaintRepository(db)
        incident_repo = IncidentRepository(db)
        
        raw_text = complaint_in.raw_text
        user_loc = complaint_in.location
        img_url = complaint_in.image_url
        
        # 1. AI Extraction
        metadata = await gemini_service.extract_metadata(raw_text)
        logger.info(f"Extracted metadata: {metadata}")
        
        # 2. Embedding Generation
        embedding_data = await gemini_service.generate_embedding(raw_text)
        embedding_vector = embedding_data["vector"]
        
        # 3. Vector Similarity Search
        matches = vector_service.search_similar_complaints(embedding_vector)
        
        best_matched_incident: Optional[Incident] = None
        best_score = 0.0
        
        # Evaluate candidate incidents using decision engine
        for match in matches:
            matched_id = match["complaint_id"]
            matched_complaint_obj = await complaint_repo.get_by_id(matched_id)
            
            if matched_complaint_obj and matched_complaint_obj.incident_id:
                incident_obj = await incident_repo.get_with_details(matched_complaint_obj.incident_id)
                if incident_obj:
                    should_merge, score, reason = decision_engine.evaluate_merge_candidate(
                        new_metadata=metadata,
                        vector_similarity_score=match["score"],
                        existing_incident=incident_obj
                    )
                    logger.info(f"Evaluated Incident {incident_obj.id}: should_merge={should_merge}, reason={reason}")
                    
                    if should_merge and score > best_score:
                        best_matched_incident = incident_obj
                        best_score = score

        if not best_matched_incident:
            # Create a brand new Incident
            logger.info("No matching candidate satisfied decision engine. Creating new Incident record.")
            incident_id = str(uuid.uuid4())
            new_incident = Incident(
                id=incident_id,
                title=metadata.summary,
                department=metadata.department,
                issue_type=metadata.issue_type,
                priority=metadata.priority,
                location=metadata.location or user_loc or "Unknown",
                summary=metadata.summary
            )
            best_matched_incident = await incident_repo.create(new_incident)
            
        # Attach embedding version metadata to complaint JSON
        extracted_json = metadata.model_dump()
        extracted_json.update({
            "embedding_model": embedding_data["embedding_model"],
            "embedding_version": embedding_data["embedding_version"],
            "embedding_created_at": embedding_data["embedding_created_at"]
        })

        # Create and link the raw Complaint record
        complaint_id = str(uuid.uuid4())
        new_complaint = Complaint(
            id=complaint_id,
            raw_text=raw_text,
            location=user_loc or metadata.location,
            image_url=img_url,
            incident_id=best_matched_incident.id,
            extracted_metadata=extracted_json
        )
        
        saved_complaint = await complaint_repo.create(new_complaint)
        
        # Upsert Complaint vector to Qdrant for future matching
        payload = {
            "incident_id": best_matched_incident.id,
            "department": metadata.department,
            "priority": metadata.priority,
            "location": user_loc or metadata.location or "Unknown"
        }
        vector_service.upsert_complaint(complaint_id, embedding_vector, payload)
        
        return saved_complaint

    @staticmethod
    async def get_complaint(db: AsyncSession, complaint_id: str) -> Optional[Complaint]:
        return await ComplaintRepository(db).get_by_id(complaint_id)

    @staticmethod
    async def get_all_complaints(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Complaint]:
        return await ComplaintRepository(db).get_all(skip, limit)

    @staticmethod
    async def get_incidents_list(
        db: AsyncSession,
        department: Optional[str] = None,
        priority: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Incident]:
        return await IncidentRepository(db).get_filtered(
            department=department, priority=priority, skip=skip, limit=limit
        )

    @staticmethod
    async def get_incident_detail(db: AsyncSession, incident_id: str) -> Optional[Incident]:
        return await IncidentRepository(db).get_with_details(incident_id)
