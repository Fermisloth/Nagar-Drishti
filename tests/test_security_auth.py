import pytest
from app.core.security import create_access_token, decode_token, hash_password, verify_password
from app.dependencies.auth import UserRole
from app.exceptions.base import SecurityException

def test_password_hashing_and_verification():
    password = "MySecurePassword123!"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_encode_decode():
    data = {"sub": "officer_101", "role": UserRole.OFFICER}
    token = create_access_token(data)
    decoded = decode_token(token)
    assert decoded["sub"] == "officer_101"
    assert decoded["role"] == UserRole.OFFICER
    assert decoded["type"] == "access"
