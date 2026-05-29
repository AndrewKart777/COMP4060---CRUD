from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, trackers, items, databases


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.database import engine, Base
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Universal Tracker API",
    description="Full-stack CRUD app — trackers and custom databases. COMP4060 CPD.",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(trackers.router)
app.include_router(items.router)
app.include_router(databases.router)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "Universal Tracker API is running"}
