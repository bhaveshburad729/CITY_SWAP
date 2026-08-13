from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Fuel Log Schemas
class FuelLogCreate(BaseModel):
    odometer: int
    liters: float
    cost: float

class FuelLogResponse(BaseModel):
    id: int
    driver_id: int
    odometer: int
    liters: float
    cost: float
    created_at: datetime

    class Config:
        from_attributes = True

class FuelLogsSummaryResponse(BaseModel):
    logs: List[FuelLogResponse]
    current_fuel_level: int
    avg_consumption: float
    total_spent: float

# Performance Schemas
class WeeklyTrendBar(BaseModel):
    day: str
    h: str
    active: bool
    value: Optional[str] = None

class Achievement(BaseModel):
    title: str
    subtitle: str
    unlocked: bool
    icon: str

class LeaderboardEntry(BaseModel):
    rank: int
    initials: str
    name: str
    points: int
    is_you: bool

class PerformanceOverviewResponse(BaseModel):
    collection_efficiency: str
    collection_efficiency_pct: str
    eco_coins_balance: int
    eco_coins_earned: str
    fuel_economy: str
    fuel_economy_pct: str
    safety_score: str
    safety_score_pct: str
    weekly_trends: List[WeeklyTrendBar]
    achievements: List[Achievement]
    leaderboard: List[LeaderboardEntry]

# Message/Chat Schemas
class MessageCreate(BaseModel):
    body: str

class MessageResponse(BaseModel):
    id: int
    sender_name: str
    sender_role: str
    recipient_id: Optional[int] = None
    body: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationThread(BaseModel):
    name: str
    lastMessage: str
    time: str
    active: bool
    role: str

class MessagesOverviewResponse(BaseModel):
    conversations: List[ConversationThread]
    messages: List[MessageResponse]
