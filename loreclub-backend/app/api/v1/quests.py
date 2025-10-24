from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models import Hero, Quest, QuestLog, GuildBoard
from app.schemas.quest import Quest as QuestSchema, QuestCreate, QuestUpdate, QuestReport
from app.utils.enums import QuestStatus

router = APIRouter()

@router.get("/my-quests", response_model=List[QuestSchema])
def get_my_quests(
    *,
    db: Session = Depends(deps.get_db),
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Retorna todas as missões (quests) vinculadas ao herói logado.
    """
    # Busca todas as quests onde o herói atual está atribuído
    quests = db.query(Quest).filter(Quest.heroes.contains(current_hero)).all()
    return quests


@router.get("/my-boards-with-quests")
def get_my_boards_with_quests(
    *,
    db: Session = Depends(deps.get_db),
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Retorna os quadros organizados por status (QUEST_BOARD, IN_PROGRESS, COMPLETED)
    contendo apenas as quests do herói logado.
    
    Formato de retorno otimizado para o Kanban do frontend.
    """
    # Busca todas as quests do herói logado
    my_quests = db.query(Quest).filter(Quest.heroes.contains(current_hero)).all()
    
    # Organiza as quests por status para o formato do Kanban
    kanban_data = {
        "quest-board": {
            "id": "quest-board",
            "title": "Quadro de Missões",
            "status": "QUEST_BOARD",
            "quests": []
        },
        "in-progress": {
            "id": "in-progress",
            "title": "Em Andamento",
            "status": "IN_PROGRESS",
            "quests": []
        },
        "completed": {
            "id": "completed",
            "title": "Concluídas",
            "status": "COMPLETED",
            "quests": []
        }
    }
    
    # Distribui as quests nas colunas corretas
    for quest in my_quests:
        quest_data = {
            "id": str(quest.id),
            "title": quest.title,
            "description": quest.description,
            "status": quest.status.value,
            "guild_board_id": quest.guild_board_id
        }
        
        if quest.status == QuestStatus.QUEST_BOARD:
            kanban_data["quest-board"]["quests"].append(quest_data)
        elif quest.status == QuestStatus.IN_PROGRESS:
            kanban_data["in-progress"]["quests"].append(quest_data)
        elif quest.status == QuestStatus.COMPLETED:
            kanban_data["completed"]["quests"].append(quest_data)
    
    return kanban_data


@router.post("/", response_model=QuestSchema, status_code=status.HTTP_201_CREATED)
def create_quest(
    *,
    db: Session = Depends(deps.get_db),
    quest_in: QuestCreate,
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Cria uma nova Missão (Card) e automaticamente atribui o criador a ela.
    """
    db_quest = Quest(**quest_in.model_dump())
    
    # Atribui automaticamente o herói criador à missão
    db_quest.heroes.append(current_hero)
    
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)
    return db_quest


@router.get("/{quest_id}", response_model=QuestSchema)
def get_quest(
    *,
    db: Session = Depends(deps.get_db),
    quest_id: int,
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Busca uma missão específica pelo ID.
    """
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Missão não encontrada")
    
    # Verifica se o herói está atribuído à missão
    if current_hero not in quest.heroes:
        raise HTTPException(status_code=403, detail="Você não tem permissão para ver esta missão")
        
    return quest


@router.put("/{quest_id}", response_model=QuestSchema)
def update_quest(
    *,
    db: Session = Depends(deps.get_db),
    quest_id: int,
    quest_in: QuestUpdate,
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Atualiza uma Missão (Ex: mudar título, descrição ou status - o 'arrastar' no Kanban).
    """
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Missão não encontrada")
    
    # Verifica se o herói está na missão
    if current_hero not in quest.heroes:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar esta missão")
    
    update_data = quest_in.model_dump(exclude_unset=True)
    
    # Regra de Negócio: Se mover para "Concluída", verificar se existe relatório
    if update_data.get("status") == QuestStatus.COMPLETED and not quest.log:
        raise HTTPException(
            status_code=400,
            detail="Não é possível concluir a missão sem um relatório. Adicione o relatório primeiro."
        )

    for field, value in update_data.items():
        setattr(quest, field, value)
        
    db.add(quest)
    db.commit()
    db.refresh(quest)
    return quest


@router.post("/{quest_id}/assign/{hero_id}", response_model=QuestSchema)
def assign_hero_to_quest(
    *,
    db: Session = Depends(deps.get_db),
    quest_id: int,
    hero_id: int,
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Atribui um Herói (usuário) a uma Missão.
    """
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Missão não encontrada")

    hero = db.query(Hero).filter(Hero.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Herói não encontrado")
    
    if hero in quest.heroes:
        raise HTTPException(status_code=400, detail="Herói já está na missão")

    quest.heroes.append(hero)
    db.commit()
    db.refresh(quest)
    return quest


@router.post("/{quest_id}/report", response_model=QuestSchema)
def add_quest_report(
    *,
    db: Session = Depends(deps.get_db),
    quest_id: int,
    report_in: QuestReport,
    current_hero: Hero = Depends(deps.get_current_active_hero)
):
    """
    Adiciona ou atualiza o 'Relatório da Missão' antes da conclusão.
    """
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Missão não encontrada")
    
    # Regra: Só pode adicionar relatório se a missão estiver "Em Andamento"
    if quest.status != QuestStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=400,
            detail="O relatório só pode ser adicionado em missões 'Em Andamento'"
        )
    
    # Regra: Só heróis da missão podem adicionar o relatório
    if current_hero not in quest.heroes:
        raise HTTPException(
            status_code=403,
            detail="Você não faz parte desta missão para adicionar um relatório"
        )
    
    # Se o log já existe, atualiza. Se não vai cria.
    if quest.log:
        quest.log.report = report_in.report
    else:
        quest.log = QuestLog(report=report_in.report, quest_id=quest.id)
        
    db.add(quest.log)
    db.commit()
    db.refresh(quest)
    return quest