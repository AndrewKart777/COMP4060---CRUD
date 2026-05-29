from sqlalchemy.orm import Session
from app import models, schemas
from app.auth import hash_password


# ── Users ─────────────────────────────────────────────────────────────────────
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ── Trackers ──────────────────────────────────────────────────────────────────
def get_trackers(db: Session, owner_id: int):
    return db.query(models.Tracker).filter(models.Tracker.owner_id == owner_id).all()


def get_tracker(db: Session, tracker_id: int, owner_id: int):
    return (
        db.query(models.Tracker)
        .filter(models.Tracker.id == tracker_id, models.Tracker.owner_id == owner_id)
        .first()
    )


def create_tracker(db: Session, tracker: schemas.TrackerCreate, owner_id: int):
    db_tracker = models.Tracker(**tracker.model_dump(), owner_id=owner_id)
    db.add(db_tracker)
    db.commit()
    db.refresh(db_tracker)
    return db_tracker


def update_tracker(db: Session, tracker_id: int, update: schemas.TrackerUpdate, owner_id: int):
    db_tracker = get_tracker(db, tracker_id, owner_id)
    if not db_tracker:
        return None
    for key, val in update.model_dump(exclude_unset=True).items():
        setattr(db_tracker, key, val)
    db.commit()
    db.refresh(db_tracker)
    return db_tracker


def delete_tracker(db: Session, tracker_id: int, owner_id: int):
    db_tracker = get_tracker(db, tracker_id, owner_id)
    if not db_tracker:
        return False
    db.delete(db_tracker)
    db.commit()
    return True


# ── Items ─────────────────────────────────────────────────────────────────────
def get_items(db: Session, tracker_id: int):
    return db.query(models.Item).filter(models.Item.tracker_id == tracker_id).all()


def get_item(db: Session, item_id: int, tracker_id: int):
    return (
        db.query(models.Item)
        .filter(models.Item.id == item_id, models.Item.tracker_id == tracker_id)
        .first()
    )


def create_item(db: Session, item: schemas.ItemCreate, tracker_id: int):
    db_item = models.Item(**item.model_dump(), tracker_id=tracker_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_item(db: Session, item_id: int, tracker_id: int, update: schemas.ItemUpdate):
    db_item = get_item(db, item_id, tracker_id)
    if not db_item:
        return None
    for key, val in update.model_dump(exclude_unset=True).items():
        setattr(db_item, key, val)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int, tracker_id: int):
    db_item = get_item(db, item_id, tracker_id)
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True


# ── Databases ─────────────────────────────────────────────────────────────────
def get_databases(db: Session, owner_id: int):
    return db.query(models.Database).filter(models.Database.owner_id == owner_id).all()


def get_database(db: Session, database_id: int, owner_id: int):
    return (
        db.query(models.Database)
        .filter(models.Database.id == database_id, models.Database.owner_id == owner_id)
        .first()
    )


def create_database(db: Session, database: schemas.DatabaseCreate, owner_id: int):
    payload = database.model_dump()
    # Pydantic field models -> dicts so they serialize cleanly to JSON
    payload["fields"] = [f for f in payload.get("fields", [])]
    db_database = models.Database(**payload, owner_id=owner_id)
    db.add(db_database)
    db.commit()
    db.refresh(db_database)
    return db_database


def update_database(db: Session, database_id: int, update: schemas.DatabaseUpdate, owner_id: int):
    db_database = get_database(db, database_id, owner_id)
    if not db_database:
        return None
    data = update.model_dump(exclude_unset=True)
    if "fields" in data and data["fields"] is not None:
        data["fields"] = [f for f in data["fields"]]
    for key, val in data.items():
        setattr(db_database, key, val)
    db.commit()
    db.refresh(db_database)
    return db_database


def delete_database(db: Session, database_id: int, owner_id: int):
    db_database = get_database(db, database_id, owner_id)
    if not db_database:
        return False
    db.delete(db_database)
    db.commit()
    return True


# ── Records ───────────────────────────────────────────────────────────────────
def get_records(db: Session, database_id: int):
    return db.query(models.Record).filter(models.Record.database_id == database_id).all()


def get_record(db: Session, record_id: int, database_id: int):
    return (
        db.query(models.Record)
        .filter(models.Record.id == record_id, models.Record.database_id == database_id)
        .first()
    )


def create_record(db: Session, record: schemas.RecordCreate, database_id: int):
    db_record = models.Record(data=record.data, database_id=database_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def update_record(db: Session, record_id: int, database_id: int, update: schemas.RecordUpdate):
    db_record = get_record(db, record_id, database_id)
    if not db_record:
        return None
    db_record.data = update.data
    db.commit()
    db.refresh(db_record)
    return db_record


def delete_record(db: Session, record_id: int, database_id: int):
    db_record = get_record(db, record_id, database_id)
    if not db_record:
        return False
    db.delete(db_record)
    db.commit()
    return True
