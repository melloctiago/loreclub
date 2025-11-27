import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const AchievementsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Placeholder achievements data
    const achievements = [
        {
            id: 1,
            name: 'Primeiro Passo',
            description: 'Crie sua primeira missão',
            icon: '🎯',
            unlocked: true,
            unlockedDate: '2025-11-20'
        },
        {
            id: 2,
            name: 'Conquistador',
            description: 'Complete 5 missões',
            icon: '⭐',
            unlocked: true,
            unlockedDate: '2025-11-22'
        },
        {
            id: 3,
            name: 'Lendário',
            description: 'Complete 50 missões',
            icon: '👑',
            unlocked: false,
            unlockedDate: null
        },
        {
            id: 4,
            name: 'Construtor de Impérios',
            description: 'Crie 3 guildas',
            icon: '🏰',
            unlocked: false,
            unlockedDate: null
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-lore-bg-light border border-lore-border rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-lore-bg-light border-b border-lore-border p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg">
                        🏆 Conquistas
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Fechar modal"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Achievements Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`p-4 rounded-lg border transition-all ${
                                achievement.unlocked
                                    ? 'bg-lore-bg-card border-lore-purple-lg/50 hover:border-lore-purple-lg'
                                    : 'bg-gray-800/30 border-gray-700/50 opacity-60'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`text-4xl ${!achievement.unlocked ? 'grayscale' : ''}`}
                                >
                                    {achievement.icon}
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className={`font-bold ${
                                            achievement.unlocked
                                                ? 'text-white'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {achievement.name}
                                    </h3>
                                    <p
                                        className={`text-sm mt-1 ${
                                            achievement.unlocked
                                                ? 'text-gray-300'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        {achievement.description}
                                    </p>
                                    {achievement.unlocked && achievement.unlockedDate && (
                                        <p className="text-xs text-lore-purple-md mt-2">
                                            Desbloqueado em {achievement.unlockedDate}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-lore-bg-light border-t border-lore-border p-4 flex justify-end gap-2">
                    <Button onClick={onClose} variant="secondary" className="!w-auto !py-2 !px-4">
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AchievementsModal;
