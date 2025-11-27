import React from 'react';
import Button from './Button';

const ViewReportModal = ({ isOpen, onClose, reportText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-lore-bg-light border border-lore-border rounded-lg shadow-2xl w-full max-w-lg mx-4 p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg mb-4">
                    Resumo da Missão
                </h2>

                <div className="mb-4 p-4 bg-gray-800 rounded text-gray-200 text-sm">
                    {reportText || 'Nenhum resumo encontrado.'}
                </div>

                <div className="flex justify-end">
                    <Button type="button" variant="secondary" onClick={onClose} className="!w-auto !py-2 !px-6">
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ViewReportModal;
