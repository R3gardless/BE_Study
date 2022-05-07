from typing import List
from fastapi import APIRouter, Depends
from .. import schemas, database, models
from sqlalchemy.orm import Session
from ..db_func import db_user

router = APIRouter(
    prefix="/user",
    tags=['Users']
)

get_db = database.get_db

@router.post('/')
def create_user(request: schemas.User, db : Session = Depends(get_db)):
    return db_user.create(request, db)

@router.get('/{id}', response_model = schemas.ShowUser)
def get_user(id: int, db : Session = Depends(get_db)):
    return db_user.get(id, db)
