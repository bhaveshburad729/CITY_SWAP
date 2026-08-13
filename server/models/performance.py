from sqlalchemy import Column, Integer, Float, ForeignKey, String, DateTime
from sqlalchemy.sql import func
from server.database.db import Base

class DriverPerformance(Base):
    __tablename__ = "driver_performances"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(String(50), nullable=False) # e.g. "Mon", "Tue", etc.
    efficiency = Column(Float, nullable=False) # percentage e.g. 90.0
    eco_coins_earned = Column(Integer, default=0)
    fuel_economy = Column(Float, nullable=False) # e.g. 4.1
    safety_score = Column(Integer, nullable=False) # e.g. 98
    created_at = Column(DateTime(timezone=True), server_default=func.now())
