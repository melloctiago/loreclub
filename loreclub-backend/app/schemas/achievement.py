from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class AchievementBase(BaseModel):
    title: str
    flavor_text: Optional[str] = None
    icon: str = '⚔️'
    objective_type: str
    objective_value: Optional[int] = None


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    flavor_text: Optional[str] = None
    icon: Optional[str] = None
    objective_type: Optional[str] = None
    objective_value: Optional[int] = None


class AchievementInDBBase(AchievementBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Achievement(AchievementInDBBase):
    pass


class AchievementWithStatus(Achievement):
    unlocked: bool = False
    unlocked_date: Optional[datetime] = None
