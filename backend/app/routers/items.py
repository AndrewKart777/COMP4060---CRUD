from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas, models
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/trackers/{tracker_id}/items", tags=["items"])


def _verify_tracker_owner(tracker_id: int, db: Session, current_user: models.User):
    tracker = crud.get_tracker(db, tracker_id, current_user.id)
    if not tracker:
        raise HTTPException(status_code=404, detail="Tracker not found")
    return tracker


@router.get("/", response_model=List[schemas.ItemOut])
def list_items(
    tracker_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_tracker_owner(tracker_id, db, current_user)
    return crud.get_items(db, tracker_id)


@router.post("/", response_model=schemas.ItemOut, status_code=201)
def create_item(
    tracker_id: int,
    item: schemas.ItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_tracker_owner(tracker_id, db, current_user)
    return crud.create_item(db, item, tracker_id)


@router.put("/{item_id}", response_model=schemas.ItemOut)
def update_item(
    tracker_id: int,
    item_id: int,
    update: schemas.ItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_tracker_owner(tracker_id, db, current_user)
    item = crud.update_item(db, item_id, tracker_id, update)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/{item_id}", status_code=204)
def delete_item(
    tracker_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _verify_tracker_owner(tracker_id, db, current_user)
    if not crud.delete_item(db, item_id, tracker_id):
        raise HTTPException(status_code=404, detail="Item not found")
