from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_db
from app.schemas.incident import IncidentResponse, IncidentDetailResponse
from app.services.incident_service import IncidentService
from app.dependencies.auth import verify_api_key

router = APIRouter()

@router.get("/", response_model=List[IncidentResponse])
async def list_incidents(
    department: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """
    Retrieve grouped Incidents.
    Access restricted to city officers presenting a valid API Key.
    """
    incidents = await IncidentService.get_incidents_list(
        db, department=department, priority=priority, skip=skip, limit=limit
    )
    
    # Map model instances to include dynamic duplicate count
    results = []
    for inc in incidents:
        count = len(inc.complaints) if inc.complaints else 0
        # Create a dict that matches IncidentResponse schema fields
        results.append(
            IncidentResponse(
                id=inc.id,
                title=inc.title,
                department=inc.department,
                issue_type=inc.issue_type,
                priority=inc.priority,
                location=inc.location,
                summary=inc.summary,
                duplicate_count=count if count > 0 else 1,
                created_at=inc.created_at
            )
        )
    return results

@router.get("/{id}", response_model=IncidentDetailResponse)
async def get_incident(
    id: str,
    db: AsyncSession = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """
    Retrieve full details of a specific incident including all linked raw complaints.
    Access restricted to city officers.
    """
    incident = await IncidentService.get_incident_detail(db, id)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident with ID {id} not found."
        )
        
    count = len(incident.complaints) if incident.complaints else 0
    return IncidentDetailResponse(
        id=incident.id,
        title=incident.title,
        department=incident.department,
        issue_type=incident.issue_type,
        priority=incident.priority,
        location=incident.location,
        summary=incident.summary,
        duplicate_count=count if count > 0 else 1,
        created_at=incident.created_at,
        complaints=incident.complaints or []
    )
