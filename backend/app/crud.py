from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_email(db:Session,email:str):
    return db.query(models.User).filter(models.User.email==email).first()


def create_user(db:Session,user:schemas.UserCreate,hashed_password:str):
    db_user=models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
                        )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def get_students(db: Session):
    return db.query(models.Student).all()


def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(
        models.Student.id == student_id
    ).first()


def update_student(db: Session, student_id: int, student: schemas.StudentUpdate):
    db_student = get_student(db, student_id)

    if not db_student:
        return None

    for key, value in student.model_dump().items():
        setattr(db_student, key, value)

    db.commit()
    db.refresh(db_student)

    return db_student


def delete_student(db: Session, student_id: int):
    db_student = get_student(db, student_id)

    if not db_student:
        return None

    db.delete(db_student)
    db.commit()

    return db_student