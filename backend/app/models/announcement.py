import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    content = Column(String, nullable=False)
    is_pinned = Column(Boolean, nullable=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
