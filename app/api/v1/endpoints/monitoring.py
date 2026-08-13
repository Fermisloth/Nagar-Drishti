from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text
from app.core.database import get_db
from app.core.qdrant import qdrant_storage
from app.core.config import settings
from app.services.gemini_service import gemini_service
import time

router = APIRouter()
START_TIME = time.time()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "environment": settings.ENV,
        "uptime_seconds": round(time.time() - START_TIME, 2)
    }

@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness():
    """Liveness probe for Kubernetes / Container Orchestrators."""
    return {"status": "alive"}

@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness(db: AsyncSession = Depends(get_db)):
    """Readiness probe verifying DB, Vector DB, and AI Service dependencies."""
    checks = {
        "database": False,
        "qdrant": False,
        "gemini": False
    }
    
    # 1. Database Check
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = True
    except Exception:
        checks["database"] = False

    # 2. Qdrant Check
    try:
        _ = qdrant_storage.client.get_collections()
        checks["qdrant"] = True
    except Exception:
        checks["qdrant"] = False

    # 3. Gemini Check
    checks["gemini"] = gemini_service.is_active

    all_ready = all(checks.values())
    return {
        "status": "ready" if all_ready else "degraded",
        "dependencies": checks
    }

@router.get("/metrics", status_code=status.HTTP_200_OK)
async def metrics():
    """Prometheus-compatible operational metrics endpoint."""
    return {
        "app_uptime_seconds": round(time.time() - START_TIME, 2),
        "prompt_version": settings.PROMPT_VERSION,
        "embedding_model": settings.EMBEDDING_MODEL,
        "embedding_dimensions": 768,
        "decision_threshold": settings.DECISION_SIMILARITY_THRESHOLD,
        "llm_model": settings.GEMINI_GENERATION_MODEL
    }
