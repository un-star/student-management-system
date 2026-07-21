from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_user, require_role

router = APIRouter(
    prefix="/marks",
    tags=["Marks"]
)


@router.post("/", response_model=schemas.MarksResponse)
def add(
    marks: schemas.MarksCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    result = crud.add_marks(db, marks)
    if not result:
        raise HTTPException(status_code=404, detail="Student not found")
    return result


@router.get("/", response_model=list[schemas.MarksResponse])
def view(
    student_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.get_marks(db, student_id)


@router.put("/{marks_id}", response_model=schemas.MarksResponse)
def update(
    marks_id: int,
    marks: schemas.MarksUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    updated = crud.update_marks(db, marks_id, marks)

    if not updated:
        raise HTTPException(status_code=404, detail="Marks record not found")

    return updated