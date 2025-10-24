from fastapi import APIRouter
from . import auth, heroes, guild_boards, quests

api_router = APIRouter()

#Rotas
api_router.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
api_router.include_router(heroes.router, prefix="/heroes", tags=["Heróis (Usuários)"])
api_router.include_router(guild_boards.router, prefix="/guild-boards", tags=["Quadros (Boards)"])
api_router.include_router(quests.router, prefix="/quests", tags=["Missões (Cards)"])
