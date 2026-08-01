import json
import logging
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from google.genai.errors import APIError
from app.core.config import settings
from app.schemas.complaint import ExtractedComplaintMetadata

logger = logging.getLogger("urbanmind")

# Fallback helper keywords for mock parsing when Gemini key is inactive
DEPARTMENTS = {
    "water": ("Water Supply & Sewage", "Water Leakage", "Medium"),
    "pipe": ("Water Supply & Sewage", "Water Leakage", "Medium"),
    "sewage": ("Water Supply & Sewage", "Sewage Overflow", "High"),
    "drain": ("Water Supply & Sewage", "Sewage Overflow", "High"),
    "pothole": ("Roads & Maintenance", "Pothole", "Low"),
    "road": ("Roads & Maintenance", "Road Damage", "Low"),
    "street": ("Roads & Maintenance", "Road Damage", "Low"),
    "light": ("Electricity & Streetlights", "Streetlight Broken", "Low"),
    "power": ("Electricity & Streetlights", "Power Cut", "Medium"),
    "electricity": ("Electricity & Streetlights", "Power Cut", "Medium"),
    "garbage": ("Sanitation & Waste", "Garbage Dumping", "Low"),
    "waste": ("Sanitation & Waste", "Garbage Dumping", "Low"),
    "trash": ("Sanitation & Waste", "Garbage Dumping", "Low"),
}

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_active = bool(self.api_key and self.api_key != "your_api_key_here")
        self.client = None
        if self.is_active:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize live Gemini Client: {e}")
                self.is_active = False

    async def extract_metadata(self, text: str) -> ExtractedComplaintMetadata:
        """
        Extract structured details (issue_type, department, priority, location, summary) from raw text.
        """
        if not self.is_active:
            logger.info("Using mock metadata extractor (Gemini key not configured).")
            return self._mock_extraction(text)
            
        prompt = f"""
        Extract the following fields from the citizen complaint text below:
        - issue_type: The type of civic issue (e.g. Pothole, Water Leakage, Garbage Dumping, Streetlight Broken, Power Cut)
        - department: The municipal department responsible (e.g. Roads & Maintenance, Water Supply & Sewage, Sanitation & Waste, Electricity & Streetlights)
        - priority: Assessment of priority (High, Medium, Low)
        - location: Mentioned location details or landmarks, if any.
        - summary: A 1-sentence clean summary of the complaint.

        Complaint Text: "{text}"
        """
        
        try:
            # Generate structured JSON matching the Pydantic schema
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ExtractedComplaintMetadata,
                ),
            )
            # Parse response text back to model
            data = json.loads(response.text)
            return ExtractedComplaintMetadata(**data)
        except Exception as e:
            logger.error(f"Gemini metadata extraction failed: {e}. Falling back to keyword search.")
            return self._mock_extraction(text)

    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate a 768-dimensional vector embedding for the input text.
        """
        if not self.is_active:
            # Generate deterministic mock 768-dim vector based on text content
            val = sum(ord(c) for c in text) % 100 / 100.0
            return [val] * 768
            
        try:
            response = self.client.models.embed_content(
                model='text-embedding-004',
                contents=text,
            )
            # Extracted embedded values
            embedding = response.embeddings[0].values
            return embedding
        except Exception as e:
            logger.error(f"Gemini embedding generation failed: {e}. Falling back to deterministic mock vector.")
            val = sum(ord(c) for c in text) % 100 / 100.0
            return [val] * 768

    def _mock_extraction(self, text: str) -> ExtractedComplaintMetadata:
        # Lowercase search for department keywords
        lower_text = text.lower()
        dept = "General Department"
        issue = "General Inquiry"
        priority = "Medium"
        location = "City Center"
        
        # Simple extraction search
        for key, val in DEPARTMENTS.items():
            if key in lower_text:
                dept, issue, priority = val
                break
                
        # Try to guess a simple location if 'at' or 'near' or 'in' is present
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
