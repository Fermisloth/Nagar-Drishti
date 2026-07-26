from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", status_code=200)
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENV,
        "project": settings.PROJECT_NAME
    }