from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Content Generation schemas
class ContentGenerationBase(BaseModel):
    input_text: str
    output_type: str

class ContentGenerationCreate(ContentGenerationBase):
    pass

class ContentGeneration(ContentGenerationBase):
    id: int
    user_id: int
    generated_content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Study Session schemas
class StudySessionBase(BaseModel):
    session_name: str
    content: Optional[str] = None
    duration_minutes: Optional[int] = None

class StudySessionCreate(StudySessionBase):
    pass

class StudySession(StudySessionBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# File Upload schemas
class FileUploadBase(BaseModel):
    filename: str
    file_type: str
    file_size: Optional[int] = None

class FileUpload(FileUploadBase):
    id: int
    user_id: Optional[int] = None
    extracted_text: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# API Response schemas
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class ContentGenerationResponse(BaseModel):
    success: bool
    result: str
    generation_id: Optional[int] = None
