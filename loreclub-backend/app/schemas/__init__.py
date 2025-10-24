# Importa todos os schemas
from .hero import Hero, HeroBase, HeroCreate, Token, TokenData
from .quest import Quest, QuestBase, QuestCreate, QuestUpdate, QuestReport
from .guild_board import GuildBoard, GuildBoardBase, GuildBoardCreate
from .quest_log import QuestLog, QuestLogBase, QuestLogCreate

# REMOVEMOS as chamadas model_rebuild() daqui.
# Elas agora estão em app/main.py para garantir
# que executem antes da inicialização do FastAPI.

# Opcional: Define o que é exportado quando alguém faz "from app.schemas import *"
__all__ = [
    "Hero", "HeroBase", "HeroCreate", "Token", "TokenData",
    "Quest", "QuestBase", "QuestCreate", "QuestUpdate", "QuestReport",
    "GuildBoard", "GuildBoardBase", "GuildBoardCreate",
    "QuestLog", "QuestLogBase", "QuestLogCreate"
]

