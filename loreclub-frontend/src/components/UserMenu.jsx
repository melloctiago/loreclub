import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Trophy } from 'lucide-react';

const UserMenu = ({ username, onProfileClick, onAchievementsClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Fecha o menu se clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        onProfileClick();
        setIsOpen(false);
    };

    const handleAchievementsClick = () => {
        onAchievementsClick();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
                <span>Bem-vindo, {username}!</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-lore-bg-light border border-lore-border rounded-lg shadow-xl z-50 overflow-hidden">
                    <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-3 flex items-center gap-2 text-gray-300 hover:bg-lore-purple-lg/20 hover:text-white transition-colors border-b border-lore-border"
                    >
                        <User className="h-4 w-4" />
                        <span>Perfil</span>
                    </button>

                    <button
                        onClick={handleAchievementsClick}
                        className="w-full px-4 py-3 flex items-center gap-2 text-gray-300 hover:bg-lore-purple-lg/20 hover:text-white transition-colors"
                    >
                        <Trophy className="h-4 w-4" />
                        <span>Conquistas</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
