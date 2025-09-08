from datetime import datetime, timezone

import pymongo

from .env import settings

# Connect to Database

client: pymongo.MongoClient = pymongo.MongoClient(settings.DB_HOST)

### Optionally, clean DB on reload for testing
# client.drop_database("whattodo")

database = client["whattodo"]

# Database Collections
task_db = database["task"]
# user_db = database["user"]


### Optionally, insert dummy tasks for testing
def _insert_dummy_task():
    task_db.insert_many(
        [
            {
                "name": "TASK 1",
                "due_date": datetime(2025, 9, 6, tzinfo=timezone.utc),
                "complete": False,
            },
            {
                "name": "TASK 2",
                "due_date": datetime(2025, 9, 10, tzinfo=timezone.utc),
                "complete": False,
            },
            {
                "name": "TASK 3",
                "due_date": datetime(2025, 9, 6, tzinfo=timezone.utc),
                "complete": True,
            },
            {
                "name": "TASK 4",
                "due_date": datetime(2025, 9, 10, tzinfo=timezone.utc),
                "complete": True,
            },
        ]
    )


# _insert_dummy_task()
