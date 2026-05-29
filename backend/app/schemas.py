from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from app.models import StatusEnum


# ── Auth ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# ── Items (tracker children) ──────────────────────────────────────────────────
class ItemCreate(BaseModel):
    name: str
    status: StatusEnum = StatusEnum.todo


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[StatusEnum] = None


class ItemOut(BaseModel):
    id: int
    name: str
    status: StatusEnum
    tracker_id: int
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Trackers ──────────────────────────────────────────────────────────────────
class TrackerCreate(BaseModel):
    name: str
    description: Optional[str] = None
    emoji: str = "📋"
    color: str = "#7c6aff"


class TrackerUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    emoji: Optional[str] = None
    color: Optional[str] = None


class TrackerOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    emoji: str
    color: str
    owner_id: int
    created_at: datetime
    items: List[ItemOut] = []
    model_config = {"from_attributes": True}


# ── Database fields (schema definition) ───────────────────────────────────────
FieldType = Literal["text", "number", "date", "boolean", "select"]


class FieldDef(BaseModel):
    name: str
    type: FieldType = "text"
    options: List[str] = []  # only used for "select"


# ── Records (database rows) ───────────────────────────────────────────────────
class RecordCreate(BaseModel):
    data: Dict[str, Any]


class RecordUpdate(BaseModel):
    data: Dict[str, Any]


class RecordOut(BaseModel):
    id: int
    data: Dict[str, Any]
    database_id: int
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Databases ─────────────────────────────────────────────────────────────────
class DatabaseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    emoji: str = "📊"
    color: str = "#4ecdc4"
    fields: List[FieldDef] = []


class DatabaseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    emoji: Optional[str] = None
    color: Optional[str] = None
    fields: Optional[List[FieldDef]] = None


class DatabaseOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    emoji: str
    color: str
    fields: List[FieldDef]
    owner_id: int
    created_at: datetime
    records: List[RecordOut] = []
    model_config = {"from_attributes": True}
