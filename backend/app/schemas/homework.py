from pydantic import BaseModel
from datetime import date, datetime
from uuid import UUID
from typing import Optional, Literal


class HomeworkCreate(BaseModel):
    subject_id: UUID
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None


class HomeworkUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[Literal["pending", "submitted", "done"]] = None


class HomeworkResponse(BaseModel):
    id: UUID
    subject_id: UUID
    assigned_to: UUID
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
