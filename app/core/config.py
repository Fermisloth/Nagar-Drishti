from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, computed_field
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "NagarDrishti AI"
    ENV: str = "development"
    PORT: int = 8000

    # JWT Authentication Security
    JWT_SECRET_KEY: str = "super_secret_jwt_key_should_be_changed_in_prod"
    JWT_REFRESH_SECRET_KEY: str = "super_secret_refresh_jwt_key_should_be_changed_in_prod"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # PostgreSQL
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str

    @computed_field
    @property
    def ASYNC_DATABASE_URI(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Qdrant Vector Store
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION_NAME: str = "complaint_embeddings"
    QDRANT_URL: Optional[str] = None # Fallback direct URL format

    # AI Configuration
    GEMINI_API_KEY: str
    EMBEDDING_MODEL: str = "text-embedding-004"
    EMBEDDING_VERSION: str = "v1"
    GEMINI_GENERATION_MODEL: str = "gemini-1.5-flash"
    PROMPT_VERSION: str = "v1"
    
    # Decision Engine Parameters
    DECISION_SIMILARITY_THRESHOLD: float = 0.82
    DECISION_DISTANCE_METERS_THRESHOLD: float = 500.0  # Max meters for same incident
    DECISION_RECENCY_DAYS_THRESHOLD: int = 30          # Limit incident age grouping

    # Security Configuration
    CORS_ORIGINS: List[str] = ["*"]
    OFFICER_API_KEY: str = "urbanmind_secret_token"
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024       # 5MB max image upload limit

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    @field_validator("GEMINI_API_KEY")
    @classmethod
    def validate_gemini_key(cls, v: str) -> str:
        if not v or v == "your_api_key_here":
            # Don't throw fatal error in local dev but warn clearly
            print("WARNING: GEMINI_API_KEY is not configured or dummy. Services will run in mock mode.")
        return v

    @field_validator("POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_SERVER", "POSTGRES_DB")
    @classmethod
    def validate_db_settings(cls, v: str, info) -> str:
        if not v:
            raise ValueError(f"{info.field_name} must not be empty.")
        return v

settings = Settings()