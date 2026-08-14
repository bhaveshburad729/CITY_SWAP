import os
import sys

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server.database.db import engine, Base, SessionLocal
import server.models
from server.services.auth_service import AuthService

def initialize_database():
    print("Connecting to database and creating tables...", flush=True)
    print(f"Target Database: {engine.url.render_as_string(hide_password=True)}", flush=True)
    
    # Create all tables in PostgreSQL
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!", flush=True)

    # Seed demo users
    db = SessionLocal()
    try:
        AuthService.seed_demo_users(db)
        print("Demo users seeded successfully!", flush=True)
    except Exception as e:
        print(f"Error seeding demo users: {e}", flush=True)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    initialize_database()
