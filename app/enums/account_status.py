from enum import Enum

class AccountStatus(str, Enum):
    ACTIVE = "Active"
    SUSPENDED = "Suspended"
    LOCKED = "Locked"
    DEACTIVATED = "Deactivated"
