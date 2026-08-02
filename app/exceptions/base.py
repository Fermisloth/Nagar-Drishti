from typing import Any, Dict, Optional

class UrbanMindException(Exception):
    """Base exception class for all custom UrbanMind errors."""
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        detail: Optional[Any] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.detail = detail

class RepositoryException(UrbanMindException):
    """Exception related to database CRUD errors."""
    def __init__(self, message: str, detail: Optional[Any] = None):
        super().__init__(message, status_code=500, detail=detail)

class AIException(UrbanMindException):
    """Exception related to Gemini LLM or embedding failures."""
    def __init__(self, message: str, detail: Optional[Any] = None):
        super().__init__(message, status_code=502, detail=detail)

class VectorStoreException(UrbanMindException):
    """Exception raised on Qdrant failures or collection mismatch."""
    def __init__(self, message: str, detail: Optional[Any] = None):
        super().__init__(message, status_code=502, detail=detail)

class SecurityException(UrbanMindException):
    """Exception raised on authorization/authentication failures."""
    def __init__(self, message: str, status_code: int = 401, detail: Optional[Any] = None):
        super().__init__(message, status_code=status_code, detail=detail)

class ValidationException(UrbanMindException):
    """Exception raised when input fails schemas or integrity checks."""
    def __init__(self, message: str, detail: Optional[Any] = None):
        super().__init__(message, status_code=422, detail=detail)
