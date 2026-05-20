"""
Tests run against a real PostgreSQL instance (JSONB / UUID require it).
Set DATABASE_URL in your environment to point at the database, e.g.:
  export DATABASE_URL=postgresql://schoolhub:changeme@localhost:5433/schoolhub
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://schoolhub:changeme@localhost:5433/schoolhub",
)

engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def create_tables():
    Base.metadata.create_all(bind=engine)
    yield
    # Do NOT drop tables — the live app shares this database.


@pytest.fixture(autouse=True)
def clean_tables():
    # Wipe before each test so leftover data from prior runs doesn't interfere
    with engine.connect() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())
        conn.commit()
    yield


@pytest.fixture
def client():
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ------------------------------------------------------------------
# Shared helpers
# ------------------------------------------------------------------

USER_A = {
    "email": "alice@test.com",
    "username": "alice",
    "password": "pass1234",
    "full_name": "Alice",
}

USER_B = {
    "email": "bob@test.com",
    "username": "bob",
    "password": "pass1234",
    "full_name": "Bob",
}


def register_and_login(client, user: dict) -> str:
    client.post("/api/auth/register", json=user)
    r = client.post("/api/auth/login", json={
        "email": user["email"],
        "password": user["password"],
    })
    return r.json()["access_token"]


@pytest.fixture
def token_a(client) -> str:
    return register_and_login(client, USER_A)


@pytest.fixture
def token_b(client) -> str:
    return register_and_login(client, USER_B)


@pytest.fixture
def auth_a(token_a) -> dict:
    return {"Authorization": f"Bearer {token_a}"}


@pytest.fixture
def auth_b(token_b) -> dict:
    return {"Authorization": f"Bearer {token_b}"}
