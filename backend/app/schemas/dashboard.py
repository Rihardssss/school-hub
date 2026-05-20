from pydantic import BaseModel


class DashboardStats(BaseModel):
    homework_total: int
    homework_pending: int
    homework_done: int
    homework_due_today: int
    unread_messages: int
    todays_lessons: int
    subjects_total: int
