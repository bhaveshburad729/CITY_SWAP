from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from server.database.db import Base


class Notification(Base):
    """System notification / broadcast model for admin alerts."""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(20), default="Info")   # Critical, Warning, Info
    audience = Column(String(100), default="All")            # All Drivers, All Citizens, etc.
    priority = Column(String(50), default="Standard")        # Standard, High, Emergency
    icon = Column(String(50), default="notifications")       # Material icon name
    is_broadcast = Column(Boolean, default=False)            # True = admin broadcast
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # None = all
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
