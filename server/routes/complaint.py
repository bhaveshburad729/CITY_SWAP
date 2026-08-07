from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from server.database.db import get_db
from server.schemas.complaint import ComplaintCreate, ComplaintResponse
from server.services.complaint_service import ComplaintService
from server.utils.security import get_current_user_optional
from server.models.user import User

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

@router.get("", response_model=List[ComplaintResponse])
def get_complaints(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user_optional)):
    return ComplaintService.get_all_complaints(db)

@router.get("/my", response_model=List[ComplaintResponse])
def get_my_complaints(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user_optional)):
    user_id = current_user.id if current_user else None
    return ComplaintService.get_user_complaints(db, user_id)

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    payload: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    try:
        return ComplaintService.create_complaint(db, payload, current_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
