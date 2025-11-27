
from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.quest import quest_heroes_association

class Hero(Base):
    """
    Modelo do Usuário (Heroi).
    """
    __tablename__ = "hero"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    # Gamification
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    coins = Column(Integer, default=0)
    title = Column(String(100), nullable=True)

    # Relacionamento Many-to-Many com Missões (Quests)
    # Um herói pode participar de várias missões
    quests = relationship(
        "Quest",
        secondary=quest_heroes_association,
        back_populates="heroes"
    )
