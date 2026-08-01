from typing import List, Dict, Any, Optional
from qdrant_client.http.models import PointStruct, Distance, VectorParams
from app.core.qdrant import qdrant_storage
from app.core.config import settings
from app.exceptions.base import VectorStoreException
import logging
import time

logger = logging.getLogger("urbanmind")

class VectorService:
    def __init__(self):
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self.verify_and_initialize_collection()

    def get_client(self):
        """Returns the Qdrant client instance, attempting reconnect if necessary."""
        return qdrant_storage.client

    def verify_and_initialize_collection(self):
        """Verify collection dimensions (768) and distance metric (COSINE). Creates if missing."""
        try:
            client = self.get_client()
            collections = client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)

            if not exists:
                client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
                )
                logger.info(f"Qdrant collection '{self.collection_name}' initialized with 768 dimensions and COSINE metric.")
            else:
                info = client.get_collection(self.collection_name)
                # Verify dimensions
                size = info.config.params.vectors.size
                if size != 768:
                    logger.warning(f"Vector dimension mismatch in collection '{self.collection_name}': expected 768, found {size}.")
        except Exception as e:
            logger.error(f"Error initializing Qdrant collection: {e}")

    def upsert_complaint(self, complaint_id: str, vector: List[float], payload: Dict[str, Any]):
        """
        Upsert a complaint's vector and associated payload to Qdrant.
        Payload metadata includes complaint_id, incident_id, department, priority, created_at, location.
        """
        try:
            client = self.get_client()
            full_payload = {
                "complaint_id": complaint_id,
                "incident_id": payload.get("incident_id"),
                "department": payload.get("department"),
                "priority": payload.get("priority"),
                "created_at": payload.get("created_at"),
                "location": payload.get("location", "Unknown"),
            }
            client.upsert(
                collection_name=self.collection_name,
                points=[
                    PointStruct(
                        id=complaint_id,
                        vector=vector,
                        payload=full_payload
                    )
                ]
            )
            logger.info(f"Upserted vector for complaint ID: {complaint_id}")
        except Exception as e:
            logger.error(f"Failed to upsert vector to Qdrant: {e}")
            raise VectorStoreException("Failed to upsert complaint vector", detail=str(e))

    def search_similar_complaints(
        self,
        vector: List[float],
        score_threshold: float = settings.DECISION_SIMILARITY_THRESHOLD,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Query Qdrant for similar complaints above score threshold.
        """
        try:
            client = self.get_client()
            results = client.search(
                collection_name=self.collection_name,
                query_vector=vector,
                limit=limit,
                score_threshold=score_threshold
            )
            
            matches = []
            for res in results:
                matches.append({
                    "complaint_id": res.id,
                    "score": res.score,
                    "payload": res.payload
                })
            return matches
        except Exception as e:
            logger.error(f"Failed to query Qdrant search: {e}")
            return []

vector_service = VectorService()
