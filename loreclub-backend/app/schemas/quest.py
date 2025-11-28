from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.utils.enums import QuestStatus


from .quest_log import QuestLogBase

class QuestBase(BaseModel):
    """
    Schema base para a Missão (Card).
    """
    title: str
    description: Optional[str] = None
    status: QuestStatus = QuestStatus.QUEST_BOARD
    
    xp_reward: int = 10
    coin_reward: int = 5
    difficulty: str = "Easy"

class QuestCreate(QuestBase):
    """
    Schema para criação de Missão.
    """
    guild_board_id: int

class QuestUpdate(BaseModel):
    """
    Schema para atualização da Missão (campos opcionais).
    """
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[QuestStatus] = None

class QuestReport(BaseModel):
    """
    Schema para submeter o relatório da missão.
    """
    report: str

class Quest(QuestBase):
    """
    Schema para leitura da Missão (retornado pela API).
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    guild_board_id: int

    heroes: List["HeroBase"] = []
    log: Optional[QuestLogBase] = None


