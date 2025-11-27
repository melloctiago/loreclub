from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func

from app.database import Base


class HeroAchievement(Base):
    """
    Tabela de associação entre Hero e Achievement (conquistas desbloqueadas).
    """
    __tablename__ = "hero_achievement"

    id = Column(Integer, primary_key=True, index=True)
    hero_id = Column(Integer, ForeignKey("hero.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievement.id"), nullable=False)
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint('hero_id', 'achievement_id', name='unique_hero_achievement'),
    )
