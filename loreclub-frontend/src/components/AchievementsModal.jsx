import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { useState, useEffect } from 'react';
import { apiGetAchievementsForUser } from '../lib/api';

const AchievementsModal = ({ isOpen, onClose }) => {
    const [displayAchievements, setDisplayAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetAchievementsForUser();
                const mapped = (data || []).map(d => ({
                    id: d.id,
                    title: d.title,
                    description: d.description,
                    flavorText: d.flavor_text || d.flavorText || '',
                    icon: d.icon || '⚔️',
                    objective: {
                        type: d.objective_type || (d.objective && d.objective.type) || null,
                        value: d.objective_value ?? (d.objective && d.objective.value) ?? null
                    },
                    unlocked: d.unlocked ?? false,
                    unlockedDate: d.unlocked_date || d.unlockedDate || null
                }));
                if (mounted) setDisplayAchievements(mapped);
            } catch (err) {
                console.error('Erro ao carregar conquistas (modal):', err);
                if (mounted) setError(err.message || String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [isOpen]);

    if (!isOpen) return null;

    // Tipos de objetivos disponíveis com suas configurações
    const objectiveTypes = [
        { value: 'create_first_quest', label: '🎯 Criar primeira missão', hasParameter: false },
        { value: 'complete_quests', label: '✅ Completar missões', hasParameter: true, paramLabel: 'Quantidade', paramUnit: 'missões' },
        { value: 'complete_hard_quest', label: '💪 Completar missões Difícil', hasParameter: true, paramLabel: 'Quantidade', paramUnit: 'missões' },
        { value: 'complete_epic_quest', label: '👑 Completar missões Épica', hasParameter: true, paramLabel: 'Quantidade', paramUnit: 'missões' },
        { value: 'create_guilds', label: '🏰 Criar guildas', hasParameter: true, paramLabel: 'Quantidade', paramUnit: 'guildas' },
        { value: 'earn_xp', label: '⭐ Ganhar XP', hasParameter: true, paramLabel: 'Quantidade', paramUnit: 'XP' },
        { value: 'earn_coins', label: '💰 Ganhar moedas', hasParameter: true, paramLabel: 'Quantidade', paramUnit: 'moedas' },
        { value: 'reach_level', label: '🎖️ Atingir nível', hasParameter: true, paramLabel: 'Nível', paramUnit: '' },
        { value: 'complete_all_quests_guild', label: '🗡️ Completar todas as missões de uma guilda', hasParameter: false },
        { value: 'daily_streak', label: '🔥 Completar missões em dias seguidos', hasParameter: true, paramLabel: 'Dias', paramUnit: 'dias' }
    ];

    // Normalize list
    const normalized = displayAchievements.map(a => ({
        ...a,
        unlocked: a.unlocked !== undefined ? a.unlocked : false,
        unlockedDate: a.unlockedDate || null
    }));

    const getObjectiveDisplay = (objective) => {
        if (!objective) return '';
        
        const objType = objectiveTypes.find(t => t.value === objective.type);
        if (!objType) return objective.type;
        
        if (objType.hasParameter && objective.value) {
            return `${objType.label.replace(objType.paramLabel, '')} ${objective.value} ${objType.paramUnit}`;
        }
        return objType.label;
    };

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
                    {loading ? (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-gray-300">
                            Carregando conquistas...
                        </div>
                    ) : error ? (
                        <div className="col-span-1 md:col-span-2 text-center py-8 text-red-400">
                            <p className="mb-2">Falha ao carregar conquistas: {error}</p>
                            <button
                    onClick={() => {
                                    (async () => {
                                        setError(null);
                                        setLoading(true);
                                        try {
                                            const data = await apiGetAchievementsForUser();
                                            const mapped = (data || []).map(d => ({
                                                id: d.id,
                                                title: d.title,
                                                description: d.description,
                                                flavorText: d.flavor_text || d.flavorText || '',
                                                icon: d.icon || '⚔️',
                                                objective: {
                                                    type: d.objective_type || (d.objective && d.objective.type) || null,
                                                    value: d.objective_value ?? (d.objective && d.objective.value) ?? null
                                                },
                                                unlocked: d.unlocked ?? false,
                                                unlockedDate: d.unlocked_date || d.unlockedDate || null
                                            }));
                                            setDisplayAchievements(mapped);
                                        } catch (err) {
                                            console.error('Erro ao recarregar conquistas (modal):', err);
                                            setError(err.message || String(err));
                                        } finally {
                                            setLoading(false);
                                        }
                                    })();
                                }}
                                className="px-4 py-2 bg-lore-purple-lg text-white rounded"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : normalized.length > 0 ? (
                        normalized.map((achievement) => (
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
                                            {achievement.title}
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
                                        
                                        {/* Objetivo */}
                                        {achievement.objective && (
                                            <p className="text-xs mt-2 text-lore-pink-lg font-semibold">
                                                📌 {getObjectiveDisplay(achievement.objective)}
                                            </p>
                                        )}

                                        {/* Flavor Text */}
                                        {achievement.flavorText && (
                                            <p className={`text-xs mt-2 italic ${achievement.unlocked ? 'text-lore-purple-md' : 'text-gray-600'}`}>
                                                "{achievement.flavorText}"
                                            </p>
                                        )}

                                        {achievement.unlocked && achievement.unlockedDate && (
                                            <p className="text-xs text-lore-purple-md mt-2">
                                                ✓ Desbloqueado em {achievement.unlockedDate}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-gray-400">
                            <p className="text-lg">Nenhuma conquista criada ainda.</p>
                            <p className="text-sm mt-2">Acesse <strong>/admin/conquistas</strong> para gerenciar conquistas.</p>
                        </div>
                    )}
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
