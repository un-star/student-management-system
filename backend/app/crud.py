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






from datetime import date as date_type
from sqlalchemy import func


# --- Attendance CRUD ---

def mark_attendance(db: Session, attendance: schemas.AttendanceCreate):
    student = get_student(db, attendance.student_id)
    if not student:
        return None
    db_attendance = models.Attendance(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


def get_attendance(db: Session, student_id: int | None = None, date_filter: date_type | None = None):
    query = db.query(models.Attendance)
    if student_id is not None:
        query = query.filter(models.Attendance.student_id == student_id)
    if date_filter is not None:
        query = query.filter(models.Attendance.date == date_filter)
    return query.all()


def get_attendance_by_id(db: Session, attendance_id: int):
    return db.query(models.Attendance).filter(models.Attendance.id == attendance_id).first()


def update_attendance(db: Session, attendance_id: int, attendance: schemas.AttendanceUpdate):
    db_attendance = get_attendance_by_id(db, attendance_id)
    if not db_attendance:
        return None
    db_attendance.status = attendance.status
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


# --- Marks CRUD ---

def add_marks(db: Session, marks: schemas.MarksCreate):
    student = get_student(db, marks.student_id)
    if not student:
        return None
    db_marks = models.Marks(**marks.model_dump())
    db.add(db_marks)
    db.commit()
    db.refresh(db_marks)
    return db_marks


def get_marks(db: Session, student_id: int | None = None):
    query = db.query(models.Marks)
    if student_id is not None:
        query = query.filter(models.Marks.student_id == student_id)
    return query.all()


def get_marks_by_id(db: Session, marks_id: int):
    return db.query(models.Marks).filter(models.Marks.id == marks_id).first()


def update_marks(db: Session, marks_id: int, marks: schemas.MarksUpdate):
    db_marks = get_marks_by_id(db, marks_id)
    if not db_marks:
        return None
    db_marks.marks = marks.marks
    db.commit()
    db.refresh(db_marks)
    return db_marks


# --- Dashboard stats ---

def get_dashboard_stats(db: Session):
    total_students = db.query(models.Student).count()

    today = date_type.today()
    present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today, models.Attendance.status == "Present"
    ).count()
    absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == today, models.Attendance.status == "Absent"
    ).count()

    avg_marks = db.query(func.avg(models.Marks.marks)).scalar()

    return {
        "total_students": total_students,
        "present_today": present_today,
        "absent_today": absent_today,
        "average_marks": round(float(avg_marks), 2) if avg_marks is not None else 0.0,
    }