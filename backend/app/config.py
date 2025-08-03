from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Configuration
    app_name: str = "EduLearn Platform API"
    version: str = "1.0.0"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite:///./app.db"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # External APIs
    gemini_api_key: str = ""
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Environment
    environment: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# Validate required settings
if not settings.gemini_api_key and settings.environment == "production":
    raise ValueError("GEMINI_API_KEY is required in production environment")

if settings.secret_key == "your-secret-key-change-in-production" and settings.environment == "production":
    raise ValueError("SECRET_KEY must be changed in production environment")
