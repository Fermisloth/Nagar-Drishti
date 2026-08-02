from enum import Enum
from typing import List, Optional
from fastapi import Depends, Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from app.exceptions.base import SecurityException

class UserRole(str, Enum):
    CITIZEN = "Citizen"
    OFFICER = "Officer"
    DEPARTMENT_ADMIN = "DepartmentAdmin"
    SYSTEM_ADMIN = "SystemAdmin"

security_bearer = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)) -> dict:
    """Dependency to extract user identity and role from JWT token."""
    if not credentials:
        # For public routes returning anonymous citizen role
        return {"sub": "anonymous", "role": UserRole.CITIZEN}
        
    token = credentials.credentials
    payload = decode_token(token)
    return {
        "sub": payload.get("sub"),
        "role": payload.get("role", UserRole.CITIZEN),
        "department": payload.get("department")
    }

def require_roles(allowed_roles: List[UserRole]):
    """Higher-order dependency to enforce RBAC permissions."""
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role")
        if user_role not in allowed_roles:
            raise SecurityException(
                f"Access forbidden: Required role in {[r.value for r in allowed_roles]}, but user has role '{user_role}'.",
                status_code=403
            )
        return current_user
    return role_checker
