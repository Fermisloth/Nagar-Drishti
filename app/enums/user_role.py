from enum import Enum

class UserRole(str, Enum):
    CITIZEN = "Citizen"
    OFFICER = "Officer"
    DEPARTMENT_ADMIN = "DepartmentAdmin"
    SYSTEM_ADMIN = "SystemAdmin"
