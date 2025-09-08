from bson import ObjectId
from fastapi import APIRouter, HTTPException
import pymongo

from ..database import task_db
from ..models.task import Task
from ._util import clean_oid

router = APIRouter(prefix="/task", tags=["task"])


# Get all tasks
@router.get("")
async def get_all_tasks() -> list[dict]:
    all_tasks = task_db.find().sort(
        [("due_date", pymongo.ASCENDING), ("name", pymongo.ASCENDING)]
    )
    return [clean_oid(task) for task in all_tasks]


# Create a new task
@router.post("")
async def create_new_task(task: Task):
    task_new = task_db.insert_one(dict(task))
    obj = task_db.find_one({"_id": task_new.inserted_id})
    return clean_oid(obj)


# Update existing task
@router.put("/{id}")
async def update_existing_task(id, task: Task):
    task_updated = task_db.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": dict(task)},
        return_document=pymongo.ReturnDocument.AFTER,
    )
    if task_updated:
        return clean_oid(task_updated)
    raise HTTPException(status_code=400, detail="Unable to update task")


# Delete task
@router.delete("/{id}")
async def delete_task(id):
    delete_task = task_db.find_one_and_delete({"_id": ObjectId(id)})
    if delete_task:
        return f"Task ID: {id} deleted successfully."
    raise HTTPException(status_code=400, detail="Unable to delete task")
