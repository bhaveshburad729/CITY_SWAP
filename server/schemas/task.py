from pydantic import BaseModel
from typing import Optional

class DriverTaskStatusUpdate(BaseModel):
    status: str # Pending, In Progress, Completed
    proof_image_url: Optional[str] = None

class DriverTaskResponse(BaseModel):
    id: int
    name: str
    status: str
    statusColor: str
    location_name: str
    complaint_id: Optional[int] = None
    proof_image_url: Optional[str] = None

    class Config:
        from_attributes = True
