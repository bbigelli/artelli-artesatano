from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.dependencies import get_current_active_user, get_current_admin

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Nome de usuário já em uso")
    return crud.create_user(db, user)


@router.get("/me", response_model=schemas.UserResponse)
def get_profile(current_user=Depends(get_current_active_user)):
    return current_user


@router.put("/me", response_model=schemas.UserResponse)
def update_profile(
    update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return crud.update_user(db, current_user.id, update)


# ─── Admin routes ─────────────────────────────────────────────────────────────

@router.get("/", response_model=list[schemas.UserList])
def list_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    return crud.get_users(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.put("/{user_id}", response_model=schemas.UserResponse)
def admin_update(
    user_id: int,
    update: schemas.AdminUserUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    user = crud.admin_update_user(db, user_id, update)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Você não pode excluir sua própria conta")
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
