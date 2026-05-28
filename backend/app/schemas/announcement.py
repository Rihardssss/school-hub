from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    is_pinned: Optional[bool] = False

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_pinned: Optional[bool] = None

class AnnouncementResponse(BaseModel):
    id: UUID
    author_id: Optional[UUID] = None
    title: str
    content: str
    is_pinned: bool
    created_at: datetime

    model_config = {"from_attributes": True}
