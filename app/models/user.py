from uuid import uuid4
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base
from app.enums.user_role import UserRole
from app.enums.account_status import AccountStatus
from app.enums.department import Department


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole, name="user_role"), nullable=False, default=UserRole.CITIZEN)
    department = Column(SAEnum(Department, name="department"), nullable=True)
    account_status = Column(SAEnum(AccountStatus, name="account_status"), nullable=False, default=AccountStatus.ACTIVE)

    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)

    failed_login_attempts = Column(Integer, nullable=False, default=0)
    locked_until = Column(DateTime, nullable=True)
    last_failed_login = Column(DateTime, nullable=True)
    last_login_ip = Column(String(45), nullable=True)  # IPv6 max length

    password_changed_at = Column(DateTime, nullable=True)
    email_verified_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    deleted_at = Column(DateTime, nullable=True)
    version = Column(Integer, nullable=False, default=1)

    __mapper_args__ = {
        "version_id_col": version
    }

    __table_args__ = (
        Index("ix_user_email", "email"),
        Index("ix_user_username", "username"),
    )
