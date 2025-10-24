
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.schemas.hero import Token
from app.models import Hero

router = APIRouter()

def authenticate_hero(db: Session, username: str, password: str) -> Hero | None:
    """
    Busca e autentica um herói.
    """
    hero = db.query(Hero).filter(Hero.username == username).first()
    if not hero:
        return None
    if not security.verify_password(password, hero.hashed_password):
        return None
    return hero

@router.post("/token", response_model=Token)
def login_for_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Endpoint de login. Recebe usuário e senha, retorna um Token JWT.
    """
    print("-" * 20)
    print(f"Tentativa de Login Recebida:")
    print(f"  Username recebido do form: '{form_data.username}'")
    print(f"  Password recebido do form: '{form_data.password}'")
    print("-" * 20)

    hero = authenticate_hero(db, form_data.username, form_data.password)
    if not hero:
        print(f"!!! Falha na autenticação para username: '{form_data.username}'")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": hero.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
