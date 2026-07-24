from server.database.db import items_db
from server.schemas.item import ItemCreate

class ItemService:
    @staticmethod
    def get_all_items():
        return items_db

    @staticmethod
    def get_item_by_id(item_id: int):
        for item in items_db:
            if item["id"] == item_id:
                return item
        return None

    @staticmethod
    def create_item(item_data: ItemCreate):
        new_id = max([item["id"] for item in items_db], default=0) + 1
        new_item = {
            "id": new_id,
            **item_data.model_dump(),
            "status": "Available"
        }
        items_db.append(new_item)
        return new_item
