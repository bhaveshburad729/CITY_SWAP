from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from server.database.db import Base


class SmartBin(Base):
    """Smart bin telemetry model — stores bin inventory + sensor readings."""
    __tablename__ = "smart_bins"

    id = Column(Integer, primary_key=True, index=True)
    bin_code = Column(String(20), unique=True, index=True, nullable=False)  # e.g. BIN-122
    location_name = Column(String(200), nullable=False)                      # e.g. "Green Park, Sector 4"
    ward = Column(String(50), nullable=False, default="Ward 12")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    bin_type = Column(String(30), default="General Waste")                  # General Waste, Recyclable, Organic, E-Waste
    capacity_liters = Column(Integer, default=240)
    fill_level_pct = Column(Integer, default=0)                              # 0-100
    is_active = Column(Boolean, default=True)
    last_collected_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
