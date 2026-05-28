from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://artelli:artelli123@localhost:5432/artelli_db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    WHATSAPP_NUMBER: str = "5511992216409"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
