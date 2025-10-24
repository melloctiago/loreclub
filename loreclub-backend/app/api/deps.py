
from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.core.config import settings
from app.core import security
from app.models import Hero
from app.schemas.hero import TokenData

# Define o esquema de autenticação OAuth2
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token"
)

def get_db() -> Generator:
    """
    Dependência para obter uma sessão do banco de dados.
    Garante que a sessão seja fechada após a requisição.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_hero(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> Hero:
    """
    Dependência para obter o usuário (Heroi) atual logado.
    Valida o token JWT.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except (JWTError, ValidationError):
        raise credentials_exception
    
    # Busca o herói no banco de dados
    hero = db.query(Hero).filter(Hero.username == token_data.username).first()
    if hero is None:
        raise credentials_exception
    
    return hero

def get_current_active_hero(
    current_hero: Hero = Depends(get_current_hero)
) -> Hero:
    """
    Dependência que verifica se o usuário logado está ativo.
    """
    if not current_hero.is_active:
        raise HTTPException(status_code=400, detail="Herói inativo")
    return current_hero
