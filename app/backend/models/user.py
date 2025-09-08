### Unused, todo for jwt/user


from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str
    password: str
