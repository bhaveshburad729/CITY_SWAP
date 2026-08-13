from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from server.database.db import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True) # None for dispatcher/system
    sender_name = Column(String(100), nullable=False)
    sender_role = Column(String(50), nullable=False) # "Dispatcher", "Driver", "System"
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True) # target driver
    body = Column(String(500), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
