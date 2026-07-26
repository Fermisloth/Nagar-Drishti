from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from app.core.config import settings
import logging

logger = logging.getLogger("urbanmind")

class QdrantStorage:
    def __init__(self):
        # Local embedded folder mode (Does NOT require Docker or port 6333)
        self.client = QdrantClient(path="./qdrant_db")

    def init_collection(self):
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == settings.QDRANT_COLLECTION_NAME for c in collections)

            if not exists:
                self.client.create_collection(
                    collection_name=settings.QDRANT_COLLECTION_NAME,
                    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
                )
                logger.info(f"Local Qdrant collection '{settings.QDRANT_COLLECTION_NAME}' created successfully.")
            else:
                logger.info(f"Local Qdrant collection '{settings.QDRANT_COLLECTION_NAME}' ready.")
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant DB: {e}")

qdrant_storage = QdrantStorage()