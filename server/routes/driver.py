from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.database.db import get_db
from server.schemas.task import DriverTaskResponse, DriverTaskStatusUpdate
from server.services.driver_service import DriverService
from server.utils.security import get_current_driver_user
from server.models.user import User

router = APIRouter(prefix="/api/driver", tags=["Driver Tasks"])

@router.get("/tasks", response_model=List[DriverTaskResponse])
def get_driver_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_driver_user)):
    return DriverService.get_driver_tasks(db, current_user)

@router.patch("/tasks/{task_id}/status", response_model=DriverTaskResponse)
def update_task_status(
    task_id: int,
    payload: DriverTaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_driver_user)
):
    try:
        return DriverService.update_task_status(db, task_id, payload.status, payload.proof_image_url, current_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
