from typing import List, Dict, Any, Optional
from qdrant_client.http.models import PointStruct
from app.core.qdrant import qdrant_storage
from app.core.config import settings
import logging

logger = logging.getLogger("urbanmind")

class VectorService:
    def __init__(self):
        self.client = qdrant_storage.client
        self.collection_name = settings.QDRANT_COLLECTION_NAME

    def upsert_complaint(self, complaint_id: str, vector: List[float], payload: Dict[str, Any]):
        """
        Upsert a complaint's vector and associated metadata payload to Qdrant.
        """
        try:
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    PointStruct(
                        id=complaint_id,
                        vector=vector,
                        payload=payload
                    )
                ]
            )
            logger.info(f"Successfully upserted vector for complaint ID: {complaint_id}")
        except Exception as e:
            logger.error(f"Failed to upsert vector to Qdrant: {e}")

    def search_similar_complaints(
        self,
        vector: List[float],
        score_threshold: float = 0.82,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Query Qdrant for similar complaints above a score threshold.
        Returns a list of match payloads including similarity score.
        """
        try:
            results = self.client.search(
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
