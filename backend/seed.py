"""
Seed the database with realistic demo data.
Run inside the backend container:
  docker compose exec backend python seed.py
"""
import uuid
from datetime import date, timedelta
from app.database import SessionLocal
from app.models.user import User
from app.models.subject import Subject
from app.models.homework import Homework
from app.models.schedule import ScheduleEntry
from app.models.announcement import Announcement
from app.utils.security import hash_password

db = SessionLocal()

# ── Clear existing data ────────────────────────────────────────────────
print("Clearing existing data...")
db.query(Homework).delete()
db.query(ScheduleEntry).delete()
db.query(Announcement).delete()
db.query(Subject).delete()
db.query(User).delete()
db.commit()

# ── Users ──────────────────────────────────────────────────────────────
print("Creating users...")
admin = User(
    id=uuid.uuid4(), email="admin@schoolhub.lv", username="admin",
    password_hash=hash_password("Admin123!"),
    full_name="Administrators", role="admin",
)
anna = User(
    id=uuid.uuid4(), email="anna.berzina@schoolhub.lv", username="anna_b",
    password_hash=hash_password("Teacher123!"),
    full_name="Anna Bērziņa", role="teacher",
)
martins = User(
    id=uuid.uuid4(), email="martins.ozols@schoolhub.lv", username="martins_o",
    password_hash=hash_password("Teacher123!"),
    full_name="Mārtiņš Ozols", role="teacher",
)
students = [
    User(id=uuid.uuid4(), email="janis.kalns@schoolhub.lv",  username="janis_k",
         password_hash=hash_password("Student123!"), full_name="Jānis Kalniņš",  role="student"),
    User(id=uuid.uuid4(), email="liga.priede@schoolhub.lv",  username="liga_p",
         password_hash=hash_password("Student123!"), full_name="Līga Priede",    role="student"),
    User(id=uuid.uuid4(), email="roberts.lapa@schoolhub.lv", username="roberts_l",
         password_hash=hash_password("Student123!"), full_name="Roberts Lapa",   role="student"),
]
for u in [admin, anna, martins] + students:
    db.add(u)
db.commit()

# ── Subjects ───────────────────────────────────────────────────────────
print("Creating subjects...")
subj_data = [
    ("Matemātika",     "#6366f1"),
    ("Fizika",         "#0ea5e9"),
    ("Latviešu val.",  "#10b981"),
    ("Angļu val.",     "#f59e0b"),
    ("Vēsture",        "#ef4444"),
    ("Ķīmija",         "#8b5cf6"),
]
subjects = []
for name, color in subj_data:
    s = Subject(id=uuid.uuid4(), name=name, color=color)
    db.add(s)
    subjects.append(s)
db.commit()

mat, fiz, lv, eng, ves, kim = subjects

# ── Schedule ───────────────────────────────────────────────────────────
print("Creating schedule...")
schedule = [
    # Monday
    (mat, 1, "08:00", "08:45", "201"),
    (fiz, 1, "09:00", "09:45", "Lab 1"),
    (eng, 1, "10:00", "10:45", "115"),
    (ves, 1, "11:00", "11:45", "310"),
    # Tuesday
    (lv,  2, "08:00", "08:45", "202"),
    (kim, 2, "09:00", "09:45", "Lab 2"),
    (mat, 2, "10:00", "10:45", "201"),
    (eng, 2, "11:00", "11:45", "115"),
    # Wednesday
    (fiz, 3, "08:00", "08:45", "Lab 1"),
    (ves, 3, "09:00", "09:45", "310"),
    (lv,  3, "10:00", "10:45", "202"),
    (kim, 3, "11:00", "11:45", "Lab 2"),
    # Thursday
    (mat, 4, "08:00", "08:45", "201"),
    (eng, 4, "09:00", "09:45", "115"),
    (fiz, 4, "10:00", "10:45", "Lab 1"),
    (lv,  4, "11:00", "11:45", "202"),
    # Friday
    (ves, 5, "08:00", "08:45", "310"),
    (mat, 5, "09:00", "09:45", "201"),
    (kim, 5, "10:00", "10:45", "Lab 2"),
    (eng, 5, "11:00", "11:45", "115"),
]
for subj, day, start, end, room in schedule:
    db.add(ScheduleEntry(
        id=uuid.uuid4(), subject_id=subj.id,
        day_of_week=day, start_time=start, end_time=end, room=room,
    ))
db.commit()

# ── Homework ───────────────────────────────────────────────────────────
print("Creating homework...")
today = date.today()
hw_templates = [
    (mat, "Atrisināt 5.nodaļas uzdevumus (1–15)",       today + timedelta(days=2),  "pending"),
    (fiz, "Laboratorijas darba atskaite",                today + timedelta(days=4),  "submitted"),
    (eng, "Izlasīt un tulkot tekstu par vidi",          today + timedelta(days=1),  "pending"),
    (ves, "Referāts par Latvijas neatkarību",            today + timedelta(days=7),  "pending"),
    (kim, "Uzdevumi par ķīmiskajām reakcijām (lpp. 42)", today - timedelta(days=1),  "done"),
    (lv,  "Diktāts — gatavošanās",                      today + timedelta(days=3),  "pending"),
    (mat, "Kontroldarba sagatavošana",                  today + timedelta(days=5),  "pending"),
    (eng, "Prezentācija par dzimto pilsētu",            today + timedelta(days=10), "pending"),
]
for student in students:
    for subj, title, due, status in hw_templates:
        db.add(Homework(
            id=uuid.uuid4(), subject_id=subj.id,
            assigned_to=student.id, title=title,
            due_date=due, status=status,
        ))
db.commit()

# ── Announcements ──────────────────────────────────────────────────────
print("Creating announcements...")
announcements = [
    (admin, "Laipni lūdzam SchoolHub!",
     "Šī ir mūsu skolas jaunā digitālā platforma. Šeit atradīsiet stundu sarakstu, mājasdarbos un paziņojumus.",
     True),
    (anna, "Matemātikas kontroldarbs",
     "Atgādinām, ka nākamnedēļ ceturtdienā notiks matemātikas kontroldarbs par 5. un 6. nodaļu. Lūdzu sagatavojieties!",
     True),
    (martins, "Fizika — laboratorijas drošība",
     "Pirms laboratorijas darba obligāti jāiepazīstas ar drošības instrukciju. Instrukcija pieejama klases stendā.",
     False),
    (anna, "Angļu valodas konkurss",
     "Aprīlī notiks skolēnu angļu valodas konkurss. Pieteikties var līdz piektdienai pie skolotājas Bērziņas.",
     False),
    (admin, "Brīvdienas",
     "Atgādinām, ka nākamnedēļ pirmdien ir brīvdiena. Mācības atsāksies otrdien kā ierasts.",
     False),
]
for author, title, content, pinned in announcements:
    db.add(Announcement(
        id=uuid.uuid4(), author_id=author.id,
        title=title, content=content, is_pinned=pinned,
    ))
db.commit()

db.close()
print("\n✅ Seed complete!")
print("\nDemo accounts:")
print("  admin@schoolhub.lv      / Admin123!    (admin)")
print("  anna.berzina@schoolhub.lv / Teacher123! (teacher)")
print("  martins.ozols@schoolhub.lv/ Teacher123! (teacher)")
print("  janis.kalns@schoolhub.lv  / Student123! (student)")
print("  liga.priede@schoolhub.lv  / Student123! (student)")
print("  roberts.lapa@schoolhub.lv / Student123! (student)")
