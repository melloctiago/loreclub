
from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database import Base

class QuestLog(Base):
    """
    Modelo do Relatório da Missão (Log).
    Associado a uma missão.
    """
    __tablename__ = "quest_log"

    id = Column(Integer, primary_key=True, index=True)
    report = Column(Text, nullable=False)

    # Chave estrangeira para a Missão (One-to-One)
    # unique=True garante que um log só pertença a uma missão
    quest_id = Column(Integer, ForeignKey("quest.id"), unique=True, nullable=False)

    # Relacionamento de volta para a Missão
    quest = relationship("Quest", back_populates="log")
