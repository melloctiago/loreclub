
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Configurações da aplicação, carregadas das variáveis de ambiente (.env).
    """
    # URL do Banco de Dados
    DATABASE_URL: str
    
    # Configurações do JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # Prefixo da API
    API_V1_STR: str = "/api/v1"

    class Config:
        # Define o arquivo .env a ser lido
        env_file = ".env"

settings = Settings()
