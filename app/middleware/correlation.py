import uuid
import contextvars
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

# Contextvar to store the correlation ID for the current thread/task
correlation_id_ctx = contextvars.ContextVar("correlation_id", default="")

def get_correlation_id() -> str:
    """Helper to retrieve the current request's correlation ID."""
    return correlation_id_ctx.get()

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract ID from incoming headers or generate a new one
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        
        # Set the context variable
        token = correlation_id_ctx.set(correlation_id)
        
        try:
            response: Response = await call_next(request)
            # Add correlation ID to the response header
            response.headers["X-Correlation-ID"] = correlation_id
            return response
        finally:
            # Clean up context
            correlation_id_ctx.reset(token)
