import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:rot@localhost:5432/student_db",
)

#database connection
#the engine is sqlalchemy's interface to database 
engine= create_engine(DATABASE_URL)

#session configuration
SessionLocal= sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)

#session dependency
from typing import Generator
def get_db()->Generator:
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
#fastapi use this dependency to provide a session to each request and automatically close it afterward

class Base(DeclarativeBase):
    pass
