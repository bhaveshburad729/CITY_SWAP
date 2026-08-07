import os
import sys

sys.path.append(os.getcwd())

from server.database.db import SessionLocal
from server.models.user import User
from server.models.complaint import Complaint
from server.models.task import DriverTask
from server.models.item import Item

db = SessionLocal()

try:
    print("=== DATABASE INSPECTION & TABLE SUMMARY ===")
    
    users = db.query(User).all()
    print(f"\n1. USERS TABLE ({len(users)} records):")
    for u in users:
        print(f"   - ID: {u.id} | Name: {u.full_name:<18} | Email: {u.email:<22} | Role: {u.role:<10} | EcoCoins: {u.eco_coins}")

    complaints = db.query(Complaint).all()
    print(f"\n2. COMPLAINTS TABLE ({len(complaints)} records):")
    for c in complaints:
        print(f"   - Tracking: {c.tracking_number} | Ward: {c.ward} | Type: {c.waste_type:<16} | Status: {c.status:<12} | Driver: {c.assigned_driver_name}")

    tasks = db.query(DriverTask).all()
    print(f"\n3. DRIVER TASKS TABLE ({len(tasks)} records):")
    for t in tasks:
        print(f"   - ID: {t.id} | Location: {t.location_name:<30} | Status: {t.status}")

    items = db.query(Item).all()
    print(f"\n4. SWAP ITEMS TABLE ({len(items)} records):")
    for i in items:
        print(f"   - ID: {i.id} | Title: {i.title:<25} | Route: {i.offered_city} -> {i.desired_city} | Category: {i.category}")

finally:
    db.close()
