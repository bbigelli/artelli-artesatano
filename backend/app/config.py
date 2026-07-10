from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@localhost:5432/artelli_db"
    SECRET_KEY: str = "artelli-dev-secret-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    WHATSAPP_NUMBER: str = "5511999999999"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
