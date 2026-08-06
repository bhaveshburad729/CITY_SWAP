from sqlalchemy.orm import Session
from typing import List, Optional
from server.models.task import DriverTask
from server.models.complaint import Complaint
from server.models.user import User
from server.schemas.task import DriverTaskResponse

class DriverService:
    @staticmethod
    def get_driver_tasks(db: Session, driver: Optional[User] = None) -> List[DriverTaskResponse]:
        query = db.query(DriverTask)
        if driver and driver.id:
            query = query.filter((DriverTask.driver_id == driver.id) | (DriverTask.driver_id == None))
            
        tasks = query.order_by(DriverTask.id.asc()).all()
        if not tasks:
            DriverService.seed_default_tasks(db)
            tasks = db.query(DriverTask).order_by(DriverTask.id.asc()).all()

        return [DriverService._to_response(t) for t in tasks]

    @staticmethod
    def update_task_status(db: Session, task_id: int, new_status: str, proof_image: str = None, driver: Optional[User] = None) -> DriverTaskResponse:
        task = db.query(DriverTask).filter(DriverTask.id == task_id).first()
        if not task:
            raise Exception(f"Task {task_id} not found")

        task.status = new_status
        if proof_image:
            task.proof_image_url = proof_image

        # Sync linked complaint status in PostgreSQL
        if task.complaint_id:
            complaint = db.query(Complaint).filter(Complaint.id == task.complaint_id).first()
            if complaint:
                complaint.status = "Completed" if new_status == "Completed" else ("In Progress" if new_status == "In Progress" else "Pending")
                if new_status == "Completed" and complaint.citizen_id:
                    citizen = db.query(User).filter(User.id == complaint.citizen_id).first()
                    if citizen:
                        citizen.eco_coins = (citizen.eco_coins or 100) + 25

        # Award driver eco coins for completing task
        if new_status == "Completed" and driver:
            driver.eco_coins = (driver.eco_coins or 100) + 50

        db.commit()
        db.refresh(task)
        return DriverService._to_response(task)

    @staticmethod
    def seed_default_tasks(db: Session):
        seeds = [
            DriverTask(id=1, location_name="1. Green Park, Plot No. 45", status="Completed", route_order=1),
            DriverTask(id=2, location_name="2. Sai Nagar, Main Road", status="In Progress", route_order=2),
            DriverTask(id=3, location_name="3. Shanti Apartment", status="Pending", route_order=3),
            DriverTask(id=4, location_name="4. Market Area, Gate No. 2", status="Pending", route_order=4),
        ]
        db.add_all(seeds)
        db.commit()

    @staticmethod
    def _to_response(t: DriverTask) -> DriverTaskResponse:
        status_color = "bg-emerald-100 text-emerald-800 border-emerald-200" if t.status in ["Completed", "In Progress"] else "bg-amber-100 text-amber-800 border-amber-200"
        return DriverTaskResponse(
            id=t.id,
            name=t.location_name,
            status=t.status,
            statusColor=status_color,
            location_name=t.location_name,
            complaint_id=t.complaint_id,
            proof_image_url=t.proof_image_url
        )
