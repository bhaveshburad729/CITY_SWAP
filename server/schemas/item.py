from pydantic import BaseModel, Field
from typing import Optional

class ItemBase(BaseModel):
    title: str = Field(..., example="Vintage Bicycle")
    category: str = Field(..., example="Transportation")
    offered_city: str = Field(..., example="New York")
    desired_city: str = Field(..., example="London")
    description: str = Field(..., example="Restored 1980s road bike.")
    owner: str = Field(..., example="Alice")

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    status: str = "Available"

    class Config:
        from_attributes = True
