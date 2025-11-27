from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database import SessionLocal
from app.models.achievement import Achievement as AchievementModel
from app.models.hero_achievement import HeroAchievement
from app.models.hero import Hero
from app.models.quest import Quest
from app.models.guild_board import GuildBoard
from app.schemas.achievement import Achievement, AchievementCreate, AchievementWithStatus
from app.utils.enums import QuestStatus
from app.api import deps

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/', response_model=List[Achievement])
def list_achievements(db: Session = Depends(get_db)):
    achievements = db.query(AchievementModel).order_by(AchievementModel.id.asc()).all()
    return achievements


@router.get('/me', response_model=List[AchievementWithStatus])
def list_achievements_for_current_hero(
    current_hero: Hero = Depends(deps.get_current_active_hero),
    db: Session = Depends(get_db)
):
    achievements = db.query(AchievementModel).order_by(AchievementModel.id.asc()).all()
    
    results = []
    for achievement in achievements:
        unlocked = False
        objective_type = (achievement.objective_type or '').lower()
        objective_value = achievement.objective_value or 0

        if objective_type == 'earn_coins':
            unlocked = (current_hero.coins or 0) >= objective_value
        elif objective_type == 'reach_level':
            unlocked = (current_hero.level or 0) >= objective_value
        elif objective_type == 'complete_quests':
            count = db.query(func.count(Quest.id)).join(Quest.heroes).filter(
                Hero.id == current_hero.id,
                Quest.status == QuestStatus.COMPLETED
            ).scalar() or 0
            unlocked = count >= objective_value
        elif objective_type == 'complete_hard_quest':
            count = db.query(func.count(Quest.id)).join(Quest.heroes).filter(
                Hero.id == current_hero.id,
                Quest.status == QuestStatus.COMPLETED,
                Quest.difficulty.ilike('%hard%')
            ).scalar() or 0
            unlocked = count >= objective_value
        elif objective_type == 'complete_epic_quest':
            count = db.query(func.count(Quest.id)).join(Quest.heroes).filter(
                Hero.id == current_hero.id,
                Quest.status == QuestStatus.COMPLETED,
                Quest.difficulty.ilike('%epic%')
            ).scalar() or 0
            unlocked = count >= objective_value

        existing_unlock = db.query(HeroAchievement).filter(
            HeroAchievement.hero_id == current_hero.id,
            HeroAchievement.achievement_id == achievement.id
        ).first()

        if existing_unlock:
            unlocked = True
            unlocked_date = existing_unlock.unlocked_at
        else:
            unlocked_date = None

        if unlocked and not existing_unlock:
            new_unlock = HeroAchievement(
                hero_id=current_hero.id,
                achievement_id=achievement.id
            )
            db.add(new_unlock)
            db.commit()
            db.refresh(new_unlock)
            unlocked_date = new_unlock.unlocked_at

        results.append({
            'id': achievement.id,
            'title': achievement.title,
            'flavor_text': achievement.flavor_text,
            'icon': achievement.icon,
            'objective_type': achievement.objective_type,
            'objective_value': achievement.objective_value,
            'created_at': achievement.created_at,
            'updated_at': achievement.updated_at,
            'unlocked': unlocked,
            'unlocked_date': unlocked_date
        })

    return results


@router.post('/', response_model=Achievement, status_code=status.HTTP_201_CREATED)
def create_achievement(
    payload: AchievementCreate,
    db: Session = Depends(get_db)
):
    """Cria uma nova conquista."""
    achievement = AchievementModel(
        title=payload.title,
        flavor_text=payload.flavor_text,
        icon=payload.icon,
        objective_type=payload.objective_type,
        objective_value=payload.objective_value
    )
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement


@router.delete('/{achievement_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    """Deleta uma conquista."""
    achievement = db.query(AchievementModel).filter(
        AchievementModel.id == achievement_id
    ).first()
    if not achievement:
        raise HTTPException(status_code=404, detail='Conquista não encontrada')
    db.delete(achievement)
    db.commit()
    return None


@router.post('/{achievement_id}/unlock', status_code=status.HTTP_201_CREATED)
def unlock_achievement(
    achievement_id: int,
    current_hero: Hero = Depends(deps.get_current_active_hero),
    db: Session = Depends(get_db)
):
    """Desbloqueia manualmente uma conquista para o usuário atual."""
    achievement = db.query(AchievementModel).filter(
        AchievementModel.id == achievement_id
    ).first()
    if not achievement:
        raise HTTPException(status_code=404, detail='Conquista não encontrada')
    
    existing = db.query(HeroAchievement).filter(
        HeroAchievement.hero_id == current_hero.id,
        HeroAchievement.achievement_id == achievement_id
    ).first()
    
    if existing:
        return existing
    
    unlock = HeroAchievement(
        hero_id=current_hero.id,
        achievement_id=achievement_id
    )
    db.add(unlock)
    db.commit()
    db.refresh(unlock)
    return unlock


@router.delete('/{achievement_id}/unlock', status_code=status.HTTP_204_NO_CONTENT)
def remove_unlock(
    achievement_id: int,
    current_hero: Hero = Depends(deps.get_current_active_hero),
    db: Session = Depends(get_db)
):
    """Remove o desbloqueio de uma conquista para o usuário atual."""
    unlock = db.query(HeroAchievement).filter(
        HeroAchievement.hero_id == current_hero.id,
        HeroAchievement.achievement_id == achievement_id
    ).first()
    if not unlock:
        raise HTTPException(status_code=404, detail='Desbloqueio não encontrado')
    db.delete(unlock)
    db.commit()
    return None
