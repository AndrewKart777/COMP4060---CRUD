from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas, models
from app.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/trackers", tags=["trackers"])


def _get_tracker_or_404(tracker_id: int, db: Session, current_user: models.User):
    tracker = crud.get_tracker(db, tracker_id, current_user.id)
    if not tracker:
        raise HTTPException(status_code=404, detail="Tracker not found")
    return tracker


@router.get("/", response_model=List[schemas.TrackerOut])
def list_trackers(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_trackers(db, current_user.id)


@router.post("/", response_model=schemas.TrackerOut, status_code=201)
def create_tracker(
    tracker: schemas.TrackerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.create_tracker(db, tracker, current_user.id)


@router.get("/{tracker_id}", response_model=schemas.TrackerOut)
def get_tracker(
    tracker_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return _get_tracker_or_404(tracker_id, db, current_user)


@router.put("/{tracker_id}", response_model=schemas.TrackerOut)
def update_tracker(
    tracker_id: int,
    update: schemas.TrackerUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    tracker = crud.update_tracker(db, tracker_id, update, current_user.id)
    if not tracker:
        raise HTTPException(status_code=404, detail="Tracker not found")
    return tracker


@router.delete("/{tracker_id}", status_code=204)
def delete_tracker(
    tracker_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not crud.delete_tracker(db, tracker_id, current_user.id):
        raise HTTPException(status_code=404, detail="Tracker not found")
