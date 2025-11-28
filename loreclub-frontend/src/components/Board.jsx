import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useAuth } from '../context/AuthContext';
import { apiGetBoards, apiCreateQuest, apiUpdateQuest, apiCreateGuildBoard, apiGetGuildBoards, apiGetBoardsByGuild, apiAddQuestReport } from '../lib/api';
import KanbanColumn from './KanbanColumn';
import Button from './Button';
import CreateGuildModal from './CreateGuildModal';
import ReportModal from './ReportModal';
import UserMenu from './UserMenu';
import AchievementsModal from './AchievementsModal';

// Mapa de tradução dos status (apenas para exibição quando necessário)
const statusMap = {
    'QUEST_BOARD': 'Quadro de Missões',
    'IN_PROGRESS': 'Em Andamento',
    'COMPLETED': 'Missões Concluídas'
};

const Board = () => {
    const { user, logout, refreshUser } = useAuth();
    const [columns, setColumns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreatingGuild, setIsCreatingGuild] = useState(false);
    const [currentGuild, setCurrentGuild] = useState(null);
    const [availableGuilds, setAvailableGuilds] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [pendingCompletion, setPendingCompletion] = useState(null); // { questId }
    const [showAchievementsModal, setShowAchievementsModal] = useState(false);

    // Armazena o estado das colunas antes de um drag-and-drop
    // Útil para reverter em caso de falha na API
    const [originalColumns, setOriginalColumns] = useState(null);

    // Carrega os dados do Kanban
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Busca os dados da guilda padrão
                const data = await apiGetBoards();
                console.log('Dados do Kanban recebidos:', data);
                setColumns(data);
                setOriginalColumns(data); // Armazena o estado original
                
                // Extrai informações da guilda se estiverem disponíveis
                if (data.guild) {
                    console.log('Guilda encontrada:', data.guild);
                    setCurrentGuild(data.guild);
                } else {
                    console.log('Nenhuma guilda encontrada nos dados');
                }
                
                // Busca todas as guilds disponíveis
                try {
                    const guilds = await apiGetGuildBoards();
                    console.log('Guilds disponíveis:', guilds);
                    if (Array.isArray(guilds)) {
                        setAvailableGuilds(guilds);
                        if (!data.guild && guilds.length > 0) {
                            const defaultGuild = guilds[0];
                            setCurrentGuild(defaultGuild);
                            try {
                                const guildBoards = await apiGetBoardsByGuild(defaultGuild.id);
                                setColumns(guildBoards);
                                setOriginalColumns(guildBoards);
                            } catch (err) {
                                console.error('Erro ao carregar boards da guilda padrão:', err);
                            }
                        }
                    } else {
                        console.error('Guilds não é um array:', guilds);
                        setAvailableGuilds([]);
                    }
                } catch (err) {
                    console.error('Erro ao buscar guilds disponíveis:', err);
                    setAvailableGuilds([]);
                }
            } catch (err) {
                console.error('Erro ao carregar boards:', err);
                setError('Falha ao carregar as missões. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChangeGuild = async (guildId) => {
        try {
            setLoading(true);
            const data = await apiGetBoardsByGuild(parseInt(guildId));
            console.log('Boards da guilda:', data);
            setColumns(data);
            setOriginalColumns(data);
            
            if (data.guild) {
                setCurrentGuild(data.guild);
            }
        } catch (err) {
            console.error('Erro ao mudar de guilda:', err);
            alert('Erro ao carregar a guilda selecionada');
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuest = async (columnId, newQuestTitle, newQuestDesc = '', difficulty = 'Easy', xpReward = 10, coinReward = 5) => {
        if (!newQuestTitle || !newQuestTitle.trim()) return;

        try {
                // Usa a chave de status da coluna (ex: 'QUEST_BOARD')
                const statusKey = columns[columnId].status;
                const statusValue = statusMap[statusKey]; // Converte para o valor traduzido

            // Payload para a API (inclui campos adicionais)
                const newQuestData = {
                title: newQuestTitle,
                description: newQuestDesc,
                difficulty,
                xp_reward: xpReward,
                coin_reward: coinReward,
                    status: statusValue, // Enviamos o valor traduzido (como antes)
                guild_board_id: currentGuild?.id || 1 // Usa a guilda atual ou padrão
            };

            const createdQuest = await apiCreateQuest(newQuestData);

            // Atualiza o estado de forma imutável
            setColumns(prevColumns => {
                const column = prevColumns[columnId];
                // Se column não existir (por segurança), retorna prevColumns
                if (!column) return prevColumns;
                const newQuests = [...column.quests, createdQuest]; // Adiciona a nova quest

                return {
                    ...prevColumns,
                    [columnId]: {
                        ...column,
                        quests: newQuests
                    }
                };
            });
            // Após o sucesso, atualiza o estado original para o novo estado
            setOriginalColumns(prev => {
                if (!prev || !prev[columnId]) return prev;
                return ({
                    ...prev,
                    [columnId]: {
                        ...prev[columnId],
                        quests: [...prev[columnId].quests, createdQuest]
                    }
                });
            });

        } catch (err) {
            console.error('Erro ao criar quest:', err);
            alert(`Erro ao criar missão: ${err.message}`);
        }
    };


    // Manipulador de Drag-and-Drop
    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        console.log('onDragEnd result:', result);
        console.log('columns keys:', Object.keys(columns || {}));

    if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumn = columns[source.droppableId];
        const endColumn = columns[destination.droppableId];

        // --- Mover dentro da mesma coluna ---
    if (startColumn === endColumn) {
            const newQuests = Array.from(startColumn.quests);
            const [removed] = newQuests.splice(source.index, 1);
            newQuests.splice(destination.index, 0, removed);

            const newColumn = {
                ...startColumn,
                quests: newQuests
            };

            // Atualiza o estado local
            setColumns({
                ...columns,
                [newColumn.id]: newColumn
            });

            // Revertemos para o estado original em caso de erro no backend,
            // mas para reordenação na mesma coluna, o backend geralmente não é chamado
            // a não ser que você queira persistir a ordem. Se for o caso, adicione a chamada de API aqui.
            // Se for apenas local, podemos atualizar o originalColumns aqui.
            setOriginalColumns(prev => ({
                ...prev,
                [newColumn.id]: newColumn
            }));

    } else {
            // --- Mover entre colunas ---

            // Captura o estado atual das colunas para possível reversão
            const currentStartColumn = startColumn;
            const currentEndColumn = endColumn;

            const startQuests = Array.from(startColumn.quests);
            const [removed] = startQuests.splice(source.index, 1);
            const endQuests = Array.from(endColumn.quests);
            endQuests.splice(destination.index, 0, removed);

            const newStartColumn = {
                ...startColumn,
                quests: startQuests
            };
            const newEndColumn = {
                ...endColumn,
                quests: endQuests
            };

            // 1. Atualiza o estado local
            setColumns(prev => ({
                ...prev,
                [newStartColumn.id]: newStartColumn,
                [newEndColumn.id]: newEndColumn
            }));


            try {
                const questId = parseInt(draggableId);
                const statusKey = endColumn.status;

                if (statusKey === 'COMPLETED') {

                    setPendingCompletion({ questId, source, destination });
                    setShowReportModal(true);

                    setColumns(originalColumns);
                    return;
                }

                const statusValue = statusMap[statusKey];

                if (!statusValue) {
                    throw new Error(`Status de coluna desconhecido: ${statusKey}`);
                }

                await apiUpdateQuest(questId, {
                    status: statusValue
                });

                console.log(`Missão ${questId} movida para ${statusValue}`);

                setOriginalColumns(prev => ({
                    ...prev,
                    [newStartColumn.id]: newStartColumn,
                    [newEndColumn.id]: newEndColumn
                }));

            } catch (err) {
                console.error('Erro ao atualizar quest no backend:', err);
                setColumns(originalColumns);
                alert(`Erro ao mover a missão: ${err.message}. A alteração foi revertida.`);
            }
        }
    };

    const handleSubmitReport = async (reportText) => {
        if (!pendingCompletion) return;
        const { questId } = pendingCompletion;
        setShowReportModal(false);
        setLoading(true);
        try {
            await apiAddQuestReport(questId, { report: reportText });

            const statusValue = statusMap['COMPLETED'];
            await apiUpdateQuest(questId, { status: statusValue });

            if (currentGuild && currentGuild.id) {
                const data = await apiGetBoardsByGuild(currentGuild.id);
                setColumns(data);
                setOriginalColumns(data);
                if (data.guild) setCurrentGuild(data.guild);
            } else {
                const data = await apiGetBoards();
                setColumns(data);
                setOriginalColumns(data);
                if (data.guild) setCurrentGuild(data.guild);
            }

            // Atualiza o perfil do usuário para refletir XP/coins ganhos
            try {
                if (refreshUser) await refreshUser();
            } catch (err) {
                console.error('Erro ao atualizar usuário após conclusão:', err);
            }

        } catch (err) {
            console.error('Erro ao submeter relatório e concluir missão:', err);
            alert('Falha ao concluir a missão. Tente novamente.');
        } finally {
            setPendingCompletion(null);
            setLoading(false);
        }
    };

    // Handler para criar uma nova guilda
    const handleCreateGuild = async (guildName) => {
        setIsCreatingGuild(true);
        try {
            const newGuild = await apiCreateGuildBoard(guildName);
            console.log('Nova guilda criada:', newGuild);
            
            // Recarrega os boards após criar a guilda
            const data = await apiGetBoards();
            setColumns(data);
            setOriginalColumns(data);
            
            // Atualiza a guilda atual se disponível
            if (data.guild) {
                setCurrentGuild(data.guild);
            }
            
            // Recarrega a lista de guilds disponíveis
            try {
                const guilds = await apiGetGuildBoards();
                console.log('Guilds recarregadas:', guilds);
                if (Array.isArray(guilds)) {
                    setAvailableGuilds(guilds);
                }
            } catch (err) {
                console.error('Erro ao recarregar guilds:', err);
            }

            // Atualiza o perfil do usuário para refletir moedas deduzidas (se foi guilda paga)
            try {
                if (refreshUser) await refreshUser();
            } catch (err) {
                console.error('Erro ao atualizar usuário após criar guilda:', err);
            }
            
            alert('Guilda criada com sucesso!');
        } catch (err) {
            console.error('Erro ao criar guilda:', err);
            throw err;
        } finally {
            setIsCreatingGuild(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-lore-bg text-white">
                Carregando Missões...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-lore-bg text-white">
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                    Tentar Novamente
                </Button>
            </div>
        );
    }

    // Se columns for null, o `loading` já cobriu, mas por segurança
    if (!columns) return null;

        return (
            <div className="min-h-screen flex flex-col">
            <header className="bg-lore-bg-light bg-opacity-80 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center border-b border-lore-border sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="font-title text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg">
                        LoreClub
                    </h1>
                    <div className="h-8 w-px bg-gray-700 mx-2"></div>
                    <div className="flex flex-col items-start">
                        <label htmlFor="guildSelect" className="text-xs text-gray-400 uppercase tracking-wider">
                            Guilda Atual
                        </label>
                        {availableGuilds && availableGuilds.length > 0 ? (
                            <select
                                id="guildSelect"
                                value={currentGuild?.id || ''}
                                onChange={(e) => handleChangeGuild(e.target.value)}
                                className="bg-lore-bg border border-lore-border rounded px-2 py-1 text-lore-purple-lg font-bold focus:outline-none focus:border-lore-purple-md cursor-pointer"
                            >
                                {availableGuilds.map(guild => (
                                    <option key={guild.id} value={guild.id}>
                                        {guild.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-lore-purple-lg font-bold">
                                {currentGuild?.name || 'Carregando...'}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-lore-purple-md">Nível {user.level}</span>
                            <span className="text-xs text-gray-400">{user.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                            <span>🪙</span>
                            <span>{user.coins}</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-700 mx-2"></div>

                    <Button 
                        onClick={() => setIsModalOpen(true)} 
                        variant="primary" 
                        className="!w-auto !py-2 !px-4"
                    >
                        ➕ Criar Guilda
                    </Button>

                    <UserMenu
                        username={user.username}
                        onProfileClick={() => {
                            console.log('Perfil clicado');
                        }}
                        onAchievementsClick={() => setShowAchievementsModal(true)}
                    />
                    <Button onClick={logout} variant="secondary" className="!w-auto !py-2 !px-4 !bg-gray-700">
                        Sair da Guilda
                    </Button>
                </div>
            </header>

            <main className="flex-grow p-4 md:p-8">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col md:flex-row gap-6">
                        {Object.entries(columns)
                            .filter(([key]) => key !== 'guild') // Filtra a chave 'guild'
                            .map(([key, column]) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                quests={column.quests}
                                onAddQuest={handleAddQuest}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </main>
            
            <CreateGuildModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateGuild={handleCreateGuild}
                isLoading={isCreatingGuild}
            />
            <ReportModal
                isOpen={showReportModal}
                onClose={() => { setShowReportModal(false); setPendingCompletion(null); }}
                onSubmit={handleSubmitReport}
            />
            <AchievementsModal
                isOpen={showAchievementsModal}
                onClose={() => setShowAchievementsModal(false)}
            />
        </div>
    );
};

export default Board;