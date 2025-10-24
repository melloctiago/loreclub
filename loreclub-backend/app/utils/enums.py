
import enum

class QuestStatus(str, enum.Enum):
    """
    Define os status possíveis para uma Missão (Card).
    Estes correspondem às colunas do Kanban.
    """
    QUEST_BOARD = "Quadro de Missões"
    IN_PROGRESS = "Em Andamento"
    COMPLETED = "Missões Concluídas"
