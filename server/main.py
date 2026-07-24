from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.utils.config import config
from server.routes import health, item

app = FastAPI(
    title=config.PROJECT_NAME,
    version=config.VERSION,
    description="Backend API for CITY_SWAP - Full Stack Platform"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routes
app.include_router(health.router)
app.include_router(item.router)

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
