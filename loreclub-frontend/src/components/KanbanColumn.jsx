import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import QuestCard from './QuestCard';
import Button from './Button';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ column, quests, onAddQuest }) => {
    const [showForm, setShowForm] = useState(false);
    const [newQuestTitle, setNewQuestTitle] = useState("");
    const [newQuestDesc, setNewQuestDesc] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");

    // Recompensas baseadas na dificuldade
    const rewards = {
        'Easy': { xp: 10, coins: 5 },
        'Medium': { xp: 20, coins: 10 },
        'Hard': { xp: 50, coins: 25 },
        'Epic': { xp: 100, coins: 50 }
    };

    const handleAddNewQuest = () => {
        if (newQuestTitle.trim() === "") return;

        // Passa os dados extras para o pai
        onAddQuest(column.id, newQuestTitle, newQuestDesc, difficulty, rewards[difficulty].xp, rewards[difficulty].coins);

        setNewQuestTitle("");
        setNewQuestDesc("");
        setDifficulty("Easy");
        setShowForm(false);
    };

    return (
        <div className="w-full md:w-1/3 p-2">
            <div className="bg-lore-bg-light rounded-xl p-4 shadow-lg border border-lore-border h-full flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 px-2 flex justify-between items-center">
                    {column.title}
                    <span className="text-sm font-normal text-gray-400 bg-gray-700 rounded-full px-2.5 py-0.5">
                        {quests.length}
                    </span>
                </h2>
                
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-grow min-h-[200px] p-2 rounded-lg transition-colors
                                ${snapshot.isDraggingOver ? 'bg-gray-700/50' : 'bg-transparent'}`}
                        >
                            {quests.map((quest, index) => (
                                <QuestCard key={quest.id} quest={quest} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {showForm ? (
                    <div className="p-2 space-y-4">
                        <input
                            type="text"
                            value={newQuestTitle}
                            onChange={(e) => setNewQuestTitle(e.target.value)}
                            placeholder="Título da nova missão"
                            className="block w-full rounded-lg border-0 py-3 px-4 bg-gray-700 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lore-purple-md"
                        />
                        <textarea
                            value={newQuestDesc}
                            onChange={(e) => setNewQuestDesc(e.target.value)}
                            placeholder="Descrição breve da missão..."
                            rows="3"
                            className="block w-full rounded-lg border-0 py-3 px-4 bg-gray-700 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lore-purple-md"
                        />
                        <div className="flex items-center justify-between">
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="block rounded-lg border-0 py-2 px-3 bg-gray-700 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-lore-purple-md sm:text-sm"
                            >
                                <option value="Easy">Fácil</option>
                                <option value="Medium">Média</option>
                                <option value="Hard">Difícil</option>
                                <option value="Epic">Épica</option>
                            </select>

                            <div className="text-xs text-gray-400 flex gap-2">
                                <span className="text-lore-purple-md font-bold">+{rewards[difficulty].xp} XP</span>
                                <span className="text-yellow-400 font-bold">+{rewards[difficulty].coins} 🪙</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" onClick={handleAddNewQuest} className="flex-1">
                                <Plus className="h-4 w-4 mr-1" /> Adicionar
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1 !bg-gray-600">
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 p-3 w-full rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors flex items-center justify-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Adicionar uma missão
                    </button>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;

