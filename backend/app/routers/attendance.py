from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_user, require_role

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post("/", response_model=schemas.AttendanceResponse)
def mark(
    attendance: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    result = crud.mark_attendance(db, attendance)
    if not result:
        raise HTTPException(status_code=404, detail="Student not found")
    return result


@router.get("/", response_model=list[schemas.AttendanceResponse])
def view(
    student_id: int | None = None,
    date_filter: date | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.get_attendance(db, student_id, date_filter)


@router.put("/{attendance_id}", response_model=schemas.AttendanceResponse)
def update(
    attendance_id: int,
    attendance: schemas.AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    updated = crud.update_attendance(db, attendance_id, attendance)

    if not updated:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    return updated