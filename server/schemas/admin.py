from pydantic import BaseModel
from typing import List, Dict

class AssignTaskRequest(BaseModel):
    complaint_id: int
    driver_name: str

class WardPerformance(BaseModel):
    name: str
    percent: int

class AdminMetricsResponse(BaseModel):
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    completed_complaints: int
    resolution_rate: float
    active_trucks: int
    top_wards: List[WardPerformance]
