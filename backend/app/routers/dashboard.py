# app/routers/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats", response_model=schemas.DashboardStats)
def stats(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_dashboard_stats(db)