from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud
from app.auth import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    exc = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não autenticado", headers={"WWW-Authenticate": "Bearer"})
    username = decode_token(token)
    if not username: raise exc
    user = crud.get_user_by_username(db, username)
    if not user: raise exc
    return user


def get_current_active_user(current_user=Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Conta desativada")
    return current_user


def get_current_admin(current_user=Depends(get_current_active_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso restrito a administradores")
    return current_user
