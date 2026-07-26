from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.qdrant import qdrant_storage
from app.core.database import engine, Base
from app.api.v1.router import api_router
# Import models to ensure they register with Base.metadata before creation
import app.models  
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("urbanmind")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Sequence
    logger.info("Initializing system infrastructure...")
    qdrant_storage.init_collection()
    
    # Automatically create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("PostgreSQL tables synchronized.")
    
    yield
    
    # Shutdown Sequence
    logger.info("Shutting down infrastructure connections...")
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")