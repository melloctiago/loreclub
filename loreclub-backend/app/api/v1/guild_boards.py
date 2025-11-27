
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models import GuildBoard, Hero
from app.schemas.guild_board import GuildBoard as GuildBoardSchema, GuildBoardCreate, GuildBoardSimple

router = APIRouter()

@router.post("/", response_model=GuildBoardSchema, status_code=status.HTTP_201_CREATED)
def create_guild_board(
    *,
    db: Session = Depends(deps.get_db),
    board_in: GuildBoardCreate,
    current_hero: Hero = Depends(deps.get_current_active_hero) # Apenas logados podem criar
):
    """
    Cria um novo Quadro (Board) para organizar as missões.
    """
    # Count how many guilds this hero already created (owner_id)
    owned_count = db.query(GuildBoard).filter(GuildBoard.owner_id == current_hero.id).count()

    # First two guilds are free
    if owned_count >= 2:
        cost = 100
        if (current_hero.coins or 0) < cost:
            raise HTTPException(status_code=400, detail="Saldo insuficiente para criar nova guilda. São necessárias 100 moedinhas.")
        # Deduct coins
        current_hero.coins = (current_hero.coins or 0) - cost

    db_board = GuildBoard(name=board_in.name, owner_id=current_hero.id)
    db.add(db_board)
    db.add(current_hero)  # Ensure hero changes are persisted
    db.commit()
    db.refresh(db_board)
    db.refresh(current_hero)  # Refresh hero to get updated coins
    return db_board

@router.get("/", response_model=List[GuildBoardSimple])
def get_all_guild_boards(
    db: Session = Depends(deps.get_db),
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Lista todos os Quadros (sem as missões).
    Retorna apenas id e name para uso em dropdowns.
    """
    # A consulta já carrega os quadros
    boards = db.query(GuildBoard).all()
    
    return boards
