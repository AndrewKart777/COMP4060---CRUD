"""Tests for the new Databases + Records endpoints."""


class TestDatabases:
    def test_create_database(self, auth_client):
        resp = auth_client.post("/databases/", json={
            "name": "Students",
            "description": "School database",
            "emoji": "🎓",
            "color": "#4ecdc4",
            "fields": [
                {"name": "first_name", "type": "text"},
                {"name": "grade", "type": "number"},
                {"name": "active", "type": "boolean"},
            ],
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "Students"
        assert len(data["fields"]) == 3
        assert data["records"] == []

    def test_list_databases_empty(self, auth_client):
        resp = auth_client.get("/databases/")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_list_databases(self, auth_client):
        auth_client.post("/databases/", json={"name": "DB1"})
        auth_client.post("/databases/", json={"name": "DB2"})
        resp = auth_client.get("/databases/")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_get_database_by_id(self, auth_client):
        create = auth_client.post("/databases/", json={"name": "Employees"})
        did = create.json()["id"]
        resp = auth_client.get(f"/databases/{did}")
        assert resp.status_code == 200
        assert resp.json()["name"] == "Employees"

    def test_get_database_not_found(self, auth_client):
        resp = auth_client.get("/databases/9999")
        assert resp.status_code == 404

    def test_update_database(self, auth_client):
        create = auth_client.post("/databases/", json={"name": "Old"})
        did = create.json()["id"]
        resp = auth_client.put(f"/databases/{did}", json={"name": "New", "emoji": "🏢"})
        assert resp.status_code == 200
        assert resp.json()["name"] == "New"
        assert resp.json()["emoji"] == "🏢"

    def test_update_database_fields(self, auth_client):
        create = auth_client.post("/databases/", json={"name": "X", "fields": [{"name": "a", "type": "text"}]})
        did = create.json()["id"]
        resp = auth_client.put(f"/databases/{did}", json={"fields": [
            {"name": "a", "type": "text"},
            {"name": "b", "type": "number"},
        ]})
        assert resp.status_code == 200
        assert len(resp.json()["fields"]) == 2

    def test_delete_database(self, auth_client):
        create = auth_client.post("/databases/", json={"name": "Del"})
        did = create.json()["id"]
        resp = auth_client.delete(f"/databases/{did}")
        assert resp.status_code == 204
        assert auth_client.get(f"/databases/{did}").status_code == 404

    def test_databases_require_auth(self, client):
        assert client.get("/databases/").status_code == 401
        assert client.post("/databases/", json={"name": "X"}).status_code == 401

    def test_database_isolation_between_users(self, client):
        # User A
        client.post("/auth/register", json={"name": "A", "email": "a2@t.com", "password": "pass"})
        r = client.post("/auth/login", data={"username": "a2@t.com", "password": "pass"})
        client.headers.update({"Authorization": f"Bearer {r.json()['access_token']}"})
        did = client.post("/databases/", json={"name": "A's DB"}).json()["id"]

        # User B
        client.post("/auth/register", json={"name": "B", "email": "b2@t.com", "password": "pass"})
        r = client.post("/auth/login", data={"username": "b2@t.com", "password": "pass"})
        client.headers.update({"Authorization": f"Bearer {r.json()['access_token']}"})

        assert client.get(f"/databases/{did}").status_code == 404
        assert client.get("/databases/").json() == []

    def test_select_field_with_options(self, auth_client):
        resp = auth_client.post("/databases/", json={
            "name": "Tasks",
            "fields": [
                {"name": "priority", "type": "select", "options": ["low", "medium", "high"]},
            ],
        })
        assert resp.status_code == 201
        assert resp.json()["fields"][0]["options"] == ["low", "medium", "high"]


class TestRecords:
    def _make_db(self, auth_client, fields=None):
        body = {"name": "TestDB", "fields": fields or [{"name": "title", "type": "text"}]}
        return auth_client.post("/databases/", json=body).json()["id"]

    def test_create_record(self, auth_client):
        did = self._make_db(auth_client)
        resp = auth_client.post(f"/databases/{did}/records/", json={
            "data": {"title": "First record"}
        })
        assert resp.status_code == 201
        assert resp.json()["data"] == {"title": "First record"}

    def test_create_record_with_multiple_types(self, auth_client):
        did = self._make_db(auth_client, fields=[
            {"name": "name", "type": "text"},
            {"name": "age", "type": "number"},
            {"name": "active", "type": "boolean"},
            {"name": "joined", "type": "date"},
        ])
        resp = auth_client.post(f"/databases/{did}/records/", json={
            "data": {"name": "Alice", "age": 30, "active": True, "joined": "2024-01-15"}
        })
        assert resp.status_code == 201
        d = resp.json()["data"]
        assert d["name"] == "Alice"
        assert d["age"] == 30
        assert d["active"] is True

    def test_list_records(self, auth_client):
        did = self._make_db(auth_client)
        auth_client.post(f"/databases/{did}/records/", json={"data": {"title": "A"}})
        auth_client.post(f"/databases/{did}/records/", json={"data": {"title": "B"}})
        resp = auth_client.get(f"/databases/{did}/records/")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_update_record(self, auth_client):
        did = self._make_db(auth_client)
        rid = auth_client.post(f"/databases/{did}/records/", json={"data": {"title": "Old"}}).json()["id"]
        resp = auth_client.put(f"/databases/{did}/records/{rid}", json={"data": {"title": "New"}})
        assert resp.status_code == 200
        assert resp.json()["data"]["title"] == "New"

    def test_delete_record(self, auth_client):
        did = self._make_db(auth_client)
        rid = auth_client.post(f"/databases/{did}/records/", json={"data": {"title": "X"}}).json()["id"]
        resp = auth_client.delete(f"/databases/{did}/records/{rid}")
        assert resp.status_code == 204

    def test_record_not_found(self, auth_client):
        did = self._make_db(auth_client)
        assert auth_client.put(f"/databases/{did}/records/9999", json={"data": {}}).status_code == 404
        assert auth_client.delete(f"/databases/{did}/records/9999").status_code == 404

    def test_record_wrong_database(self, auth_client):
        resp = auth_client.get("/databases/9999/records/")
        assert resp.status_code == 404

    def test_cascade_delete_records(self, auth_client):
        """Deleting a database should cascade-delete its records."""
        did = self._make_db(auth_client)
        auth_client.post(f"/databases/{did}/records/", json={"data": {"title": "child"}})
        auth_client.delete(f"/databases/{did}")
        assert auth_client.get(f"/databases/{did}/records/").status_code == 404
