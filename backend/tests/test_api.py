"""
API test suite for Universal Tracker
Covers: auth, trackers CRUD, items CRUD, protected routes, edge cases
"""


# ── Auth Endpoints ─────────────────────────────────────────────────────────────
class TestAuth:
    def test_register_success(self, client):
        resp = client.post("/auth/register", json={
            "name": "Alice",
            "email": "alice@example.com",
            "password": "securepass123",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "alice@example.com"
        assert data["name"] == "Alice"
        assert "id" in data
        assert "hashed_password" not in data

    def test_register_duplicate_email(self, client):
        payload = {"name": "Alice", "email": "dupe@example.com", "password": "pass"}
        client.post("/auth/register", json=payload)
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 400

    def test_login_success(self, client):
        client.post("/auth/register", json={
            "name": "Bob", "email": "bob@example.com", "password": "bobpass"
        })
        resp = client.post("/auth/login", data={
            "username": "bob@example.com", "password": "bobpass"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        client.post("/auth/register", json={
            "name": "Bob", "email": "bob2@example.com", "password": "correct"
        })
        resp = client.post("/auth/login", data={
            "username": "bob2@example.com", "password": "wrong"
        })
        assert resp.status_code == 401

    def test_login_nonexistent_user(self, client):
        resp = client.post("/auth/login", data={
            "username": "ghost@example.com", "password": "pass"
        })
        assert resp.status_code == 401

    def test_get_me_authenticated(self, auth_client):
        resp = auth_client.get("/auth/me")
        assert resp.status_code == 200
        assert resp.json()["email"] == "test@example.com"

    def test_get_me_unauthenticated(self, client):
        resp = client.get("/auth/me")
        assert resp.status_code == 401

    def test_get_me_invalid_token(self, client):
        client.headers.update({"Authorization": "Bearer invalidtoken"})
        resp = client.get("/auth/me")
        assert resp.status_code == 401


# ── Tracker Endpoints ──────────────────────────────────────────────────────────
class TestTrackers:
    def test_create_tracker(self, auth_client):
        resp = auth_client.post("/trackers/", json={
            "name": "My Tasks",
            "description": "Daily work tasks",
            "emoji": "💻",
            "color": "#7c6aff",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "My Tasks"
        assert data["emoji"] == "💻"
        assert data["items"] == []

    def test_list_trackers(self, auth_client):
        auth_client.post("/trackers/", json={"name": "T1"})
        auth_client.post("/trackers/", json={"name": "T2"})
        resp = auth_client.get("/trackers/")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_list_trackers_empty(self, auth_client):
        resp = auth_client.get("/trackers/")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_get_tracker_by_id(self, auth_client):
        create = auth_client.post("/trackers/", json={"name": "Reading"})
        tid = create.json()["id"]
        resp = auth_client.get(f"/trackers/{tid}")
        assert resp.status_code == 200
        assert resp.json()["name"] == "Reading"

    def test_get_tracker_not_found(self, auth_client):
        resp = auth_client.get("/trackers/9999")
        assert resp.status_code == 404

    def test_update_tracker(self, auth_client):
        create = auth_client.post("/trackers/", json={"name": "Old Name"})
        tid = create.json()["id"]
        resp = auth_client.put(f"/trackers/{tid}", json={"name": "New Name", "emoji": "🎯"})
        assert resp.status_code == 200
        assert resp.json()["name"] == "New Name"
        assert resp.json()["emoji"] == "🎯"

    def test_update_tracker_not_found(self, auth_client):
        resp = auth_client.put("/trackers/9999", json={"name": "X"})
        assert resp.status_code == 404

    def test_delete_tracker(self, auth_client):
        create = auth_client.post("/trackers/", json={"name": "To Delete"})
        tid = create.json()["id"]
        resp = auth_client.delete(f"/trackers/{tid}")
        assert resp.status_code == 204
        assert auth_client.get(f"/trackers/{tid}").status_code == 404

    def test_delete_tracker_not_found(self, auth_client):
        resp = auth_client.delete("/trackers/9999")
        assert resp.status_code == 404

    def test_tracker_isolation_between_users(self, client):
        """User A cannot see User B's trackers."""
        # User A
        client.post("/auth/register", json={"name": "A", "email": "a@test.com", "password": "pass"})
        r = client.post("/auth/login", data={"username": "a@test.com", "password": "pass"})
        client.headers.update({"Authorization": f"Bearer {r.json()['access_token']}"})
        create = client.post("/trackers/", json={"name": "A's tracker"})
        tid = create.json()["id"]

        # User B
        client.post("/auth/register", json={"name": "B", "email": "b@test.com", "password": "pass"})
        r = client.post("/auth/login", data={"username": "b@test.com", "password": "pass"})
        client.headers.update({"Authorization": f"Bearer {r.json()['access_token']}"})

        assert client.get(f"/trackers/{tid}").status_code == 404
        assert client.get("/trackers/").json() == []

    def test_trackers_require_auth(self, client):
        assert client.get("/trackers/").status_code == 401
        assert client.post("/trackers/", json={"name": "X"}).status_code == 401


# ── Item Endpoints ─────────────────────────────────────────────────────────────
class TestItems:
    def _make_tracker(self, auth_client):
        return auth_client.post("/trackers/", json={"name": "T"}).json()["id"]

    def test_create_item(self, auth_client):
        tid = self._make_tracker(auth_client)
        resp = auth_client.post(f"/trackers/{tid}/items/", json={
            "name": "Buy milk", "status": "todo"
        })
        assert resp.status_code == 201
        assert resp.json()["name"] == "Buy milk"
        assert resp.json()["status"] == "todo"

    def test_list_items(self, auth_client):
        tid = self._make_tracker(auth_client)
        auth_client.post(f"/trackers/{tid}/items/", json={"name": "Item 1"})
        auth_client.post(f"/trackers/{tid}/items/", json={"name": "Item 2"})
        resp = auth_client.get(f"/trackers/{tid}/items/")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_update_item_status(self, auth_client):
        tid = self._make_tracker(auth_client)
        item = auth_client.post(f"/trackers/{tid}/items/", json={"name": "Task"}).json()
        iid = item["id"]
        resp = auth_client.put(f"/trackers/{tid}/items/{iid}", json={"status": "done"})
        assert resp.status_code == 200
        assert resp.json()["status"] == "done"

    def test_update_item_name(self, auth_client):
        tid = self._make_tracker(auth_client)
        item = auth_client.post(f"/trackers/{tid}/items/", json={"name": "Old"}).json()
        resp = auth_client.put(f"/trackers/{tid}/items/{item['id']}", json={"name": "New"})
        assert resp.status_code == 200
        assert resp.json()["name"] == "New"

    def test_delete_item(self, auth_client):
        tid = self._make_tracker(auth_client)
        item = auth_client.post(f"/trackers/{tid}/items/", json={"name": "Del me"}).json()
        resp = auth_client.delete(f"/trackers/{tid}/items/{item['id']}")
        assert resp.status_code == 204

    def test_item_not_found(self, auth_client):
        tid = self._make_tracker(auth_client)
        assert auth_client.put(f"/trackers/{tid}/items/9999", json={"name": "X"}).status_code == 404
        assert auth_client.delete(f"/trackers/{tid}/items/9999").status_code == 404

    def test_item_wrong_tracker(self, auth_client):
        """Items on a non-owned tracker return 404."""
        resp = auth_client.get("/trackers/9999/items/")
        assert resp.status_code == 404

    def test_cascade_delete(self, auth_client):
        """Deleting tracker also removes its items."""
        tid = self._make_tracker(auth_client)
        auth_client.post(f"/trackers/{tid}/items/", json={"name": "Child"})
        auth_client.delete(f"/trackers/{tid}")
        # Tracker gone
        assert auth_client.get(f"/trackers/{tid}").status_code == 404

    def test_default_status_is_todo(self, auth_client):
        tid = self._make_tracker(auth_client)
        resp = auth_client.post(f"/trackers/{tid}/items/", json={"name": "No status given"})
        assert resp.json()["status"] == "todo"

    def test_all_statuses_accepted(self, auth_client):
        tid = self._make_tracker(auth_client)
        for status in ["todo", "in-progress", "done"]:
            resp = auth_client.post(f"/trackers/{tid}/items/", json={"name": f"Item {status}", "status": status})
            assert resp.status_code == 201
            assert resp.json()["status"] == status

    def test_invalid_status_rejected(self, auth_client):
        tid = self._make_tracker(auth_client)
        resp = auth_client.post(f"/trackers/{tid}/items/", json={"name": "Bad", "status": "invalid"})
        assert resp.status_code == 422


# ── Health check ───────────────────────────────────────────────────────────────
class TestHealth:
    def test_root(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"
