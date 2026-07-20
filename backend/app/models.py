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


# a model is a python class that represents a database table
#an object represents one row in the table
