from typing import List, Optional
from uuid import UUID

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User
from app.enums.account_status import AccountStatus
from app.enums.user_role import UserRole  # Single canonical source of truth

# Re-export UserRole so existing imports from app.dependencies.auth continue to work
__all__ = ["UserRole", "get_current_user", "require_roles"]


security_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer),
    db: AsyncSession = Depends(get_db),
):
    """
    Extract the current user from a JWT and verify active status against the database.
    """

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    token = credentials.credentials

    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )

    # Check if sub is a valid UUID string
    is_uuid = False
    try:
        UUID(sub)
        is_uuid = True
    except ValueError:
        pass

    # Query the user from database
    if is_uuid:
        query = select(User).filter(User.id == sub)
    else:
        query = select(User).filter((User.username == sub) | (User.email == sub))

    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Hardening: Check if user is active, verified, not deleted, and not suspended/locked
    if not user.is_active or user.account_status != AccountStatus.ACTIVE or getattr(user, "deleted_at", None) is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive, deactivated, or locked",
        )

    return {
        "sub": str(user.id),
        "role": user.role.value if hasattr(user.role, "value") else user.role,
        "department": user.department.value if hasattr(user.department, "value") and user.department else user.department,
    }


def require_roles(allowed_roles: List[UserRole]):
    """
    RBAC dependency.
    """

    def checker(current_user=Depends(get_current_user)):
        if current_user["role"] not in [r.value for r in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return checker