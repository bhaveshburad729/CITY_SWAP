class ItemModel:
    def __init__(self, id: int, title: str, category: str, offered_city: str, desired_city: str, description: str, owner: str, status: str = "Available"):
        self.id = id
        self.title = title
        self.category = category
        self.offered_city = offered_city
        self.desired_city = desired_city
        self.description = description
        self.owner = owner
        self.status = status

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "offered_city": self.offered_city,
            "desired_city": self.desired_city,
            "description": self.description,
            "owner": self.owner,
            "status": self.status
        }
