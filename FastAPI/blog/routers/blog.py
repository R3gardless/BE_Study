from typing import List
from fastapi import APIRouter, Depends, status
from .. import schemas, database, models
from sqlalchemy.orm import Session
from ..db_func import db_blog
from ..oauth2 import get_current_user

router = APIRouter(
    prefix='/blog',
    tags=['Blogs']
)

get_db = database.get_db

@router.get('/', status_code=status.HTTP_200_OK, response_model=List[schemas.ShowBlog])
def all(db : Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_user)):
    return db_blog.all_blogs(db)
    

@router.post('/', status_code= status.HTTP_201_CREATED)
def create(request : schemas.Blog, db : Session = Depends(get_db)
        ,current_user: schemas.User = Depends(get_current_user)):
    return db_blog.create_blog(request, db)

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id, db : Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_user)):
    return db_blog.del_blog(id, db)


@router.put('/{id}',status_code= status.HTTP_202_ACCEPTED)
def update(id, request : schemas.Blog, db : Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_user)):
    return db_blog.update_blog(id, request, db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog)
def blog(id, db : Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_user)):
    return db_blog.get_blog(id, db)
