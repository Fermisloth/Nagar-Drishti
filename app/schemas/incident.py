from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.complaint import ComplaintResponse

class IncidentResponse(BaseModel):
    id: str
    title: str
    department: str
    issue_type: str
    priority: str
    location: Optional[str] = None
    summary: Optional[str] = None
    duplicate_count: int = 1
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentDetailResponse(IncidentResponse):
    complaints: List[ComplaintResponse] = []