from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, subjects, homework, schedule, announcements, messages, dashboard, logs

app = FastAPI(
    title="SchoolHub API",
    version="1.0.0",
    description="Student portal backend — React + FastAPI + PostgreSQL",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(subjects.router)
app.include_router(homework.router)
app.include_router(schedule.router)
app.include_router(announcements.router)
app.include_router(messages.router)
app.include_router(dashboard.router)
app.include_router(logs.router)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "app": "SchoolHub API"}
