import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const QuestCard = ({ quest, index }) => {
    return (
        <Draggable draggableId={quest.id} index={index}>
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
                    {/* Você pode adicionar avatares de heróis aqui no futuro */}
                </div>
            )}
        </Draggable>
    );
};

export default QuestCard;
