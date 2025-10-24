
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Cria a engine do SQLAlchemy usando a URL do banco de dados
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

# Cria uma sessão local (SessionLocal)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos declarativos
Base = declarative_base()
