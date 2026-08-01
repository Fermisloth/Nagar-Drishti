import jwt
import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from app.core.config import settings
from app.exceptions.base import SecurityException

ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt."""
    salt = os.urandom(16).hex()
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}${hashed}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against salt+hash string."""
    try:
        salt, stored_hash = hashed_password.split("$")
        computed_hash = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
        return stored_hash == computed_hash
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate JWT Access Token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate JWT Refresh Token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.JWT_REFRESH_SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str, is_refresh: bool = False) -> Dict[str, Any]:
    """Decode JWT Token and return payload dict."""
    secret = settings.JWT_REFRESH_SECRET_KEY if is_refresh else settings.JWT_SECRET_KEY
    try:
        payload = jwt.decode(token, secret, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise SecurityException("Token has expired.", status_code=401)
    except jwt.InvalidTokenError:
        raise SecurityException("Invalid token provided.", status_code=401)
