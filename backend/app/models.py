#creating the student model

from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy import String,Integer

from .database import Base

class Student(Base):
    __tablename__="students"
   
    id:Mapped[int]=mapped_column(primary_key=True,index=True)
    name:Mapped[str]=mapped_column(String(100))
    email:Mapped[str]=mapped_column(String(100),unique=True)
    age:Mapped[int]=mapped_column(Integer)
    course:Mapped[str]=mapped_column(String(100))

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column("user_role", String(20), default="student")

from sqlalchemy import Date, ForeignKey, UniqueConstraint
from datetime import date as date_type

class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("student_id", "date", name="unique_student_date"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    date: Mapped[date_type] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(10))


class Marks(Base):
    __tablename__ = "marks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    subject: Mapped[str] = mapped_column(String(50))
    marks: Mapped[int] = mapped_column(Integer)
    
# a model is a python class that represents a database table
#an object represents one row in the table
