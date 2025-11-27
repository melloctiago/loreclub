import React, { useState } from 'react';
import ViewReportModal from './ViewReportModal';
import { FileText, Scroll } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

const QuestCard = ({ quest, index }) => {
    const [open, setOpen] = useState(false);
    const difficultyMap = {
        'Easy': 'Fácil',
        'Medium': 'Média',
        'Hard': 'Difícil',
        'Epic': 'Épica'
    };
    return (
        <Draggable draggableId={`${quest.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-4 mb-3 rounded-lg shadow-lg bg-lore-bg-card border border-lore-border hover:border-lore-purple-lg transition-all
                        ${snapshot.isDragging ? 'shadow-2xl scale-105 ring-2 ring-lore-purple-lg' : ''}`}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    <h3 className="font-semibold text-white">{quest.title}</h3>
                    <p className="text-sm text-gray-300 mt-2">{quest.description}</p>

                    {quest.report && (
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                title="Ler resumo"
                                aria-label="Ler resumo"
                                className="text-lore-purple-lg hover:text-lore-purple-md"
                            >
                                <Scroll className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    <ViewReportModal
                        isOpen={open}
                        onClose={() => setOpen(false)}
                        reportText={quest.report}
                    />

                    <div className="mt-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="bg-lore-purple-md/20 text-lore-purple-md px-2 py-1 rounded border border-lore-purple-md/30">
                                {quest.xp_reward} XP
                            </span>
                            <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20">
                                🪙 {quest.coin_reward}
                            </span>
                        </div>
                        <span className={`px-2 py-1 rounded border text-[10px] uppercase tracking-wider
                            ${quest.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                quest.difficulty === 'Medium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    quest.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                            {difficultyMap[quest.difficulty] || quest.difficulty || 'Fácil'}
                        </span>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default QuestCard;
