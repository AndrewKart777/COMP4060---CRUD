import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Use SQLite in-memory for tests (no Postgres needed in CI)
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine_test = create_engine(
    SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_client(client):
    """Returns a TestClient with a valid JWT token pre-set."""
    client.post("/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
    })
    resp = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "testpassword123",
    })
    token = resp.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
