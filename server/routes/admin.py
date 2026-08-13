from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List

from server.database.db import get_db
from server.schemas.admin import (
    AdminMetricsResponse, AssignTaskRequest,
    AdminDriverCreate, AdminDriverResponse, DriverStatusUpdate,
    ComplaintStatusUpdate,
    BinTelemetrySummary, BinFillUpdate, BinResponse,
    AnalyticsResponse,
    NotificationResponse, BroadcastRequest,
    AdminUserResponse
)
from server.schemas.complaint import ComplaintResponse
from server.services.admin_service import AdminService
from server.services.complaint_service import ComplaintService
from server.utils.security import get_current_admin_user
from server.models.user import User

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])


# ─────────────────────────────────────────────────────────────────────────────
# Dashboard Metrics
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/metrics", response_model=AdminMetricsResponse)
def get_admin_metrics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Returns real-time dashboard KPIs: complaint counts, resolution rate, active trucks, ward performance."""
    return AdminService.get_dashboard_metrics(db)


# ─────────────────────────────────────────────────────────────────────────────
# Complaints Management
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/complaints", response_model=List[ComplaintResponse])
def get_admin_complaints(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Returns all complaints visible to admin (all statuses, all wards)."""
    return ComplaintService.get_all_complaints(db)


@router.post("/assign-task", response_model=ComplaintResponse)
def assign_task(
    payload: AssignTaskRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Assigns a driver to a complaint, updates status to In Progress."""
    try:
        return ComplaintService.assign_driver(db, payload.complaint_id, payload.driver_name)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/complaints/{complaint_db_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_db_id: int,
    payload: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Admin updates the status of any complaint (Pending → In Progress → Completed)."""
    valid_statuses = ["Pending", "In Progress", "Completed"]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    updated = AdminService.update_complaint_status(db, complaint_db_id, payload.status)
    # Re-use existing complaint response serializer
    return ComplaintService._to_response(updated)


@router.get("/export-csv")
def export_complaints_csv(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Generates and downloads a full complaints audit CSV report."""
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


# ─────────────────────────────────────────────────────────────────────────────
# Driver Management
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/drivers", response_model=List[AdminDriverResponse])
def get_all_drivers(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Returns all drivers and collectors with their task stats and profile data."""
    return AdminService.get_all_drivers(db)


@router.post("/drivers", response_model=AdminDriverResponse, status_code=status.HTTP_201_CREATED)
def create_driver(
    payload: AdminDriverCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Admin registers a new driver account."""
    try:
        return AdminService.create_driver(db, payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/drivers/{driver_id}/status", response_model=AdminDriverResponse)
def update_driver_status(
    driver_id: int,
    payload: DriverStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Admin activates or deactivates a driver account."""
    return AdminService.update_driver_status(db, driver_id, payload.is_active)


# ─────────────────────────────────────────────────────────────────────────────
# Smart Bin Telemetry
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/bins", response_model=BinTelemetrySummary)
def get_bin_telemetry(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Returns smart bin telemetry: fill levels, capacities, locations, critical alerts."""
    return AdminService.get_bin_telemetry(db)


@router.patch("/bins/{bin_id}", response_model=BinResponse)
def update_bin(
    bin_id: int,
    payload: BinFillUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Admin updates a bin's fill level (e.g., after manual collection or sensor sync)."""
    return AdminService.update_bin_fill(db, bin_id, payload.fill_level_pct, payload.is_active)


# ─────────────────────────────────────────────────────────────────────────────
# Analytics
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Returns aggregated analytics: ward breakdown, monthly trends, waste type distribution."""
    return AdminService.get_analytics(db)


# ─────────────────────────────────────────────────────────────────────────────
# Notifications & Broadcasts
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Returns system notifications and broadcast history for admin view."""
    return AdminService.get_notifications(db)


@router.post("/notifications/broadcast", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def send_broadcast(
    payload: BroadcastRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Admin sends a broadcast notification to drivers or all users."""
    try:
        return AdminService.send_broadcast(
            db,
            sender_id=current_admin.id,
            title=payload.title,
            message=payload.message,
            audience=payload.audience,
            priority=payload.priority
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Marks a notification as read."""
    from server.models.notification import Notification
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    notif.is_read = True
    db.commit()
    return {"success": True, "id": notification_id}


# ─────────────────────────────────────────────────────────────────────────────
# User Management
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[AdminUserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Returns all users in the system (citizens, drivers, collectors, admins)."""
    return AdminService.get_all_users(db)
