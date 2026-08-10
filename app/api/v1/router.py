from fastapi import APIRouter
from app.api.v1.endpoints import complaints, incidents, monitoring

api_router = APIRouter()
api_router.include_router(monitoring.router, tags=["Monitoring"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaints"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])