from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class MessageCreate(BaseModel):
    recipient_id: UUID
    subject: str
    body: str

class MessageResponse(BaseModel):
    id: UUID
    sender_id: UUID
    recipient_id: UUID
    subject: str
    body: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
