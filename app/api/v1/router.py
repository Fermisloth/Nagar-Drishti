from fastapi import APIRouter
from app.api.v1.endpoints import health, complaints, incidents

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaints"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])