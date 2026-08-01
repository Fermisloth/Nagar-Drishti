from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.complaint import Complaint

class ComplaintRepository(BaseRepository[Complaint]):
    def __init__(self, db: AsyncSession):
        super().__init__(Complaint, db)
