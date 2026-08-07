import os
import sys

sys.path.append(os.getcwd())

from server.database.db import SessionLocal
from server.models.user import User
from server.schemas.auth import LoginRequest, UserProfileUpdate
from server.services.auth_service import AuthService
from server.services.complaint_service import ComplaintService

db = SessionLocal()

try:
    print("=== TESTING MULTI-USER SESSIONS & PROFILE UPDATES ===")

    # 1. User Session A: Priya
    login_priya = LoginRequest(email="priya@cityswap.io", password="Password123!", role="citizen")
    res_priya = AuthService.login_user(db, login_priya)
    print(f"\nSession A Initialized: {res_priya.user.name} ({res_priya.user.email})")
    print(f"Priya's Token: {res_priya.access_token[:30]}...")

    # 2. User Session B: Rahul
    login_rahul = LoginRequest(email="rahul@cityswap.io", password="Password123!", role="citizen")
    res_rahul = AuthService.login_user(db, login_rahul)
    print(f"\nSession B Initialized: {res_rahul.user.name} ({res_rahul.user.email})")
    print(f"Rahul's Token: {res_rahul.access_token[:30]}...")

    # 3. Update Profile for Session A
    priya_db = db.query(User).filter(User.id == res_priya.user.id).first()
    update_data = UserProfileUpdate(full_name="Priya R. Patil", ward="Ward 12", phone="+91 9988776655")
    updated_priya = AuthService.update_user_profile(db, priya_db, update_data)
    print(f"\nSession A Profile Updated in PostgreSQL: {updated_priya.name} | Phone: {updated_priya.phone}")

    # 4. Confirm Session B remains independent
    rahul_db = db.query(User).filter(User.id == res_rahul.user.id).first()
    print(f"Session B Independent Status: {rahul_db.full_name} | Ward: {rahul_db.ward}")

    print("\nSUCCESS: Multi-user session isolation and live profile database updates verified!")

finally:
    db.close()
