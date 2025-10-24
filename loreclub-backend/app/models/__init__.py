
# Importa a Base e os modelos para facilitar o acesso
from app.database import Base
from .hero import Hero
from .guild_board import GuildBoard
from .quest import Quest, quest_heroes_association
from .quest_log import QuestLog
