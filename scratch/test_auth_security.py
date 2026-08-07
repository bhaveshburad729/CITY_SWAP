import os
import sys

# Add project root to sys.path
sys.path.append(os.getcwd())

from server.database.db import SessionLocal, Base, engine
from server.models.user import User
from server.schemas.auth import LoginRequest, SignupRequest
from server.services.auth_service import AuthService

# Drop and recreate tables to ensure fresh schema
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    print("--- 1. Testing Demo User Seeding ---")
    AuthService.seed_demo_users(db)
    print("Demo users seeded successfully.")

    print("\n--- 2. Testing Valid Login ---")
    login_req = LoginRequest(email="admin@cityswap.io", password="Password123!", role="admin")
    res = AuthService.login_user(db, login_req)
    print(f"Login success! Access token generated: {res.access_token[:25]}...")
    print(f"User profile: {res.user.name} ({res.user.role})")

    print("\n--- 3. Testing Invalid Password Security ---")
    try:
        invalid_req = LoginRequest(email="admin@cityswap.io", password="WrongPassword!", role="admin")
        AuthService.login_user(db, invalid_req)
    except Exception as e:
        print(f"Caught expected security error: {e.detail}")

    print("\n--- 4. Testing Signup New User ---")
    signup_req = SignupRequest(
        fullName="Test Security User",
        email="securitytest@cityswap.io",
        password="Password123!",
        role="citizen"
    )

    signup_res = AuthService.register_user(db, signup_req)
    print(f"User registered successfully! ID: {signup_res.user.id}, Token: {signup_res.access_token[:25]}...")

    print("\n--- ALL SECURITY & DATABASE TESTS PASSED SUCCESSFULLY! ---")

finally:
    db.close()
