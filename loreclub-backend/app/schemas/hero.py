from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class HeroBase(BaseModel):
    """
    Schema base para o Herói (Usuário).
    """
    username: str
    email: EmailStr

class HeroCreate(HeroBase):
    """
    Schema para criação de Herói (requer senha).
    """
    password: str

class Hero(HeroBase):
    """
    Schema para leitura de Herói (retornado pela API).
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    
    # Gamification
    level: int
    xp: int
    coins: int
    title: Optional[str] = None
    
    quests: List["QuestBase"] = [] 

# Schemas para Autenticação (Token JWT)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


