from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.incident import Incident
from app.models.complaint import Complaint

class IncidentRepository(BaseRepository[Incident]):
    def __init__(self, db: AsyncSession):
        super().__init__(Incident, db)

    async def get_with_details(self, id: str) -> Optional[Incident]:
        """Fetch Incident with associated Complaints preloaded."""
        result = await self.db.execute(
            select(Incident)
            .options(selectinload(Incident.complaints))
            .filter(Incident.id == id)
        )
        return result.scalars().first()

    async def get_filtered(
        self,
        department: Optional[str] = None,
        priority: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Incident]:
        """Fetch Incidents with optional filtering."""
        query = select(Incident).options(selectinload(Incident.complaints))
        if department:
            query = query.filter(Incident.department.ilike(department))
        if priority:
            query = query.filter(Incident.priority.ilike(priority))
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()
