from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.subject import Subject
from app.models.activity_log import ActivityLog
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse
from app.utils.auth import get_current_user, require_roles
from app.models.user import User

router = APIRouter(prefix="/api/subjects", tags=["subjects"])

@router.get("", response_model=List[SubjectResponse])
def list_subjects(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(Subject).order_by(Subject.name).all()

@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(
    payload: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["teacher", "admin"])),
):
    subject = Subject(**payload.model_dump())
    db.add(subject)
    db.flush()
    db.add(ActivityLog(
        user_id=current_user.id,
        action="subject_created",
        details={"subject_id": str(subject.id), "name": subject.name},
    ))
    db.commit()
    db.refresh(subject)
    return subject

@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: UUID,
    payload: SubjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["teacher", "admin"])),
):
    subject = db.get(Subject, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(subject, field, value)

    db.add(ActivityLog(
        user_id=current_user.id,
        action="subject_updated",
        details={"subject_id": str(subject_id), "changes": payload.model_dump(exclude_none=True)},
    ))
    db.commit()
    db.refresh(subject)
    return subject

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["teacher", "admin"])),
):
    subject = db.get(Subject, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.add(ActivityLog(
        user_id=current_user.id,
        action="subject_deleted",
        details={"subject_id": str(subject_id), "name": subject.name},
    ))
    db.delete(subject)
    db.commit()
