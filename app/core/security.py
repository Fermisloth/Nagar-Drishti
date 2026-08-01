import jwt
import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from app.core.config import settings
from app.exceptions.base import SecurityException
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Argon2 password hasher instance
ph = PasswordHasher(
    time_cost=getattr(settings, "ARGON2_TIME_COST", 2),
    memory_cost=getattr(settings, "ARGON2_MEMORY_COST", 102400),
    parallelism=1,
    hash_len=32,
    salt_len=16,
)

ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    """Hash a password using Argon2id via the configured hasher."""
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against an Argon2id hash.

    Returns ``True`` if the password matches, ``False`` otherwise.
    """
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
    except Exception as exc:
        raise SecurityException(f"Password verification failed: {exc}", status_code=401)

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
