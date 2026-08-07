from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintCreate(BaseModel):
    location: str
    type: str
    ward: Optional[str] = "Ward 12"
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: str # Tracking ID, e.g., EP-2026-00123
    db_id: int
    location: str
    type: str
    ward: str
    status: str
    assignedTo: Optional[str] = "Unassigned"
    time: str
    statusColor: str
    image_url: Optional[str] = None
    ai_status: str = "Verified"
    ai_confidence: float = 0.95

    class Config:
        from_attributes = True
