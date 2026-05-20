REGISTER_PAYLOAD = {
    "email": "test@example.com",
    "username": "testuser",
    "password": "secret123",
    "full_name": "Test User",
}


def test_register_success(client):
    r = client.post("/api/auth/register", json=REGISTER_PAYLOAD)
    assert r.status_code == 201
    body = r.json()
    assert body["email"] == "test@example.com"
    assert body["username"] == "testuser"
    assert "password_hash" not in body


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json=REGISTER_PAYLOAD)
    duplicate = {**REGISTER_PAYLOAD, "username": "other"}
    r = client.post("/api/auth/register", json=duplicate)
    assert r.status_code == 400
    assert "Email" in r.json()["detail"]


def test_register_duplicate_username(client):
    client.post("/api/auth/register", json=REGISTER_PAYLOAD)
    duplicate = {**REGISTER_PAYLOAD, "email": "other@example.com"}
    r = client.post("/api/auth/register", json=duplicate)
    assert r.status_code == 400
    assert "Username" in r.json()["detail"]


def test_register_short_password(client):
    r = client.post("/api/auth/register", json={**REGISTER_PAYLOAD, "password": "abc"})
    assert r.status_code == 422


def test_login_success(client):
    client.post("/api/auth/register", json=REGISTER_PAYLOAD)
    r = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "secret123",
    })
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json=REGISTER_PAYLOAD)
    r = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpass",
    })
    assert r.status_code == 401


def test_login_unknown_email(client):
    r = client.post("/api/auth/login", json={
        "email": "nobody@example.com",
        "password": "anything",
    })
    assert r.status_code == 401


def test_me_no_token(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 403


def test_me_invalid_token(client):
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer notavalidtoken"})
    assert r.status_code == 401


def test_me_success(client):
    client.post("/api/auth/register", json=REGISTER_PAYLOAD)
    token = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "secret123",
    }).json()["access_token"]

    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "test@example.com"
