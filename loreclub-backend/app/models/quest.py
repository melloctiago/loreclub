
from sqlalchemy import Column, Enum, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.utils.enums import QuestStatus

# Tabela de Associação Many-to-Many (Heroi <-> Missão)
quest_heroes_association = Table(
    'quest_heroes',
    Base.metadata,
    Column('hero_id', Integer, ForeignKey('hero.id'), primary_key=True),
    Column('quest_id', Integer, ForeignKey('quest.id'), primary_key=True)
)

class Quest(Base):
    """
    Modelo da Missão (Card do Kanban).
    """
    __tablename__ = "quest"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    xp_reward = Column(Integer, default=10)
    coin_reward = Column(Integer, default=5)
    difficulty = Column(String(50), default="Easy")
    
    # Usa o Enum para garantir que os status sejam controlados
    status = Column(Enum(QuestStatus), nullable=False, default=QuestStatus.QUEST_BOARD)

    # Chave estrangeira para o Quadro (GuildBoard)
    guild_board_id = Column(Integer, ForeignKey("guild_board.id"), nullable=False)

    # Relacionamento de volta para o Quadro
    board = relationship("GuildBoard", back_populates="quests")

    # Relacionamento Many-to-Many com Herois
    heroes = relationship(
        "Hero",
        secondary=quest_heroes_association,
        back_populates="quests"
    )

    # Relacionamento One-to-One com o Relatório da Missão
    log = relationship(
        "QuestLog",
        back_populates="quest",
        uselist=False,
        cascade="all, delete-orphan"
    )
