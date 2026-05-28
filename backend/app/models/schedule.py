import uuid
from sqlalchemy import Column, String, DateTime, Time, SmallInteger, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class ScheduleEntry(Base):
    __tablename__ = "schedule_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(SmallInteger, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    room = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
