from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.schemas.complaint import ComplaintCreate, ComplaintResponse
from app.services.incident_service import IncidentService

router = APIRouter()

@router.post("/", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def submit_complaint(
    complaint_in: ComplaintCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Ingest a new citizen complaint.
    Extracts semantic metadata and clusters under an Incident using Qdrant similarity.
    """
    try:
        complaint = await IncidentService.process_new_complaint(db, complaint_in)
        return complaint
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing the complaint: {str(e)}"
        )

@router.get("/", response_model=List[ComplaintResponse])
async def list_complaints(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve raw citizen complaints."""
    return await IncidentService.get_all_complaints(db, skip, limit)

@router.get("/{id}", response_model=ComplaintResponse)
async def get_complaint(
    id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve details of a single complaint."""
    complaint = await IncidentService.get_complaint(db, id)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID {id} not found."
        )
    return complaint
