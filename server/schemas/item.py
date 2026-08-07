from pydantic import BaseModel
from typing import Optional

class ItemCreate(BaseModel):
    title: str
    category: str
    offered_city: str
    desired_city: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    owner: Optional[str] = "Anonymous"

class ItemResponse(BaseModel):
    id: int
    title: str
    category: str
    offered_city: str
    desired_city: str
    description: Optional[str] = None
    owner: str
    status: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
