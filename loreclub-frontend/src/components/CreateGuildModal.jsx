import React, { useState } from 'react';
import Button from './Button';

const CreateGuildModal = ({ isOpen, onClose, onCreateGuild, isLoading }) => {
    const [guildName, setGuildName] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!guildName.trim()) {
            setError('O nome da guilda não pode estar vazio');
            return;
        }

        try {
            await onCreateGuild(guildName);
            setGuildName('');
            onClose();
        } catch (err) {
            setError(err.message || 'Erro ao criar guilda');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-lore-bg-light border border-lore-border rounded-lg shadow-2xl w-full max-w-md mx-4 p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg mb-4">
                    Criar Nova Guilda
                </h2>

                {error && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="guildName" className="block text-sm font-medium text-gray-300 mb-2">
                            Nome da Guilda
                        </label>
                        <input
                            id="guildName"
                            type="text"
                            value={guildName}
                            onChange={(e) => setGuildName(e.target.value)}
                            placeholder="Ex: Guardiões da Floresta"
                            className="w-full bg-lore-bg border border-lore-border rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-lore-purple-md focus:ring-1 focus:ring-lore-purple-md"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                            className="!w-auto !py-2 !px-6"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="!w-auto !py-2 !px-6"
                        >
                            {isLoading ? 'Criando...' : 'Criar Guilda'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGuildModal;
