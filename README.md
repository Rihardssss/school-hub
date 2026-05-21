# SchoolHub 🎓

A school management portal for students, teachers, and administrators.
Live at **[riciboy.eu](https://riciboy.eu)**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router |
| Backend | FastAPI (Python 3.11) |
| Database | PostgreSQL 15 |
| Auth | JWT (Bearer tokens) |
| Reverse proxy | nginx |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 (Amazon Linux) |
| Tunnel / SSL | Cloudflare Tunnel |

---

## Features

- **Authentication** — register, login, JWT-protected routes
- **Role-based access** — student / teacher / admin with per-endpoint enforcement
- **Dashboard** — live stats (homework counts, unread messages, today's lessons)
- **Homework** — create, update status (pending / submitted / done), filter by subject
- **Schedule** — weekly timetable by subject, day, time, and room
- **Announcements** — pin/unpin, teacher/admin can post and delete
- **Messages** — inbox with unread indicator, compose and reply
- **Profile** — view and edit own account details
- **User management** — admin-only: change roles, delete accounts

---

## Local Development

### Prerequisites

- Docker Desktop
- Git

### 1. Clone

```bash
git clone https://github.com/Rihardssss/school-hub.git
cd school-hub
```

### 2. Create `.env`

```bash
cp .env.example .env
```

### 3. Start the stack

```bash
docker compose up -d --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

### 4. Seed demo data (optional)

```bash
docker compose exec backend python seed.py
```

### 5. Stop

```bash
docker compose down
```

---

## Demo Accounts

| Email | Password | Role |
|---|---|---|
| admin@schoolhub.lv | Admin123! | admin |
| anna.berzina@schoolhub.lv | Teacher123! | teacher |
| martins.ozols@schoolhub.lv | Teacher123! | teacher |
| janis.kalns@schoolhub.lv | Student123! | student |
| liga.priede@schoolhub.lv | Student123! | student |
| roberts.lapa@schoolhub.lv | Student123! | student |

---

## API Overview

All endpoints are prefixed with `/api/`. Full interactive docs at `/docs`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Get JWT token |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/dashboard/stats` | ✅ | Dashboard stats |
| GET/POST | `/api/subjects` | ✅ | List / create subjects (teacher+) |
| PUT/DELETE | `/api/subjects/{id}` | ✅ | Update / delete (teacher+) |
| GET/POST | `/api/homework` | ✅ | List / create homework (teacher+) |
| PATCH | `/api/homework/{id}` | ✅ | Update status |
| GET/POST | `/api/schedule` | ✅ | List / add schedule entries (teacher+) |
| DELETE | `/api/schedule/{id}` | ✅ | Delete entry (teacher+) |
| GET/POST | `/api/announcements` | ✅ | List / post (teacher+) |
| DELETE | `/api/announcements/{id}` | ✅ | Delete (teacher+ own, admin any) |
| GET/POST | `/api/messages` | ✅ | Inbox / compose |
| GET | `/api/users` | ✅ | List all users (admin) |
| PATCH | `/api/users/{id}/role` | ✅ | Change role (admin) |
| DELETE | `/api/users/{id}` | ✅ | Delete user (admin) |

---

## Running Tests

Tests require a running PostgreSQL instance. Use Docker:

```bash
docker compose up -d --build
docker compose exec backend python -m pytest tests/ -v
```

---

## CI/CD Pipeline

Defined in `.github/workflows/schoolhub-pipeline.yml`.

**On every push to `main`:**

1. **CI** — spins up a postgres service container, runs alembic migrations, runs pytest
2. **CD** — SSHs into EC2, pulls latest code, rebuilds and restarts Docker containers

### Required GitHub Secrets

| Secret | Value |
|---|---|
| `EC2_HOST` | EC2 public IP (update after every restart without Elastic IP) |
| `EC2_USER` | `ec2-user` |
| `EC2_SSH_KEY` | Contents of `school-hub.pem` |
| `GH_TOKEN` | GitHub PAT with repo read access (for git pull on EC2) |

---

## Deployment (EC2)

The app runs on an AWS EC2 instance (Amazon Linux) behind a Cloudflare Tunnel.

### Architecture

```
Browser → riciboy.eu (Cloudflare)
       → Cloudflare Tunnel (cloudflared on EC2)
       → nginx container (port 5173)
       → /api/* → FastAPI container (port 8000)
       → PostgreSQL container (port 5432)
```

### Manual deploy

```bash
ssh -i "school-hub.pem" ec2-user@<EC2_IP>
cd school-hub
git pull
docker compose up -d --build
```

### Seed production data

```bash
ssh -i "school-hub.pem" ec2-user@<EC2_IP>
cd school-hub
docker compose exec backend python seed.py
```

### Cloudflare Tunnel

The tunnel connects `riciboy.eu` to the EC2 instance without opening ports 80/443.
Runs as a systemd service that restarts automatically on reboot:

```bash
sudo systemctl status cloudflared
```

---

## Project Structure

```
school-hub/
├── src/                        # React frontend
│   ├── components/             # Layout, ProtectedRoute
│   ├── context/                # AuthContext
│   ├── pages/                  # Dashboard, Homework, Schedule, ...
│   └── services/               # Axios API client
├── backend/
│   ├── app/
│   │   ├── models/             # SQLAlchemy models
│   │   ├── routers/            # FastAPI routers
│   │   ├── utils/              # auth helpers, security
│   │   └── main.py
│   ├── alembic/                # DB migrations
│   ├── tests/                  # pytest test suite
│   ├── seed.py                 # Demo data seeder
│   └── entrypoint.sh           # Auto-migration on startup
├── nginx.conf                  # Reverse proxy config
├── Dockerfile                  # Frontend (multi-stage nginx build)
├── backend/Dockerfile          # Backend
├── docker-compose.yml
└── .github/workflows/
    └── schoolhub-pipeline.yml  # CI/CD
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
POSTGRES_USER=schoolhub
POSTGRES_PASSWORD=your_password
POSTGRES_DB=schoolhub
DATABASE_URL=postgresql://schoolhub:your_password@db:5432/schoolhub
SECRET_KEY=your_jwt_secret_key
```

> Avoid `$`, `#`, `!`, `%` in passwords — Docker Compose interpolates shell special characters.
