from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Achievement(Base):
    """
    Modelo de Conquista (Achievement).
    Define conquistas que podem ser desbloqueadas pelos heróis.
    """
    __tablename__ = "achievement"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    flavor_text = Column(Text, nullable=True)
    icon = Column(String(10), nullable=False, default='⚔️')
    
    objective_type = Column(String(100), nullable=False)
    objective_value = Column(Integer, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
