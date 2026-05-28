from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Any, Optional

class LogEntry(BaseModel):
    id: UUID
    action: str
    details: Any
    entry_title: Optional[str] = None
    homework_ref: Optional[str] = None
    created_at: datetime
