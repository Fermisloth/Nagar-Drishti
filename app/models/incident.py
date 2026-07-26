from sqlalchemy import Column, String, DateTime, Text, func
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    department = Column(String, nullable=False, index=True)
    issue_type = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="Medium")
    location = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationship linking back to individual raw complaints
    complaints = relationship("Complaint", back_populates="incident", cascade="all, delete-orphan")