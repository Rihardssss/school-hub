from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.homework import Homework
from app.models.subject import Subject
from app.models.activity_log import ActivityLog
from app.schemas.homework import HomeworkCreate, HomeworkUpdate, HomeworkResponse
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/homework", tags=["homework"])


@router.get("", response_model=List[HomeworkResponse])
def list_homework(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Homework)
        .filter(Homework.assigned_to == current_user.id)
        .order_by(Homework.due_date.asc().nullslast(), Homework.created_at.desc())
        .all()
    )


@router.post("", response_model=HomeworkResponse, status_code=status.HTTP_201_CREATED)
def create_homework(
    payload: HomeworkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.get(Subject, payload.subject_id):
        raise HTTPException(status_code=404, detail="Subject not found")

    hw = Homework(**payload.model_dump(), assigned_to=current_user.id)
    db.add(hw)
    db.flush()
    db.add(ActivityLog(
        user_id=current_user.id,
        action="homework_created",
        details={"homework_id": str(hw.id), "title": hw.title},
    ))
    db.commit()
    db.refresh(hw)
    return hw


@router.get("/{hw_id}", response_model=HomeworkResponse)
def get_homework(
    hw_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hw = (
        db.query(Homework)
        .filter(Homework.id == hw_id, Homework.assigned_to == current_user.id)
        .first()
    )
    if not hw:
        raise HTTPException(status_code=404, detail="Homework not found")
    return hw


@router.put("/{hw_id}", response_model=HomeworkResponse)
def update_homework(
    hw_id: UUID,
    payload: HomeworkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hw = (
        db.query(Homework)
        .filter(Homework.id == hw_id, Homework.assigned_to == current_user.id)
        .first()
    )
    if not hw:
        raise HTTPException(status_code=404, detail="Homework not found")

    changes = payload.model_dump(exclude_none=True)
    for field, value in changes.items():
        setattr(hw, field, value)

    db.add(ActivityLog(
        user_id=current_user.id,
        action="homework_updated",
        details={"homework_id": str(hw_id), "changes": {k: str(v) for k, v in changes.items()}},
    ))
    db.commit()
    db.refresh(hw)
    return hw


@router.delete("/{hw_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_homework(
    hw_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hw = (
        db.query(Homework)
        .filter(Homework.id == hw_id, Homework.assigned_to == current_user.id)
        .first()
    )
    if not hw:
        raise HTTPException(status_code=404, detail="Homework not found")

    db.add(ActivityLog(
        user_id=current_user.id,
        action="homework_deleted",
        details={"homework_id": str(hw_id), "title": hw.title},
    ))
    db.delete(hw)
    db.commit()
