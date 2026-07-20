from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_user, require_role

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.post("/", response_model=schemas.StudentResponse)
def create(
    student: schemas.StudentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    return crud.create_student(db, student)


@router.get("/", response_model=list[schemas.StudentResponse])
def read_all(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_students(db)


@router.get("/{student_id}", response_model=schemas.StudentResponse)
def read_one(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    student = crud.get_student(db, student_id)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student


@router.put("/{student_id}", response_model=schemas.StudentResponse)
def update(
    student_id: int,
    student: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    updated = crud.update_student(db, student_id, student)

    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")

    return updated


@router.delete("/{student_id}")
def delete(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin")),
):
    deleted = crud.delete_student(db, student_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"message": "Student deleted successfully"}


































# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# from ..database import get_db
# from .. import crud, schemas

# router = APIRouter(
#     prefix="/students",
#     tags=["Students"]
# )


# @router.post("/", response_model=schemas.StudentResponse)
# def create(student: schemas.StudentCreate, db: Session = Depends(get_db)):
#     return crud.create_student(db, student)


# @router.get("/", response_model=list[schemas.StudentResponse])
# def read_all(db: Session = Depends(get_db)):
#     return crud.get_students(db)


# @router.get("/{student_id}", response_model=schemas.StudentResponse)
# def read_one(student_id: int, db: Session = Depends(get_db)):
#     student = crud.get_student(db, student_id)

#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")

#     return student


# @router.put("/{student_id}", response_model=schemas.StudentResponse)
# def update(student_id: int, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
#     updated = crud.update_student(db, student_id, student)

#     if not updated:
#         raise HTTPException(status_code=404, detail="Student not found")

#     return updated


# @router.delete("/{student_id}")
# def delete(student_id: int, db: Session = Depends(get_db)):
#     deleted = crud.delete_student(db, student_id)

#     if not deleted:
#         raise HTTPException(status_code=404, detail="Student not found")

#     return {"message": "Student deleted successfully"}