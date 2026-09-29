import random
from sqlalchemy.orm import Session
from typing import List, Optional
from server.models.complaint import Complaint
from server.models.task import DriverTask
from server.models.user import User
from server.schemas.complaint import ComplaintCreate, ComplaintResponse
from server.services.ai_service import AIService

class ComplaintService:
    @staticmethod
    def get_all_complaints(db: Session) -> List[ComplaintResponse]:
        complaints = db.query(Complaint).order_by(Complaint.id.desc()).all()
        if not complaints:
            # Seed default complaints matching CITIZEN.png & ADMIN DASHBOARD.png
            ComplaintService.seed_default_complaints(db)
            complaints = db.query(Complaint).order_by(Complaint.id.desc()).all()

        return [ComplaintService._to_response(c) for c in complaints]

    @staticmethod
    def get_user_complaints(db: Session, user_id: Optional[int]) -> List[ComplaintResponse]:
        if user_id:
            complaints = db.query(Complaint).filter(Complaint.citizen_id == user_id).order_by(Complaint.id.desc()).all()
            if complaints:
                return [ComplaintService._to_response(c) for c in complaints]
        return ComplaintService.get_all_complaints(db)

    @staticmethod
    def get_complaint_by_tracking_or_id(db: Session, identifier: str) -> Optional[ComplaintResponse]:
        clean_id = identifier.strip()
        # Try finding by tracking number
        complaint = db.query(Complaint).filter(Complaint.tracking_number.ilike(clean_id)).first()
        if not complaint and clean_id.isdigit():
            complaint = db.query(Complaint).filter(Complaint.id == int(clean_id)).first()
        if complaint:
            return ComplaintService._to_response(complaint)
        return None

    @staticmethod
    def create_complaint(db: Session, payload: ComplaintCreate, user: Optional[User] = None) -> ComplaintResponse:
        tracking_num = f"EP-2026-{random.randint(10000, 99999)}"
        ai_res = AIService.verify_waste_image(payload.image_url, payload.type)

        new_complaint = Complaint(
            tracking_number=tracking_num,
            citizen_id=user.id if user else None,
            ward=payload.ward or "Ward 12",
            location_address=payload.location,
            latitude=payload.latitude,
            longitude=payload.longitude,
            waste_type=payload.type,
            description=payload.description,
            image_url=payload.image_url,
            ai_status=ai_res["status"],
            ai_confidence=ai_res["confidence"],
            status="In Progress",
            assigned_driver_name="Ramesh Y."
        )
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)

        # Automatically create driver task for collection
        new_task = DriverTask(
            complaint_id=new_complaint.id,
            location_name=f"{new_complaint.location_address}",
            status="Pending"
        )
        db.add(new_task)
        db.commit()

        # Reward citizen with EcoCoins
        if user:
            user.eco_coins = (user.eco_coins or 100) + 25
            db.commit()

        return ComplaintService._to_response(new_complaint)

    @staticmethod
    def assign_driver(db: Session, complaint_id: int, driver_name: str) -> ComplaintResponse:
        complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if complaint:
            complaint.assigned_driver_name = driver_name
            complaint.status = "In Progress"
            db.commit()
            db.refresh(complaint)
            return ComplaintService._to_response(complaint)
        raise Exception(f"Complaint {complaint_id} not found")

    @staticmethod
    def seed_default_complaints(db: Session):
        seeds = [
            Complaint(
                tracking_number="EP-2026-00123",
                ward="Ward 12",
                location_address="Green Park, Ward 12",
                waste_type="Mixed Waste",
                status="In Progress",
                assigned_driver_name="Ramesh Y.",
                ai_status="Verified",
                ai_confidence=0.98
            ),
            Complaint(
                tracking_number="EP-2026-00122",
                ward="Ward 8",
                location_address="Sai Nagar, Ward 8",
                waste_type="Garbage Overflow",
                status="Pending",
                assigned_driver_name="Suresh K.",
                ai_status="Verified",
                ai_confidence=0.94
            ),
            Complaint(
                tracking_number="EP-2026-00121",
                ward="Ward 4",
                location_address="Market Area, Ward 4",
                waste_type="Plastic Waste",
                status="Completed",
                assigned_driver_name="Ajay P.",
                ai_status="Verified",
                ai_confidence=0.99
            )
        ]
        db.add_all(seeds)
        db.commit()

    @staticmethod
    def _to_response(c: Complaint) -> ComplaintResponse:
        status_color = "bg-emerald-100 text-emerald-800 border-emerald-300"
        if c.status == "Pending":
            status_color = "bg-red-100 text-red-800 border-red-300"
        elif c.status == "In Progress":
            status_color = "bg-yellow-100 text-yellow-800 border-yellow-300"

        return ComplaintResponse(
            id=c.tracking_number,
            db_id=c.id,
            location=c.location_address,
            type=c.waste_type,
            ward=c.ward,
            status=c.status,
            assignedTo=c.assigned_driver_name or "Unassigned",
            time="10 mins ago" if c.status == "In Progress" else ("25 mins ago" if c.status == "Pending" else "1 hour ago"),
            statusColor=status_color,
            image_url=c.image_url,
            ai_status=c.ai_status or "Verified",
            ai_confidence=c.ai_confidence or 0.95
        )
