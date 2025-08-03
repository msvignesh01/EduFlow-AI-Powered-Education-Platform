from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import logging
import os

from app.database import engine, get_db
from app.models import Base, User, ContentGeneration, FileUpload
from app.schemas import (
    UserCreate, User as UserSchema, Token, ContentGenerationResponse,
    ContentGenerationCreate, APIResponse
)
from app.auth import (
    authenticate_user, create_access_token, get_current_active_user,
    get_password_hash, get_user_by_username, get_user_by_email,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.utils import parse_pdf, generate_content
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug
)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "EduLearn Platform API", "version": settings.version}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.environment}

# Authentication endpoints
@app.post("/register", response_model=UserSchema)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    logger.info(f"New user registered: {user.username}")
    return db_user

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user

# Content generation endpoints
@app.post("/upload/", response_model=ContentGenerationResponse)
async def upload_file(
    file: UploadFile = File(...),
    output_type: str = Form(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload file and generate content."""
    try:
        # Validate file type
        allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are supported"
            )

        # Read and parse file
        contents = await file.read()
        if file.content_type == "application/pdf":
            text = parse_pdf(contents)
        else:
            # For DOCX files, you'd need to implement DOCX parsing
            raise HTTPException(status_code=400, detail="DOCX parsing not implemented yet")

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")

        # Generate content
        result = generate_content(text, output_type)

        # Save to database
        file_upload = FileUpload(
            user_id=current_user.id,
            filename=file.filename,
            file_type=file.content_type,
            file_size=len(contents),
            extracted_text=text[:1000]  # Store first 1000 chars
        )
        db.add(file_upload)
        db.commit()

        content_generation = ContentGeneration(
            user_id=current_user.id,
            input_text=text[:1000],  # Store first 1000 chars
            output_type=output_type,
            generated_content=result
        )
        db.add(content_generation)
        db.commit()
        db.refresh(content_generation)

        logger.info(f"Content generated for user {current_user.username}, type: {output_type}")

        return ContentGenerationResponse(
            success=True,
            result=result,
            generation_id=content_generation.id
        )

    except Exception as e:
        logger.error(f"Error in upload_file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/", response_model=ContentGenerationResponse)
async def generate_content_endpoint(
    request: ContentGenerationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate content from text input."""
    try:
        result = generate_content(request.input_text, request.output_type)

        # Save to database
        content_generation = ContentGeneration(
            user_id=current_user.id,
            input_text=request.input_text,
            output_type=request.output_type,
            generated_content=result
        )
        db.add(content_generation)
        db.commit()
        db.refresh(content_generation)

        logger.info(f"Content generated for user {current_user.username}, type: {request.output_type}")

        return ContentGenerationResponse(
            success=True,
            result=result,
            generation_id=content_generation.id
        )

    except Exception as e:
        logger.error(f"Error in generate_content_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
