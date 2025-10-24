import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiLogin, apiRegister, apiGetCurrentHero } from '../lib/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verifica se há token válido ao carregar o app
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('loreclub_token');

                if (token) {
                    // Busca os dados do usuário
                    const userData = await apiGetCurrentHero();
                    setUser(userData);
                    localStorage.setItem('loreclub_user', JSON.stringify(userData));
                }
            } catch (error) {
                console.error("Token inválido ou expirado", error);
                localStorage.removeItem('loreclub_token');
                localStorage.removeItem('loreclub_user');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        console.log(`Tentando login com username: ${username}`);
        try {
            const data = await apiLogin(username, password);
            localStorage.setItem('loreclub_token', data.token);
            localStorage.setItem('loreclub_user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const data = await apiRegister(username, email, password);
            localStorage.setItem('loreclub_token', data.token);
            localStorage.setItem('loreclub_user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('loreclub_token');
        localStorage.removeItem('loreclub_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);