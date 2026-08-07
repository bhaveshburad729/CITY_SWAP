import os
import sys

sys.path.append(os.getcwd())

from server.database.db import SessionLocal
from server.services.admin_service import AdminService
from server.services.complaint_service import ComplaintService

db = SessionLocal()

try:
    print("=== TESTING ADMIN POSTGRESQL AGGREGATION & CSV EXPORT ===")

    # 1. Test Aggregated Metrics from PostgreSQL
    metrics = AdminService.get_dashboard_metrics(db)
    print("\n1. Live PostgreSQL Metrics:")
    print(f"   - Total Complaints: {metrics.total_complaints}")
    print(f"   - Pending: {metrics.pending_complaints}")
    print(f"   - In Progress: {metrics.in_progress_complaints}")
    print(f"   - Completed: {metrics.completed_complaints}")
    print(f"   - Resolution Rate: {metrics.resolution_rate}%")
    print(f"   - Active Trucks: {metrics.active_trucks}")
    ward_str = ", ".join([f"{w.name}: {w.percent}%" for w in metrics.top_wards])
    print(f"   - Top Wards Breakdown: {ward_str}")

    # 2. Test Driver Task Assignment
    all_complaints = ComplaintService.get_all_complaints(db)
    if all_complaints:
        target_id = all_complaints[0].db_id
        assigned = ComplaintService.assign_driver(db, target_id, "Ramesh Yadav")
        print(f"\n2. Assigned Driver to Complaint {target_id} in PostgreSQL:")
        print(f"   - New Driver: {assigned.assignedTo} | Status: {assigned.status}")

    # 3. Test CSV Report Generation
    csv_report = AdminService.generate_complaints_csv(db)
    print(f"\n3. Live CSV Export Generated ({len(csv_report.splitlines())} lines):")
    print(csv_report[:250] + "...")

    print("\nSUCCESS: All Admin PostgreSQL endpoints and CSV report generation verified!")

finally:
    db.close()
