import os

### env settings, currently only used for db hostname/port
class environment:
    DEFAULT_DB_NAME: str = "database"
    DB_NAME: str = os.getenv("MONGODB_NAME", DEFAULT_DB_NAME)
    DEFAULT_DB_PORT: int = 27017
    DB_PORT: int = int(os.getenv("MONGODB_PORT", DEFAULT_DB_PORT))
    DB_HOST: str = os.getenv("MONGODB_URL", f"mongodb://{DB_NAME}:{DB_PORT}")


settings = environment()
