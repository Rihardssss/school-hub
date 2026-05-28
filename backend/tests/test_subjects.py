def test_list_subjects_empty(client, auth_a):
    r = client.get("/api/subjects", headers=auth_a)
    assert r.status_code == 200
    assert r.json() == []

def test_create_subject(client, auth_a):
    r = client.post("/api/subjects", headers=auth_a, json={"name": "Math", "color": "#ff0000"})
    assert r.status_code == 201
    body = r.json()
    assert body["name"] == "Math"
    assert body["color"] == "#ff0000"
    assert "id" in body

def test_create_subject_requires_auth(client):
    r = client.post("/api/subjects", json={"name": "Math"})
    assert r.status_code == 403

def test_update_subject(client, auth_a):
    created = client.post("/api/subjects", headers=auth_a, json={"name": "Math"}).json()
    r = client.put(f"/api/subjects/{created['id']}", headers=auth_a, json={"name": "Advanced Math"})
    assert r.status_code == 200
    assert r.json()["name"] == "Advanced Math"

def test_update_subject_not_found(client, auth_a):
    r = client.put("/api/subjects/00000000-0000-0000-0000-000000000000", headers=auth_a, json={"name": "X"})
    assert r.status_code == 404

def test_delete_subject(client, auth_a):
    created = client.post("/api/subjects", headers=auth_a, json={"name": "Math"}).json()
    r = client.delete(f"/api/subjects/{created['id']}", headers=auth_a)
    assert r.status_code == 204

    listed = client.get("/api/subjects", headers=auth_a).json()
    assert not any(s["id"] == created["id"] for s in listed)

def test_delete_subject_not_found(client, auth_a):
    r = client.delete("/api/subjects/00000000-0000-0000-0000-000000000000", headers=auth_a)
    assert r.status_code == 404
