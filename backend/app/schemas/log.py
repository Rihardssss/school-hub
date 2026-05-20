from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Any, Optional


class LogEntry(BaseModel):
    id: UUID
    action: str
    details: Any          # PostgreSQL JSONB → Python dict
    entry_title: Optional[str] = None   # extracted via details ->> 'title'
    homework_ref: Optional[str] = None  # extracted via details ->> 'homework_id'
    created_at: datetime
