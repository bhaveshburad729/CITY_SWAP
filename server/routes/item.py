from fastapi import APIRouter, HTTPException, status
from typing import List
from server.schemas.item import ItemCreate, ItemResponse
from server.services.item_service import ItemService

router = APIRouter(prefix="/api/items", tags=["Items"])

@router.get("", response_model=List[ItemResponse])
def get_items():
    """Retrieve all available swap items."""
    return ItemService.get_all_items()

@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int):
    """Retrieve a single swap item by ID."""
    item = ItemService.get_item_by_id(item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )
    return item

@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(item_data: ItemCreate):
    """Create a new swap item listing."""
    return ItemService.create_item(item_data)
