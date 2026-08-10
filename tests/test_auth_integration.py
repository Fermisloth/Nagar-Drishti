"""
test_auth_integration.py — JWT/RBAC authentication integration tests.

Tests the full authentication stack without requiring a live database.
Covers:
  - JWT token creation and decoding
  - Expired token rejection
  - Invalid/malformed token rejection
  - Missing token rejection (401)
  - Role-based access: permitted vs insufficient roles
  - Argon2 password hashing correctness
  - UserRole enum consistency (single source of truth)
"""
import pytest
from datetime import timedelta, timezone, datetime
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.enums.user_role import UserRole
from app.dependencies.auth import get_current_user, require_roles
from app.exceptions.base import SecurityException


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_token(sub: str = "user-123", role: str = UserRole.OFFICER, **extra) -> str:
    """Create a valid access token for test subjects."""
    data = {"sub": sub, "role": role, **extra}
    return create_access_token(data)


def make_expired_token(sub: str = "user-123", role: str = UserRole.OFFICER) -> str:
    """Create an already-expired access token."""
    data = {"sub": sub, "role": role}
    return create_access_token(data, expires_delta=timedelta(seconds=-1))


# ---------------------------------------------------------------------------
# 1. Token creation & decoding
# ---------------------------------------------------------------------------

def test_access_token_contains_correct_claims():
    token = make_token(sub="officer-abc", role=UserRole.OFFICER)
    payload = decode_token(token)
    assert payload["sub"] == "officer-abc"
    assert payload["role"] == UserRole.OFFICER
    assert payload["type"] == "access"
    assert "exp" in payload


def test_refresh_token_type_claim():
    data = {"sub": "officer-abc", "role": UserRole.OFFICER}
    token = create_refresh_token(data)
    payload = decode_token(token, is_refresh=True)
    assert payload["type"] == "refresh"


def test_access_token_decode_fails_when_using_refresh_secret():
    """An access token must not decode with the refresh secret."""
    token = make_token()
    with pytest.raises(SecurityException):
        decode_token(token, is_refresh=True)


# ---------------------------------------------------------------------------
# 2. Expired token
# ---------------------------------------------------------------------------

def test_expired_token_raises_security_exception():
    token = make_expired_token()
    with pytest.raises(SecurityException) as exc_info:
        decode_token(token)
    assert "expired" in str(exc_info.value).lower()


# ---------------------------------------------------------------------------
# 3. Invalid / malformed token
# ---------------------------------------------------------------------------

def test_malformed_token_raises_security_exception():
    with pytest.raises(SecurityException):
        decode_token("this.is.not.a.real.token")


def test_empty_token_raises_security_exception():
    with pytest.raises(SecurityException):
        decode_token("")


# ---------------------------------------------------------------------------
# 4. UserRole enum — single canonical source of truth
# ---------------------------------------------------------------------------

def test_user_role_enum_values():
    """UserRole from enums/user_role.py must match what auth.py re-exports."""
    from app.dependencies.auth import UserRole as AuthUserRole
    from app.enums.user_role import UserRole as EnumUserRole

    # They must be the same class (not two independent enums)
    assert AuthUserRole is EnumUserRole, (
        "UserRole must be defined ONLY in app.enums.user_role. "
        "app.dependencies.auth must re-export it, not redefine it."
    )


def test_user_role_values():
    assert UserRole.CITIZEN == "Citizen"
    assert UserRole.OFFICER == "Officer"
    assert UserRole.DEPARTMENT_ADMIN == "DepartmentAdmin"
    assert UserRole.SYSTEM_ADMIN == "SystemAdmin"


# ---------------------------------------------------------------------------
# 5. Argon2 password hashing
# ---------------------------------------------------------------------------

def test_password_hash_is_not_plaintext():
    hashed = hash_password("secret123")
    assert hashed != "secret123"
    assert len(hashed) > 20


def test_correct_password_verifies_true():
    hashed = hash_password("MyP@ssw0rd!")
    assert verify_password("MyP@ssw0rd!", hashed) is True


def test_wrong_password_verifies_false():
    hashed = hash_password("MyP@ssw0rd!")
    assert verify_password("wrongpassword", hashed) is False


def test_each_hash_is_unique():
    """Argon2 must use a unique salt per call."""
    h1 = hash_password("same")
    h2 = hash_password("same")
    assert h1 != h2


# ---------------------------------------------------------------------------
# 6. get_current_user dependency — missing / invalid token
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_get_current_user_no_credentials_raises_401():
    db_mock = AsyncMock()
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(credentials=None, db=db_mock)
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_invalid_token_raises_401():
    db_mock = AsyncMock()
    bad_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials="invalid.token.here")
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(credentials=bad_creds, db=db_mock)
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_valid_token_but_user_not_in_db_raises_401():
    """Token is valid but the user does not exist in the DB."""
    db_mock = AsyncMock()
    token = make_token(sub="nonexistent-user-id")
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    # Simulate DB returning nothing
    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = None
    db_mock.execute = AsyncMock(return_value=mock_result)

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(credentials=creds, db=db_mock)
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_inactive_user_raises_403():
    """Token valid, user found but account inactive — must return 403."""
    from app.enums.account_status import AccountStatus

    db_mock = AsyncMock()
    token = make_token(sub="inactive-user-id")
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    mock_user = MagicMock()
    mock_user.id = "inactive-user-id"
    mock_user.is_active = False
    mock_user.account_status = AccountStatus.SUSPENDED
    mock_user.deleted_at = None
    mock_user.role = UserRole.OFFICER
    mock_user.department = None

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_user
    db_mock.execute = AsyncMock(return_value=mock_result)

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(credentials=creds, db=db_mock)
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_get_current_user_active_user_returns_dict():
    """Valid token + active user → returns dict with sub, role, department."""
    from app.enums.account_status import AccountStatus

    db_mock = AsyncMock()
    token = make_token(sub="active-user-uuid")
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    mock_user = MagicMock()
    mock_user.id = "active-user-uuid"
    mock_user.is_active = True
    mock_user.account_status = AccountStatus.ACTIVE
    mock_user.deleted_at = None
    mock_user.role = UserRole.OFFICER
    mock_user.department = None

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_user
    db_mock.execute = AsyncMock(return_value=mock_result)

    result = await get_current_user(credentials=creds, db=db_mock)
    assert result["sub"] == str(mock_user.id)
    assert result["role"] == UserRole.OFFICER.value


# ---------------------------------------------------------------------------
# 7. require_roles dependency — role enforcement
# ---------------------------------------------------------------------------

def test_require_roles_permitted_role_passes():
    """A user with the correct role must pass through."""
    checker = require_roles([UserRole.OFFICER, UserRole.SYSTEM_ADMIN])
    current_user = {"sub": "u1", "role": "Officer", "department": None}
    result = checker(current_user=current_user)
    assert result == current_user


def test_require_roles_insufficient_role_raises_403():
    """A CITIZEN attempting to access an OFFICER route must get 403."""
    checker = require_roles([UserRole.OFFICER, UserRole.SYSTEM_ADMIN])
    citizen_user = {"sub": "u2", "role": "Citizen", "department": None}
    with pytest.raises(HTTPException) as exc_info:
        checker(current_user=citizen_user)
    assert exc_info.value.status_code == 403


def test_require_roles_system_admin_passes_any_protected_route():
    """SYSTEM_ADMIN has the highest privilege and must pass any route."""
    checker = require_roles([UserRole.OFFICER, UserRole.DEPARTMENT_ADMIN, UserRole.SYSTEM_ADMIN])
    admin_user = {"sub": "u3", "role": "SystemAdmin", "department": None}
    result = checker(current_user=admin_user)
    assert result == admin_user
