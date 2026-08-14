import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables explicitly from server/.env and root .env
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
server_env = os.path.join(base_dir, ".env")
root_env = os.path.join(os.path.dirname(base_dir), ".env")

if os.path.exists(server_env):
    load_dotenv(server_env)
if os.path.exists(root_env):
    load_dotenv(root_env)
load_dotenv()

# Read DATABASE_URL from environment
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./ecopulse.db"

# Normalize PostgreSQL URL for psycopg2 driver
if SQLALCHEMY_DATABASE_URL.startswith("postgresql+psycopg://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql+psycopg://", "postgresql+psycopg2://")
elif SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://")

connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True
    )
    print(f"PostgreSQL Database Connection Initialized: {SQLALCHEMY_DATABASE_URL.split('@')[-1] if '@' in SQLALCHEMY_DATABASE_URL else SQLALCHEMY_DATABASE_URL}")
except Exception as e:
    print(f"Warning: Failed to connect to primary database URL ({e}). Falling back to SQLite...")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./ecopulse.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency that provides a database session to FastAPI routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
