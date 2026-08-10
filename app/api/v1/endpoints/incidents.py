from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_db
from app.schemas.incident import IncidentResponse, IncidentDetailResponse
from app.services.incident_service import IncidentService
from app.dependencies.auth import require_roles, UserRole
router = APIRouter()

@router.get("/", response_model=List[IncidentResponse])
async def list_incidents(
    department: Optional[str] = None,
    priority: Optional[str] = None,
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
    """List incidents with optional filters and pagination."""
    incidents = await IncidentService.get_incidents_list(
        db,
        department=department,
        priority=priority,
        skip=skip,
        limit=limit,
    )
    return incidents

@router.get("/{id}", response_model=IncidentDetailResponse)
async def get_incident(
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
    """Retrieve detailed incident by ID."""
    incident = await IncidentService.get_incident_detail(db, id)
    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
    return incident