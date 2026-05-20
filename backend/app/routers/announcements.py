from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.announcement import Announcement
from app.models.activity_log import ActivityLog
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/announcements", tags=["announcements"])


@router.get("", response_model=List[AnnouncementResponse])
def list_announcements(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    # Pinned announcements first, then newest
    return (
        db.query(Announcement)
        .order_by(Announcement.is_pinned.desc(), Announcement.created_at.desc())
        .all()
    )


@router.post("", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    payload: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    announcement = Announcement(**payload.model_dump(), author_id=current_user.id)
    db.add(announcement)
    db.flush()
    db.add(ActivityLog(
        user_id=current_user.id,
        action="announcement_created",
        details={"announcement_id": str(announcement.id), "title": announcement.title},
    ))
    db.commit()
    db.refresh(announcement)
    return announcement


@router.put("/{ann_id}", response_model=AnnouncementResponse)
def update_announcement(
    ann_id: UUID,
    payload: AnnouncementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ann = db.get(Announcement, ann_id)
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    if ann.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to edit this announcement")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(ann, field, value)

    db.commit()
    db.refresh(ann)
    return ann


@router.delete("/{ann_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    ann_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ann = db.get(Announcement, ann_id)
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    if ann.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this announcement")

    db.delete(ann)
    db.commit()
