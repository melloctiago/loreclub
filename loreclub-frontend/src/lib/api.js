const API_BASE_URL = 'http://localhost:8000/api/v1';

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('loreclub_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers,
    });
    
    if (!response.ok) {

        let errorMessage = 'Erro na requisição';
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail.map(err => `(${err.loc.join(' > ')}) ${err.msg}`).join('; ');
                } 
                else if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail;
                }
            }
            console.error("Erro na chamada fetchWithAuth (dados):", errorData);
        } catch (e) {
            errorMessage = response.statusText;
        }
        
        throw new Error(errorMessage);
    }
    
    if (response.status === 204) {
        return null;
    }
    
    return response.json();
};

 
export const apiLogin = async (username, password) => {
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Usuário ou senha incorretos');
        }
        
        const data = await response.json();
        const heroData = await apiGetCurrentHero(data.access_token);
        
        return { token: data.access_token, user: heroData };

    } catch (error) {
        console.error('Erro no apiLogin:', error);
        throw error;
    }
};

export const apiRegister = async (username, email, password) => {
    try {
        const registerResponse = await fetch(`${API_BASE_URL}/heroes/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (!registerResponse.ok) {
             const error = await registerResponse.json();
             throw new Error(error.detail || 'Erro ao registrar');
        }
        
        return await apiLogin(username, password);

    } catch (error) {
        console.error('Erro no apiRegister:', error);
        throw error;
    }
};

export const apiGetCurrentHero = async (tokenOverride = null) => {
    try {
        let options = {};
        if (tokenOverride) {
            options.headers = { 'Authorization': `Bearer ${tokenOverride}` };
        }
        const data = await fetchWithAuth(`${API_BASE_URL}/heroes/me`, options);
        return data;
    } catch (error) {
        console.error('Erro ao buscar herói atual:', error);
        throw error;
    }
};

export const apiGetBoards = async () => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/my-boards-with-quests`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar boards:', error);
        throw error;
    }
};

export const apiCreateQuest = async (questData) => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/`, {
            method: 'POST',
            body: JSON.stringify(questData),
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar quest:', error);
        throw error;
    }
};

export const apiUpdateQuest = async (questId, updateData) => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/${questId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
        return data;
    } catch (error) {
        console.error('Erro ao atualizar quest:', error);
        throw error;
    }
};

export const apiGetMyQuests = async () => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/my-quests`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar minhas quests:', error);
        throw error;
    }
};

export const apiAssignHeroToQuest = async (questId, heroId) => {
    try {
        const data = await fetchWithAuth(
            `${API_BASE_URL}/quests/${questId}/assign/${heroId}`,
            { method: 'POST' }
        );
        return data;
    } catch (error) {
        console.error('Erro ao atribuir herói:', error);
        throw error;
    }
};

export const apiCreateGuildBoard = async (guildName) => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/guild-boards/`, {
            method: 'POST',
            body: JSON.stringify({ name: guildName }),
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar guilda:', error);
        throw error;
    }
};

export const apiGetGuildBoards = async () => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/guild-boards/`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar guilds:', error);
        throw error;
    }
};

export const apiGetBoardsByGuild = async (guildId) => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/boards-by-guild/${guildId}`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar boards da guilda:', error);
        throw error;
    }
};

export const apiAddQuestReport = async (questId, reportData) => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/${questId}/report`, {
            method: 'POST',
            body: JSON.stringify(reportData),
        });
        return data;
    } catch (error) {
        console.error('Erro ao adicionar relatório da quest:', error);
        throw error;
    }
};

export const apiGetAchievements = async () => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/achievements/`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar conquistas:', error);
        throw error;
    }
};

export const apiGetAchievementsForUser = async () => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/achievements/me`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar conquistas do usuário:', error);
        throw error;
    }
};

export const apiUnlockAchievement = async (achievementId) => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/achievements/${achievementId}/unlock`, {
            method: 'POST'
        });
        return data;
    } catch (error) {
        console.error('Erro ao desbloquear conquista:', error);
        throw error;
    }
};

export const apiRemoveUnlock = async (achievementId) => {
    try {
        await fetchWithAuth(`${API_BASE_URL}/achievements/${achievementId}/unlock`, { method: 'DELETE' });
        return true;
    } catch (error) {
        console.error('Erro ao remover desbloqueio:', error);
        throw error;
    }
};

export const apiCreateAchievement = async (achievementData) => {
    try {
        const payload = {
            title: achievementData.title,
            flavor_text: achievementData.flavorText || '',
            icon: achievementData.icon || '🏆',
            objective_type: achievementData.objectiveType,
            objective_value: achievementData.objectiveValue
        };
        const data = await fetchWithAuth(`${API_BASE_URL}/achievements/`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return data;
    } catch (error) {
        console.error('Erro ao criar conquista:', error);
        throw error;
    }
};

export const apiDeleteAchievement = async (achievementId) => {
    try {
        await fetchWithAuth(`${API_BASE_URL}/achievements/${achievementId}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        console.error('Erro ao deletar conquista:', error);
        throw error;
    }
};


