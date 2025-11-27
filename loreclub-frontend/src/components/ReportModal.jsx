import React, { useState } from 'react';
import Button from './Button';

const ReportModal = ({ isOpen, onClose, onSubmit, initialText = '' }) => {
    const [text, setText] = useState(initialText);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        try {
            await onSubmit(text.trim());
            setText('');
            onClose();
        } catch (err) {
            console.error('Erro ao submeter relatório:', err);
            alert('Falha ao submeter relatório. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-lore-bg-light border border-lore-border rounded-lg shadow-2xl w-full max-w-lg mx-4 p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg mb-4">
                    Submeter Resumo da Missão
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reportText" className="block text-sm font-medium text-gray-300 mb-2">
                            Resumo (obrigatório para concluir)
                        </label>
                        <textarea
                            id="reportText"
                            rows={6}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-lore-bg border border-lore-border rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-lore-purple-md focus:ring-1 focus:ring-lore-purple-md"
                            placeholder="Descreva o que foi feito para concluir a missão..."
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={loading} className="!w-auto !py-2 !px-6">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="!w-auto !py-2 !px-6">
                            {loading ? 'Enviando...' : 'Enviar Resumo'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
