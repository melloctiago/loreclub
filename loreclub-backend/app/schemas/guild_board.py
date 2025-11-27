from typing import List
from pydantic import BaseModel, ConfigDict


class GuildBoardBase(BaseModel):
    """
    Schema base para o Quadro (Board).
    """
    name: str

class GuildBoardCreate(GuildBoardBase):
    """
    Schema para criação do Quadro.
    """
    pass

class GuildBoardSimple(GuildBoardBase):
    """
    Schema simples para leitura do Quadro (apenas id e name).
    Usado para listas de guilds.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int | None = None

class GuildBoard(GuildBoardBase):
    """
    Schema para leitura do Quadro (retornado pela API).
    """
    model_config = ConfigDict(from_attributes=True)

    id: int

    owner_id: int | None = None

    quests: List["Quest"] = []

