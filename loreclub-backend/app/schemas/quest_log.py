from pydantic import BaseModel, ConfigDict

class QuestLogBase(BaseModel):
    """
    Schema base para o Relatório da Missão.
    """
    report: str

class QuestLogCreate(QuestLogBase):
    """
    Schema para criação do Relatório (associado a uma quest_id).
    """
    quest_id: int

class QuestLog(QuestLogBase):
    """
    Schema para leitura do Relatório (retornado pela API).
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    quest_id: int

