import pytest


@pytest.fixture
def subject_id(client, auth_a):
    r = client.post("/api/subjects", headers=auth_a, json={"name": "Biology"})
    return r.json()["id"]


def test_list_homework_empty(client, auth_a):
    r = client.get("/api/homework", headers=auth_a)
    assert r.status_code == 200
    assert r.json() == []


def test_create_homework(client, auth_a, subject_id):
    r = client.post("/api/homework", headers=auth_a, json={
        "subject_id": subject_id,
        "title": "Read chapter 3",
        "due_date": "2026-06-01",
    })
    assert r.status_code == 201
    body = r.json()
    assert body["title"] == "Read chapter 3"
    assert body["status"] == "pending"
    assert body["due_date"] == "2026-06-01"


def test_create_homework_invalid_subject(client, auth_a):
    r = client.post("/api/homework", headers=auth_a, json={
        "subject_id": "00000000-0000-0000-0000-000000000000",
        "title": "Whatever",
    })
    assert r.status_code == 404


def test_get_homework(client, auth_a, subject_id):
    hw_id = client.post("/api/homework", headers=auth_a, json={
        "subject_id": subject_id,
        "title": "Essay",
    }).json()["id"]

    r = client.get(f"/api/homework/{hw_id}", headers=auth_a)
    assert r.status_code == 200
    assert r.json()["title"] == "Essay"


def test_get_homework_not_owned(client, auth_a, auth_b, subject_id):
    # Alice creates homework; Bob cannot see it
    hw_id = client.post("/api/homework", headers=auth_a, json={
        "subject_id": subject_id,
        "title": "Alice's essay",
    }).json()["id"]

    r = client.get(f"/api/homework/{hw_id}", headers=auth_b)
    assert r.status_code == 404


def test_update_homework_status(client, auth_a, subject_id):
    hw_id = client.post("/api/homework", headers=auth_a, json={
        "subject_id": subject_id,
        "title": "Finish lab",
    }).json()["id"]

    r = client.put(f"/api/homework/{hw_id}", headers=auth_a, json={"status": "done"})
    assert r.status_code == 200
    assert r.json()["status"] == "done"


def test_update_homework_invalid_status(client, auth_a, subject_id):
    hw_id = client.post("/api/homework", headers=auth_a, json={
        "subject_id": subject_id,
        "title": "Task",
    }).json()["id"]

    r = client.put(f"/api/homework/{hw_id}", headers=auth_a, json={"status": "invalid_status"})
    assert r.status_code == 422


def test_delete_homework(client, auth_a, subject_id):
    hw_id = client.post("/api/homework", headers=auth_a, json={
        "subject_id": subject_id,
        "title": "Delete me",
    }).json()["id"]

    r = client.delete(f"/api/homework/{hw_id}", headers=auth_a)
    assert r.status_code == 204

    r = client.get(f"/api/homework/{hw_id}", headers=auth_a)
    assert r.status_code == 404


def test_delete_homework_not_owned(client, auth_a, auth_b, subject_id):
    hw_id = client.post("/api/homework", headers=auth_a, json={
        "subject_id": subject_id,
        "title": "Protected",
    }).json()["id"]

    r = client.delete(f"/api/homework/{hw_id}", headers=auth_b)
    assert r.status_code == 404
