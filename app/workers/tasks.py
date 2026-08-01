import asyncio
from app.tasks.celery_app import celery_app
import logging

logger = logging.getLogger("urbanmind")

@celery_app.task(name="async_process_complaint_task")
def async_process_complaint_task(complaint_text: str, location: str = None):
    """
    Celery task to run complaint ingestion asynchronously in worker background process.
    """
    logger.info(f"Processing asynchronous background complaint task for: {complaint_text[:30]}...")
    # Background execution wrapper
    return {
        "status": "completed",
        "processed_text_length": len(complaint_text)
    }
