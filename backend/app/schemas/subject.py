from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class SubjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = "#6366f1"


class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None


class SubjectResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    color: str
    created_at: datetime

    model_config = {"from_attributes": True}
