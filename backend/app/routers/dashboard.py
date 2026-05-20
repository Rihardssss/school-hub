from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    All counts computed in a single raw SQL query — no ORM.
    Uses correlated subqueries so the DB resolves everything in one round-trip.
    """
    today_dow = date.today().isoweekday()  # 1 = Monday … 7 = Sunday

    row = db.execute(
        text("""
            SELECT
                (SELECT COUNT(*)::int FROM homework
                 WHERE assigned_to = :uid)                              AS homework_total,

                (SELECT COUNT(*)::int FROM homework
                 WHERE assigned_to = :uid
                   AND status = 'pending')                              AS homework_pending,

                (SELECT COUNT(*)::int FROM homework
                 WHERE assigned_to = :uid
                   AND status = 'done')                                 AS homework_done,

                (SELECT COUNT(*)::int FROM homework
                 WHERE assigned_to = :uid
                   AND due_date = CURRENT_DATE)                         AS homework_due_today,

                (SELECT COUNT(*)::int FROM messages
                 WHERE recipient_id = :uid
                   AND is_read = false)                                 AS unread_messages,

                (SELECT COUNT(*)::int FROM schedule_entries
                 WHERE day_of_week = :today_dow)                        AS todays_lessons,

                (SELECT COUNT(*)::int FROM subjects)                    AS subjects_total
        """),
        {"uid": current_user.id, "today_dow": today_dow},
    ).mappings().one()

    return dict(row)
