from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import task

# from .routers import user

### init app
app = FastAPI()

# For frontend access
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(task.router)
# app.include_router(user.router)
