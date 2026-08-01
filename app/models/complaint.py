from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    raw_text = Column(Text, nullable=False)
    location = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    
    # Foreign key link to grouped Incident
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=True, index=True)
    
    # Raw JSON extraction output from Gemini stored for auditability
    extracted_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to parent Incident
    incident = relationship("Incident", back_populates="complaints")