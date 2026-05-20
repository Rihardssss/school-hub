from pydantic import BaseModel, field_validator
from datetime import time, datetime
from uuid import UUID
from typing import Optional


class ScheduleCreate(BaseModel):
    subject_id: UUID
    day_of_week: int
    start_time: time
    end_time: time
    room: Optional[str] = None

    @field_validator("day_of_week")
    @classmethod
    def validate_day(cls, v: int) -> int:
        if v < 1 or v > 7:
            raise ValueError("day_of_week must be between 1 (Mon) and 7 (Sun)")
        return v


class ScheduleUpdate(BaseModel):
    subject_id: Optional[UUID] = None
    day_of_week: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    room: Optional[str] = None


class ScheduleResponse(BaseModel):
    id: UUID
    subject_id: UUID
    day_of_week: int
    start_time: time
    end_time: time
    room: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
