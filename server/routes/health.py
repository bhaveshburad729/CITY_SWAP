from fastapi import APIRouter
import time

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CITY_SWAP Backend",
        "timestamp": time.time()
    }
