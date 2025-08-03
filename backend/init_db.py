#!/usr/bin/env python3
"""
Database initialization script for EduLearn Platform
"""
from app.database import engine, SessionLocal
from app.models import Base, User
from app.auth import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    """Initialize the database with tables and optional test data."""
    logger.info("Creating database tables...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    logger.info("Database tables created successfully!")
    
    # Optionally create a test user
    db = SessionLocal()
    try:
        # Check if any users exist
        existing_user = db.query(User).first()
        if not existing_user:
            logger.info("Creating test user...")
            test_user = User(
                email="test@example.com",
                username="testuser",
                hashed_password=get_password_hash("testpassword123"),
                is_active=True
            )
            db.add(test_user)
            db.commit()
            logger.info("Test user created: username='testuser', password='testpassword123'")
        else:
            logger.info("Users already exist in database")
    except Exception as e:
        logger.error(f"Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
