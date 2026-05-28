from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
from typing import Optional

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None
