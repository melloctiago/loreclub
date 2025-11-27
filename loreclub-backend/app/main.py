# ====================================================================
# PONTO CHAVE DA CORREÇÃO FINAL:
# 1. Importamos TODAS as classes de schema necessárias (Hero, HeroBase, 
#    Quest, QuestBase, etc.) para o escopo global deste arquivo (main.py).
# ====================================================================
from app.schemas.hero import Hero, HeroBase
from app.schemas.quest import Quest, QuestBase
from app.schemas.guild_board import GuildBoard
# (Não precisamos importar QuestLog ou Token, pois eles não são 
# referenciados por strings em outros modelos)

# ====================================================================
# 2. AGORA que Hero, QuestBase, etc., estão todos no mesmo "ambiente",
#    as chamadas model_rebuild() funcionarão, pois o Pydantic
#    encontrará as classes que ele procura.
# ====================================================================
Hero.model_rebuild()
Quest.model_rebuild()
GuildBoard.model_rebuild()

# 3. Agora podemos importar o FastAPI e o resto do aplicativo.
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
    allow_origins=["*"],  # Permitir todas as origens em dev (ajuste para produção)
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

