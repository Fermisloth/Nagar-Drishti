from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.schemas.complaint import ComplaintCreate, ComplaintResponse
from app.services.incident_service import IncidentService
from app.utils.sanitizer import sanitize_input_text
from app.dependencies.auth import require_roles, UserRole

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
        # Sanitize text strings to mitigate stored XSS injections
        complaint_in.raw_text = sanitize_input_text(complaint_in.raw_text)
        if complaint_in.location:
            complaint_in.location = sanitize_input_text(complaint_in.location)
            
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
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(
        require_roles(
            [
                UserRole.OFFICER,
                UserRole.DEPARTMENT_ADMIN,
                UserRole.SYSTEM_ADMIN,
            ]
        )
    ),
):
    """Retrieve raw citizen complaints."""
    return await IncidentService.get_all_complaints(db, skip, limit)

@router.get("/{id}", response_model=ComplaintResponse)
async def get_complaint(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(
        require_roles(
            [
                UserRole.OFFICER,
                UserRole.DEPARTMENT_ADMIN,
                UserRole.SYSTEM_ADMIN,
            ]
        )
    ),
):
    """Retrieve details of a single complaint."""
    complaint = await IncidentService.get_complaint(db, id)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID {id} not found."
        )
    return complaint

