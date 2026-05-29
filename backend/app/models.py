from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class StatusEnum(str, enum.Enum):
    todo = "todo"
    in_progress = "in-progress"
    done = "done"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    trackers = relationship("Tracker", back_populates="owner", cascade="all, delete-orphan")
    databases = relationship("Database", back_populates="owner", cascade="all, delete-orphan")


class Tracker(Base):
    __tablename__ = "trackers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    emoji = Column(String, default="📋")
    color = Column(String, default="#6D8196")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="trackers")
    items = relationship("Item", back_populates="tracker", cascade="all, delete-orphan")


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.todo, nullable=False)
    tracker_id = Column(Integer, ForeignKey("trackers.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tracker = relationship("Tracker", back_populates="items")


class Database(Base):
    __tablename__ = "databases"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    emoji = Column(String, default="📊")
    color = Column(String, default="#004E89")
    fields = Column(JSON, nullable=False, default=list)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="databases")
    records = relationship("Record", back_populates="database", cascade="all, delete-orphan")


class Record(Base):
    __tablename__ = "records"
    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSON, nullable=False, default=dict)
    database_id = Column(Integer, ForeignKey("databases.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    database = relationship("Database", back_populates="records")
