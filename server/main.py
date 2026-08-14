import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from server.database.db import engine, Base, SessionLocal
import server.models  # Import all SQLAlchemy models to register them with Base.metadata
from server.routes import health, item, auth, complaint, driver, admin, uploads
from server.services.auth_service import AuthService
from server.utils.config import config

# Create database tables automatically if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=config.PROJECT_NAME,
    version=config.VERSION,
    description="Backend API for EcoPulse AI / CITY_SWAP - Full Stack Platform"
)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        AuthService.seed_demo_users(db)
    finally:
        db.close()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded media files statically
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Register modular routes
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(complaint.router)
app.include_router(driver.router)
app.include_router(admin.router)
app.include_router(item.router)
app.include_router(uploads.router)

@app.get("/")
def root():
    return {
        "message": f"Welcome to {config.PROJECT_NAME}",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="127.0.0.1", port=config.PORT, reload=True)
