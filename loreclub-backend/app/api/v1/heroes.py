
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.core.security import get_password_hash
from app.models import Hero
from app.schemas.hero import Hero as HeroSchema, HeroCreate

router = APIRouter()

@router.post("/", response_model=HeroSchema, status_code=status.HTTP_201_CREATED)
def create_hero(
    *,
    db: Session = Depends(deps.get_db),
    hero_in: HeroCreate
):
    """
    Cria um novo Herói (Usuário/Cadastro).
    """
    db_hero = db.query(Hero).filter(Hero.username == hero_in.username).first()
    if db_hero:
        raise HTTPException(
            status_code=400,
            detail="Este nome de usuário já está em uso."
        )
    
    db_hero_email = db.query(Hero).filter(Hero.email == hero_in.email).first()
    if db_hero_email:
        raise HTTPException(
            status_code=400,
            detail="Este email já está cadastrado."
        )

    hashed_password = get_password_hash(hero_in.password)
    db_hero = Hero(
        username=hero_in.username,
        email=hero_in.email,
        hashed_password=hashed_password
    )
    
    db.add(db_hero)
    db.commit()
    db.refresh(db_hero)
    
    return db_hero

@router.get("/me", response_model=HeroSchema)
def read_hero_me(
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Retorna os dados do Herói atualmente logado.
    """
    return current_hero

@router.get("/leaderboard", response_model=list[HeroSchema])
def get_leaderboard(
    db: Session = Depends(deps.get_db),
    limit: int = 10
):
    """
    Retorna o ranking dos heróis com mais XP.
    """
    heroes = db.query(Hero).order_by(Hero.xp.desc()).limit(limit).all()
    return heroes
