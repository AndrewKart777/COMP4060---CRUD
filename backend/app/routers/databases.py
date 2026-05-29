from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas, models
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/databases", tags=["databases"])


# ── Databases ─────────────────────────────────────────────────────────────────
@router.get("/", response_model=List[schemas.DatabaseOut])
def list_databases(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_databases(db, current_user.id)


@router.post("/", response_model=schemas.DatabaseOut, status_code=201)
def create_database(
    database: schemas.DatabaseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.create_database(db, database, current_user.id)


@router.get("/{database_id}", response_model=schemas.DatabaseOut)
def get_database(
    database_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    database = crud.get_database(db, database_id, current_user.id)
    if not database:
        raise HTTPException(status_code=404, detail="Database not found")
    return database


@router.put("/{database_id}", response_model=schemas.DatabaseOut)
def update_database(
    database_id: int,
    update: schemas.DatabaseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    database = crud.update_database(db, database_id, update, current_user.id)
    if not database:
        raise HTTPException(status_code=404, detail="Database not found")
    return database


@router.delete("/{database_id}", status_code=204)
def delete_database(
    database_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not crud.delete_database(db, database_id, current_user.id):
        raise HTTPException(status_code=404, detail="Database not found")


# ── Records (children) ────────────────────────────────────────────────────────
def _verify_database(database_id: int, db: Session, current_user: models.User):
    database = crud.get_database(db, database_id, current_user.id)
    if not database:
        raise HTTPException(status_code=404, detail="Database not found")
    return database


@router.get("/{database_id}/records/", response_model=List[schemas.RecordOut])
def list_records(
    database_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_database(database_id, db, current_user)
    return crud.get_records(db, database_id)


@router.post("/{database_id}/records/", response_model=schemas.RecordOut, status_code=201)
def create_record(
    database_id: int,
    record: schemas.RecordCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_database(database_id, db, current_user)
    return crud.create_record(db, record, database_id)


@router.put("/{database_id}/records/{record_id}", response_model=schemas.RecordOut)
def update_record(
    database_id: int,
    record_id: int,
    update: schemas.RecordUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_database(database_id, db, current_user)
    record = crud.update_record(db, record_id, database_id, update)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.delete("/{database_id}/records/{record_id}", status_code=204)
def delete_record(
    database_id: int,
    record_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_database(database_id, db, current_user)
    if not crud.delete_record(db, record_id, database_id):
        raise HTTPException(status_code=404, detail="Record not found")
