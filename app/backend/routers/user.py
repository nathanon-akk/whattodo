### Unused, todo for jwt/user

import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

import jwt
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel, field_validator

# from ..database import user_db
from ..models.user import User

router = APIRouter(prefix="/user", tags=["user"])
JWT_SECRET = secrets.token_hex(16)
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15


class SignUpSchema(BaseModel):
    username: str
    email: str
    password: str

    @field_validator("password", mode="after")
    @classmethod
    def validate_password(cld, pwd: str) -> str:
        if len(pwd) < 6:
            raise ValueError("password is too short")
        return pwd


class SignInSchema(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/signin")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str):
    user = user_db.find_one({"username": username})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("_id")
        if user_id is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = user_db.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user


@router.post("/signin")
async def sign_in(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    print("/signin route")
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"_id": str(user["_id"])}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


# Sign up
@router.post("/signup")
async def sign_up(schema: SignUpSchema):
    email_existed = user_db.find_one({"email": schema.email})
    if email_existed is not None:
        raise HTTPException(status_code=400, detail="Email already registered")

    username_existed = user_db.find_one({"username": schema.username})
    if username_existed is not None:
        raise HTTPException(status_code=400, detail="Username already in used")

    schema.password = get_password_hash(schema.password)
    user_new = user_db.insert_one(dict(schema))

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"_id": str(user_new.inserted_id)}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me")
async def me(
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return dict(current_user, _id=str(current_user["_id"]))
