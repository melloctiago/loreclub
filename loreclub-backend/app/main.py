
from app.schemas.hero import Hero, HeroBase
from app.schemas.quest import Quest, QuestBase
from app.schemas.guild_board import GuildBoard

# Ensure Pydantic models are registered before app startup
Hero.model_rebuild()
Quest.model_rebuild()
GuildBoard.model_rebuild()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="LoreClub API",
    description="Backend da plataforma de missões LoreClub",
    version="0.1.0"
)

# Configuração do CORS para permitir o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui o roteador principal da API v1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
async def root():
    """
    Endpoint principal da API.
    """
    return {"message": "Bem-vindo à API do LoreClub! Acesse /docs para a documentação."}

