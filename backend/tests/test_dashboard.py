import pytest


@pytest.fixture
def subject_id(client, auth_a):
    return client.post("/api/subjects", headers=auth_a, json={"name": "Physics"}).json()["id"]


# ── stats structure ───────────────────────────────────────────────────────────

def test_stats_keys_present(client, auth_a):
    r = client.get("/api/dashboard/stats", headers=auth_a)
    assert r.status_code == 200
    body = r.json()
    expected_keys = {
        "homework_total", "homework_pending", "homework_done",
        "homework_due_today", "unread_messages", "todays_lessons", "subjects_total",
    }
    assert expected_keys == set(body.keys())


def test_stats_all_zero_for_new_user(client, auth_a):
    r = client.get("/api/dashboard/stats", headers=auth_a)
    body = r.json()
    assert body["homework_total"] == 0
    assert body["homework_pending"] == 0
    assert body["unread_messages"] == 0
    assert body["subjects_total"] == 0


# ── homework counts ───────────────────────────────────────────────────────────

def test_stats_homework_total(client, auth_a, subject_id):
    for title in ("HW 1", "HW 2", "HW 3"):
        client.post("/api/homework", headers=auth_a,
                    json={"subject_id": subject_id, "title": title})

    body = client.get("/api/dashboard/stats", headers=auth_a).json()
    assert body["homework_total"] == 3
    assert body["homework_pending"] == 3
    assert body["homework_done"] == 0


def test_stats_homework_done(client, auth_a, subject_id):
    hw_id = client.post("/api/homework", headers=auth_a,
                        json={"subject_id": subject_id, "title": "Done task"}).json()["id"]
    client.put(f"/api/homework/{hw_id}", headers=auth_a, json={"status": "done"})

    body = client.get("/api/dashboard/stats", headers=auth_a).json()
    assert body["homework_total"] == 1
    assert body["homework_done"] == 1
    assert body["homework_pending"] == 0


def test_stats_homework_isolated_between_users(client, auth_a, auth_b, subject_id):
    # Alice creates homework; Bob's stats should still show zero
    client.post("/api/homework", headers=auth_a,
                json={"subject_id": subject_id, "title": "Alice's task"})

    body_b = client.get("/api/dashboard/stats", headers=auth_b).json()
    assert body_b["homework_total"] == 0


# ── subject count ─────────────────────────────────────────────────────────────

def test_stats_subjects_total(client, auth_a):
    for name in ("Math", "English", "IT"):
        client.post("/api/subjects", headers=auth_a, json={"name": name})

    body = client.get("/api/dashboard/stats", headers=auth_a).json()
    assert body["subjects_total"] == 3


# ── unread messages ───────────────────────────────────────────────────────────

def test_stats_unread_messages(client, auth_a, auth_b, token_b):
    # Get Bob's user id
    bob_id = client.get("/api/auth/me", headers=auth_b).json()["id"]

    # Alice sends Bob two messages
    for subj in ("Hello", "Meeting"):
        client.post("/api/messages", headers=auth_a,
                    json={"recipient_id": bob_id, "subject": subj, "body": "..."})

    body = client.get("/api/dashboard/stats", headers=auth_b).json()
    assert body["unread_messages"] == 2


def test_stats_unread_decreases_after_read(client, auth_a, auth_b):
    bob_id = client.get("/api/auth/me", headers=auth_b).json()["id"]
    client.post("/api/messages", headers=auth_a,
                json={"recipient_id": bob_id, "subject": "Hi", "body": "..."})

    inbox = client.get("/api/messages/inbox", headers=auth_b).json()
    msg_id = inbox[0]["id"]
    client.patch(f"/api/messages/{msg_id}/read", headers=auth_b)

    body = client.get("/api/dashboard/stats", headers=auth_b).json()
    assert body["unread_messages"] == 0


# ── logs endpoint ─────────────────────────────────────────────────────────────

def test_logs_returns_list(client, auth_a):
    r = client.get("/api/logs", headers=auth_a)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_logs_contains_registration_event(client, auth_a):
    logs = client.get("/api/logs", headers=auth_a).json()
    actions = [l["action"] for l in logs]
    assert "user_registered" in actions


def test_logs_action_filter(client, auth_a, subject_id):
    client.post("/api/homework", headers=auth_a,
                json={"subject_id": subject_id, "title": "Logged task"})

    logs = client.get("/api/logs?action=homework_created", headers=auth_a).json()
    assert len(logs) >= 1
    assert all(l["action"] == "homework_created" for l in logs)


def test_logs_jsonb_title_extraction(client, auth_a, subject_id):
    client.post("/api/homework", headers=auth_a,
                json={"subject_id": subject_id, "title": "JSONB test task"})

    logs = client.get("/api/logs?action=homework_created", headers=auth_a).json()
    titles = [l["entry_title"] for l in logs]
    assert "JSONB test task" in titles


def test_logs_isolated_between_users(client, auth_a, auth_b):
    # Bob should not see Alice's logs
    logs_b = client.get("/api/logs", headers=auth_b).json()
    actions_b = [l["action"] for l in logs_b]
    # Bob was registered in this test — only his own events visible
    assert all("alice" not in (l.get("entry_title") or "") for l in logs_b)
