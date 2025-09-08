from typing import Any


def clean_oid(obj: Any) -> dict:
    return dict(obj, _id=str(obj["_id"]))
