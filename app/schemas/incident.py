from pydantic import BaseModel, ConfigDict, computed_field
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
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class IncidentDetailResponse(IncidentResponse):
    complaints: List[ComplaintResponse] = []

    @computed_field  # type: ignore[misc]
    @property
    def duplicate_count(self) -> int:
        """Number of complaints grouped under this incident."""
        return len(self.complaints)