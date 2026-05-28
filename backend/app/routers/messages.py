from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.message import Message
from app.models.user import User
from app.models.activity_log import ActivityLog
from app.schemas.message import MessageCreate, MessageResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["messages"])

@router.get("/inbox", response_model=List[MessageResponse])
def inbox(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Message)
        .filter(Message.recipient_id == current_user.id)
        .order_by(Message.created_at.desc())
        .all()
    )

@router.get("/sent", response_model=List[MessageResponse])
def sent(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Message)
        .filter(Message.sender_id == current_user.id)
        .order_by(Message.created_at.desc())
        .all()
    )

@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.get(User, payload.recipient_id):
        raise HTTPException(status_code=404, detail="Recipient not found")
    if payload.recipient_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot send a message to yourself")

    msg = Message(**payload.model_dump(), sender_id=current_user.id)
    db.add(msg)
    db.flush()
    db.add(ActivityLog(
        user_id=current_user.id,
        action="message_sent",
        details={"message_id": str(msg.id), "recipient_id": str(payload.recipient_id)},
    ))
    db.commit()
    db.refresh(msg)
    return msg

@router.patch("/{msg_id}/read", response_model=MessageResponse)
def mark_read(
    msg_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = db.query(Message).filter(
        Message.id == msg_id,
        Message.recipient_id == current_user.id,
    ).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg

@router.delete("/{msg_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    msg_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = db.query(Message).filter(
        Message.id == msg_id,
        (Message.sender_id == current_user.id) | (Message.recipient_id == current_user.id),
    ).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    db.delete(msg)
    db.commit()
