from datetime import date, datetime, time, timezone

from pydantic import BaseModel


class Task(BaseModel):
    name: str
    due_date: datetime = datetime.combine(date.today(), time.min, timezone.utc)
    complete: bool = False
