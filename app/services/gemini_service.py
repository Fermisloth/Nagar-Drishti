import os
import json
import time
import asyncio
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.complaint import ExtractedComplaintMetadata
from app.exceptions.base import AIException

logger = logging.getLogger("nagardrishti")

DEPARTMENTS = {
    "water": ("Water Supply & Sewage", "Water Leakage", "Medium"),
    "pipe": ("Water Supply & Sewage", "Water Leakage", "Medium"),
    "sewage": ("Water Supply & Sewage", "Sewage Overflow", "High"),
    "pothole": ("Roads & Maintenance", "Pothole", "Low"),
    "road": ("Roads & Maintenance", "Road Damage", "Low"),
    "light": ("Electricity & Streetlights", "Streetlight Broken", "Low"),
    "garbage": ("Sanitation & Waste", "Garbage Dumping", "Low"),
}

VALID_PRIORITIES = {"High", "Medium", "Low"}

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_active = bool(self.api_key and self.api_key != "your_api_key_here")
        self.client = None
        if self.is_active:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
                self.is_active = False

    def load_prompt_template(self, prompt_version: str = settings.PROMPT_VERSION) -> str:
        """Load prompt template from file system under app/ai/prompts/."""
        prompt_path = os.path.join(
            os.path.dirname(__file__), "..", "ai", "prompts", f"extraction_{prompt_version}.txt"
        )
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logger.warning(f"Could not load prompt version '{prompt_version}' from file {prompt_path}: {e}. Using fallback inline template.")
            return "Extract issue_type, department, priority, location, summary from: \"{raw_text}\""

    async def extract_metadata(self, text: str, max_retries: int = 3) -> ExtractedComplaintMetadata:
        """
        Extract metadata using Gemini with retry logic and exponential backoff.
        """
        if not self.is_active:
            return self._mock_extraction(text)

        prompt_template = self.load_prompt_template()
        prompt = prompt_template.format(raw_text=text)

        attempt = 0
        backoff_seconds = 1.0

        while attempt < max_retries:
            try:
                attempt += 1
                logger.info(f"Invoking Gemini extraction attempt {attempt}/{max_retries}...")
                
                # Execute generation call
                response = self.client.models.generate_content(
                    model=settings.GEMINI_GENERATION_MODEL,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=ExtractedComplaintMetadata,
                    ),
                )
                
                data = json.loads(response.text)
                
                # Validate Priority Enum
                if data.get("priority") not in VALID_PRIORITIES:
                    data["priority"] = "Medium"
                    
                metadata = ExtractedComplaintMetadata(**data)
                return metadata
                
            except Exception as e:
                logger.warning(f"Gemini API call failed on attempt {attempt}: {e}")
                if attempt >= max_retries:
                    logger.error("Max retries exceeded for Gemini extraction. Invoking mock fallback.")
                    return self._mock_extraction(text)
                await asyncio.sleep(backoff_seconds)
                backoff_seconds *= 2.0

        return self._mock_extraction(text)

    async def generate_embedding(self, text: str, max_retries: int = 3) -> Dict[str, Any]:
        """
        Generate embedding vector along with model metadata.
        Returns a dict: {"vector": [...], "model": ..., "version": ..., "created_at": ...}
        """
        if not self.is_active:
            val = sum(ord(c) for c in text) % 100 / 100.0
            return {
                "vector": [val] * 768,
                "embedding_model": settings.EMBEDDING_MODEL,
                "embedding_version": settings.EMBEDDING_VERSION,
                "embedding_created_at": datetime.utcnow().isoformat()
            }

        attempt = 0
        backoff_seconds = 1.0

        while attempt < max_retries:
            try:
                attempt += 1
                response = self.client.models.embed_content(
                    model=settings.EMBEDDING_MODEL,
                    contents=text,
                )
                vector = response.embeddings[0].values
                return {
                    "vector": vector,
                    "embedding_model": settings.EMBEDDING_MODEL,
                    "embedding_version": settings.EMBEDDING_VERSION,
                    "embedding_created_at": datetime.utcnow().isoformat()
                }
            except Exception as e:
                logger.warning(f"Embedding generation attempt {attempt} failed: {e}")
                if attempt >= max_retries:
                    val = sum(ord(c) for c in text) % 100 / 100.0
                    return {
                        "vector": [val] * 768,
                        "embedding_model": settings.EMBEDDING_MODEL,
                        "embedding_version": settings.EMBEDDING_VERSION,
                        "embedding_created_at": datetime.utcnow().isoformat()
                    }
                await asyncio.sleep(backoff_seconds)
                backoff_seconds *= 2.0

        val = sum(ord(c) for c in text) % 100 / 100.0
        return {
            "vector": [val] * 768,
            "embedding_model": settings.EMBEDDING_MODEL,
            "embedding_version": settings.EMBEDDING_VERSION,
            "embedding_created_at": datetime.utcnow().isoformat()
        }

    def _mock_extraction(self, text: str) -> ExtractedComplaintMetadata:
        lower_text = text.lower()
        dept = "General Department"
        issue = "General Inquiry"
        priority = "Medium"
        location = "City Center"
        
        for key, val in DEPARTMENTS.items():
            if key in lower_text:
                dept, issue, priority = val
                break
                
        words = lower_text.split()
        for i, word in enumerate(words):
            if word in ["at", "near", "in"] and i + 1 < len(words):
                location = " ".join(words[i+1:i+4]).title()
                break
                
        summary = text[:60] + "..." if len(text) > 60 else text
        return ExtractedComplaintMetadata(
            issue_type=issue,
            department=dept,
            priority=priority,
            location=location,
            summary=summary
        )

gemini_service = GeminiService()
