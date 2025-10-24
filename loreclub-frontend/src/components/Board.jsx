import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useAuth } from '../context/AuthContext';
import { apiGetBoards, apiCreateQuest, apiUpdateQuest } from '../lib/api';
import KanbanColumn from './KanbanColumn';
import Button from './Button';

// Mapa de tradução dos status
// eu tava passando as chaves erradas aí pra não ter que mudar em tudo criei desse jeito, posso atualizar mais tarde
const statusMap = {
    'QUEST_BOARD': 'Quadro de Missões',
    'IN_PROGRESS': 'Em Andamento',
    'COMPLETED': 'Missões Concluídas'
};

const Board = () => {
    const { user, logout } = useAuth();
    const [columns, setColumns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carrega os dados do Kanban
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await apiGetBoards();
                setColumns(data);
            } catch (err) {
                console.error('Erro ao carregar boards:', err);
                setError(err.message || 'Erro ao carregar as missões. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Manipulador para adicionar uma nova missão
    const handleAddQuest = async (columnId, title, description) => {
        try {
            const columnStatusKey = columns[columnId].status;
            // Traduz a chave para o valor esperado pelo backend
            const statusValue = statusMap[columnStatusKey];

            const questData = {
                title,
                description,
                status: statusValue, 
                guild_board_id: 1 
            };

            const newQuest = await apiCreateQuest(questData);

            // Atualiza o estado local
            setColumns(prev => {
                const column = prev[columnId];
                
                const newQuestData = {
                    id: String(newQuest.id), 
                    title: newQuest.title,
                    description: newQuest.description,
                    status: newQuest.status, 
                    guild_board_id: newQuest.guild_board_id
                };

                const newQuests = [...column.quests, newQuestData];
                
                return {
                    ...prev,
                    [columnId]: {
                        ...column,
                        quests: newQuests
                    }
                };
            });
        } catch (err) {
            console.error('Erro ao criar quest:', err);
            alert(`Erro ao criar missão: ${err.message}`);
        }
    };

    // Manipulador de Drag-and-Drop
    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

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

            setColumns({
                ...columns,
                [newColumn.id]: newColumn
            });
            

        } else {
            // --- Mover entre colunas ---
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
            // Atualiza o estado local
            setColumns({
                ...columns,
                [newStartColumn.id]: newStartColumn,
                [newEndColumn.id]: newEndColumn
            });

            // Chama o backend para atualizar o status
            try {
                const questId = parseInt(draggableId); 
                
                const statusKey = endColumn.status;
                const statusValue = statusMap[statusKey];

                if (!statusValue) {
                    throw new Error(`Status de coluna desconhecido: ${statusKey}`);
                }

                // Envia o payload correto para o backend
                await apiUpdateQuest(questId, {
                    status: statusValue
                });
                
                console.log(`Missão ${questId} movida para ${statusValue}`);

            } catch (err) {
                console.error('Erro ao atualizar quest no backend:', err);
                
                // Reverte o estado em caso de erro
                setColumns(prev => ({
                    ...prev,
                    [startColumn.id]: startColumn,
                    [endColumn.id]: endColumn
                }));
                
                alert(`Erro ao mover a missão: ${err.message}. A alteração foi revertida.`);
            }
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

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-lore-bg-light bg-opacity-80 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center border-b border-lore-border sticky top-0 z-50">
                <h1 className="font-title text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg">
                    LoreClub
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Bem-vindo, {user.username}!</span>
                    <Button onClick={logout} variant="secondary" className="!w-auto !py-2 !px-4 !bg-gray-700">
                        Sair da Guilda
                    </Button>
                </div>
            </header>
            
            {/* Conteúdo do Kanban */}
            <main className="flex-grow p-4 md:p-8">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col md:flex-row gap-6">
                        {columns && Object.values(columns).map(column => (
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
        </div>
    );
};

export default Board;

