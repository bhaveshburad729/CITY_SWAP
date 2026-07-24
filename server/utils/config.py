import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "CITY_SWAP API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    ENV: str = os.getenv("ENV", "development")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]

config = Config()
