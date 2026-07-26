from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class ComplaintCreate(BaseModel):
    raw_text: str = Field(..., min_length=5, description="Raw civic complaint submitted by citizen.")
    location: Optional[str] = Field(None, description="Optional user location string.")
    image_url: Optional[str] = Field(None, description="Optional image URL.")

class ExtractedComplaintMetadata(BaseModel):
    issue_type: str = Field(..., description="E.g., Water Leakage, Pothole, Power Cut")
    department: str = Field(..., description="Assigned Municipal Department")
    priority: str = Field(..., description="High, Medium, or Low")
    location: Optional[str] = Field(None, description="Extracted location details")
    summary: str = Field(..., description="1-sentence clean summary of the complaint")

class ComplaintResponse(BaseModel):
    id: str
    raw_text: str
    location: Optional[str] = None
    image_url: Optional[str] = None
    incident_id: Optional[str] = None
    extracted_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True