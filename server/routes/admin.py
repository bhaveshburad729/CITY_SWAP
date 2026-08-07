from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from server.database.db import get_db
from server.schemas.admin import AdminMetricsResponse, AssignTaskRequest
from server.schemas.complaint import ComplaintResponse
from server.services.admin_service import AdminService
from server.services.complaint_service import ComplaintService

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

@router.get("/metrics", response_model=AdminMetricsResponse)
def get_admin_metrics(db: Session = Depends(get_db)):
    return AdminService.get_dashboard_metrics(db)

@router.get("/complaints", response_model=List[ComplaintResponse])
def get_admin_complaints(db: Session = Depends(get_db)):
    return ComplaintService.get_all_complaints(db)

@router.post("/assign-task", response_model=ComplaintResponse)
def assign_task(payload: AssignTaskRequest, db: Session = Depends(get_db)):
    try:
        return ComplaintService.assign_driver(db, payload.complaint_id, payload.driver_name)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/export-csv")
def export_complaints_csv(db: Session = Depends(get_db)):
    try:
        csv_data = AdminService.generate_complaints_csv(db)
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=municipal_complaints_report.csv"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating CSV report: {str(e)}"
        )
