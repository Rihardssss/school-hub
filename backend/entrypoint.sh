#!/bin/sh
set -e

# Guard against stale alembic_version stamp (e.g. if tables were dropped externally).
# If the users table is missing, reset the stamp so upgrade re-creates everything.
python -c "
import sqlalchemy as sa, subprocess
from app.config import settings
engine = sa.create_engine(settings.database_url)
with engine.connect() as conn:
    exists = conn.execute(sa.text(
        \"SELECT EXISTS (SELECT FROM information_schema.tables \"
        \"WHERE table_schema='public' AND table_name='users')\"
    )).scalar()
if not exists:
    print('Tables missing — resetting alembic stamp before upgrade.')
    subprocess.run(['alembic', 'stamp', 'base'], check=True)
"

alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
