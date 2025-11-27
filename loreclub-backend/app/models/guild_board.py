
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base

class GuildBoard(Base):
    """
    Modelo do Quadro (Board) que contém as missões.
    """
    __tablename__ = "guild_board"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)

    # Relacionamento One-to-Many com Missões
    # Um quadro pode ter várias missões
    quests = relationship(
        "Quest",
        back_populates="board",
        cascade="all, delete-orphan"
    )

