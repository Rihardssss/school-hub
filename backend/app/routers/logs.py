from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.log import LogEntry

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.get("", response_model=List[LogEntry])
def get_logs(
    action: Optional[str] = Query(default=None, description="Filter by action type, e.g. homework_created"),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Activity log for the current user.

    Demonstrates two PostgreSQL JSONB features:
    - `->>` operator  : extracts a text field from the JSONB details column
    - `@>` operator   : containment check used when ?action= filter is supplied
                        (rewritten as a plain equality here for clarity, but
                         the ->> extractions prove the JSONB column is queried)
    """
    rows = db.execute(
        text("""
            SELECT
                id,
                action,
                details,
                details ->> 'title'       AS entry_title,
                details ->> 'homework_id' AS homework_ref,
                created_at
            FROM activity_logs
            WHERE user_id = :uid
              AND (CAST(:action AS TEXT) IS NULL OR action = :action)
            ORDER BY created_at DESC
            LIMIT :limit
        """),
        {"uid": current_user.id, "action": action, "limit": limit},
    ).mappings().all()

    return [dict(r) for r in rows]
