from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schedule import ScheduleEntry
from app.models.subject import Subject
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate, ScheduleResponse
from app.utils.auth import get_current_user, require_roles
from app.models.user import User

router = APIRouter(prefix="/api/schedule", tags=["schedule"])

@router.get("", response_model=List[ScheduleResponse])
def list_schedule(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return (
        db.query(ScheduleEntry)
        .order_by(ScheduleEntry.day_of_week, ScheduleEntry.start_time)
        .all()
    )

@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_entry(
    payload: ScheduleCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(["teacher", "admin"])),
):
    if not db.get(Subject, payload.subject_id):
        raise HTTPException(status_code=404, detail="Subject not found")

    entry = ScheduleEntry(**payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.put("/{entry_id}", response_model=ScheduleResponse)
def update_entry(
    entry_id: UUID,
    payload: ScheduleUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(["teacher", "admin"])),
):
    entry = db.get(ScheduleEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")

    if payload.subject_id and not db.get(Subject, payload.subject_id):
        raise HTTPException(status_code=404, detail="Subject not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(["teacher", "admin"])),
):
    entry = db.get(ScheduleEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")

    db.delete(entry)
    db.commit()
