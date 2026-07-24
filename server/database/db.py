"""
Database module for CITY_SWAP backend.
In production, connect to a database like PostgreSQL/MongoDB using SQLAlchemy/Motor.
Currently provides in-memory data store for initial setup & testing.
"""

# In-memory storage for items
items_db = [
    {
        "id": 1,
        "title": "Vintage Bicycle",
        "category": "Transportation",
        "offered_city": "New York",
        "desired_city": "London",
        "description": "Restored 1980s road bike in excellent condition.",
        "owner": "Alice",
        "status": "Available"
    },
    {
        "id": 2,
        "title": "Apartment Stay (1 Week)",
        "category": "Housing",
        "offered_city": "Tokyo",
        "desired_city": "Paris",
        "description": "Cozy 1BR in Shibuya available for home swap.",
        "owner": "Kenji",
        "status": "Available"
    },
    {
        "id": 3,
        "title": "DSLR Camera Kit",
        "category": "Electronics",
        "offered_city": "Berlin",
        "desired_city": "Barcelona",
        "description": "Canon DSLR with 18-55mm & 50mm lenses.",
        "owner": "Elena",
        "status": "Available"
    }
]

def get_db():
    """Yield database reference / session."""
    return items_db
