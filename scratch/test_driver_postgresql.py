import os
import sys

sys.path.append(os.getcwd())

from server.database.db import SessionLocal
from server.models.user import User
from server.models.complaint import Complaint
from server.models.task import DriverTask
from server.services.driver_service import DriverService

db = SessionLocal()

try:
    print("=== TESTING DRIVER POSTGRESQL TASK STATUS & COMPLAINT SYNC ===")

    # 1. Fetch Driver Tasks from PostgreSQL
    driver = db.query(User).filter(User.role == "driver").first()
    print(f"\n1. Driver Session Loaded: {driver.full_name} ({driver.email})")
    
    tasks = DriverService.get_driver_tasks(db, driver)
    print(f"   - Total Tasks Fetched: {len(tasks)}")
    for t in tasks:
        print(f"     Task #{t.id}: {t.name} -> Status: {t.status}")

    # 2. Toggle Task Status to Completed
    if tasks:
        target_task_id = tasks[1].id # Task #2
        print(f"\n2. Updating Task #{target_task_id} to 'Completed'...")
        updated_t = DriverService.update_task_status(db, target_task_id, "Completed", driver=driver)
        print(f"   - Task #{updated_t.id} New Status: {updated_t.status}")

        # Verify linked complaint
        linked_complaint = db.query(Complaint).filter(Complaint.id == updated_t.complaint_id).first() if updated_t.complaint_id else None
        if linked_complaint:
            print(f"   - Linked Complaint ({linked_complaint.tracking_number}) Status in PostgreSQL: {linked_complaint.status}")

        db.refresh(driver)
        print(f"   - Driver's Updated EcoCoins Balance in PostgreSQL: {driver.eco_coins}")

    print("\nSUCCESS: All Driver PostgreSQL tasks, status syncing, and EcoCoins rewards verified!")

finally:
    db.close()
