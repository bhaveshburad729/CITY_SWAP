from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from server.database.db import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner_name = Column(String(100), default="Anonymous")
    title = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    offered_city = Column(String(100), nullable=False)
    desired_city = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    status = Column(String(20), default="Available") # Available, Pending, Swapped
    created_at = Column(DateTime(timezone=True), server_default=func.now())
