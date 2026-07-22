import os

from fastapi import FastAPI
from sqlalchemy.orm import Session
from . import models      
from .database import Base, engine, SessionLocal
from . import crud, schemas
from .auth import hash_password
from .routers import students, auth, marks, dashboard
from .routers import attendance
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student CRUD API")


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(auth.router)
app.include_router(attendance.router)
app.include_router(marks.router)
app.include_router(dashboard.router)


def seed_admin_user() -> None:
    admin_email = os.getenv("ADMIN_EMAIL", "admin@school.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "Admin@12345")
    admin_name = os.getenv("ADMIN_NAME", "Registrar Admin")

    db: Session = SessionLocal()
    try:
        existing_admin = crud.get_user_by_email(db, admin_email)
        if existing_admin is None:
            admin_user = schemas.UserCreate(
                name=admin_name,
                email=admin_email,
                password=admin_password,
                role="admin",
            )
            crud.create_user(db, admin_user, hash_password(admin_password))
    finally:
        db.close()


seed_admin_user()


@app.get("/")
def home():
    return {"message": "Student CRUD API is running"}



# from fastapi import FastAPI,Depends

# #getting the interface for database connection from created database module
# from database import engine,get_db

# #getting the objects created using sqlachemy in models module
# from models import Base,Student
# from sqlalchemy.orm import Session
# from schemas import StudentCreate,StudentResponse
# from fastapi import HTTPException

# Base.metadata.create_all(bind=engine)
# app=FastAPI()



# @app.get("/students",response_model=list[StudentResponse])
# def get_students(db:Session=Depends(get_db)):
#     students=db.query(Student).all()
#     return students


#   # #quering data
#   # db.query(Student).all()
#   # db.query(Student).filter(Student.id==1).first()

# @app.get("/students/{student_id}",response_model=StudentResponse)
# def get_student(student_id:int,db:Session=Depends(get_db)):
#     student=db.query(Student).filter(Student.id==student_id).first()
#     if student is None:
#         raise HTTPException(status_code=404,detail="Student not found")
#     return student

 
  

# @app.post("/students",response_model=StudentResponse)
# def create_student(student:StudentCreate,db:Session=Depends(get_db)):
#     # Check if email already exists
#     existing_student = db.query(Student).filter(Student.email == student.email).first()

#     if existing_student:
#         raise HTTPException(
#             status_code=409,
#             detail="Email already exists"
#         )

#     new_student=Student(
#         name=student.name,
#         email=student.email,
#         age=student.age,
#         course=student.course,
#     )

#     db.add(new_student)
#     db.commit()
#     db.refresh(new_student)

#     return new_student 





# # Updating records: Load a record, modify its attributes, commit the transaction, and refresh the object.
# @app.put("/students/{student_id}",response_model=StudentResponse)
# def update_student(
#       student_id:int,
#       student:StudentCreate,
#       db:Session=Depends(get_db)
#  ):
    
#     db_student=db.query(Student).filter(Student.id==student_id).first()
#     if db_student is None:
#         raise HTTPException(status_code=404,detail="Student not found")


#     # Check if email belongs to another student
#     existing_student = (
#         db.query(Student)
#         .filter(Student.email == student.email, Student.id != student_id)
#         .first()
#     ) 
#     if existing_student:
#         raise HTTPException(
#             status_code=409,
#             detail="Email already exists"
#         )
    
#     db_student.name=student.name
#     db_student.email=student.email
#     db_student.age=student.age
#     db_student.course=student.course

#     db.commit()
#     db.refresh(db_student)

#     return db_student





# @app.delete("/students/{student_id}")
# def delete_student(
#         student_id:int,
#         db:Session=Depends(get_db)
#     ):
    
#      student=db.query(Student).filter(Student.id==student_id).first()

#      if student is None:
#         raise HTTPException(status_code=404,detail="Student not found")
    
#      db.delete(student)
#      db.commit()
 
#      return{"message":"Student deleted successfully"}


