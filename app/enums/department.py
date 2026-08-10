from enum import Enum

class Department(str, Enum):
    WATER = "Water Supply & Sewage"
    ROADS = "Roads & Maintenance"
    ELECTRICITY = "Electricity & Streetlights"
    SANITATION = "Sanitation & Waste"
