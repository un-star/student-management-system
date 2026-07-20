# from pydantic import BaseModel,EmailStr ,Field

# class StudentCreate(BaseModel):
#      name:str =Field(...,min_length=2)
#      email:EmailStr 
#      age:int    =Field(...,gt=0)
#      course:str  =Field(...,min_length=2)

# class StudentResponse(StudentCreate):
#      id:int

#      model_config={
#           "from_attributes":True
#      }

# #field is used for request validation for the attributes in db

from pydantic import BaseModel, Field, EmailStr


class StudentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    age: int = Field(..., gt=0, lt=100)
    course: str = Field(..., min_length=2)


class StudentCreate(StudentBase):
    pass


class StudentUpdate(StudentBase):
    pass


class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

#--Auth schemas--

class UserCreate(BaseModel):
    name: str=Field(...,min_length=2,max_length=50)
    email:str
    password:str=Field(...,min_length=6)
    role:str=Field(default="student",pattern="^(admin|student)$")

class UserResponse(BaseModel):
    id:int
    name:str
    email:str
    role:str
    
    class Config:
        from_attributes=True

class UserLogin(BaseModel):
    email:str
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str="bearer"

class TokenData(BaseModel):
    email:str|None=None
    role:str|None=None
