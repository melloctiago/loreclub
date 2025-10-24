const API_BASE_URL = 'http://localhost:8000/api/v1';

// FUNÇÃO AUXILIAR 
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

// FUNÇÕES DE AUTENTICAÇÃO


/**
 * Login - Retorna token e dados do usuário
 */
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

/**
 * Registrar um novo Herói (usuário)
 */
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

/**
 * Buscar dados do Herói logado (usado para validar o token)
 */
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

// FUNÇÕES DE QUESTS (Mantidas)


// Busca os boards organizados com as quests do usuário logado
export const apiGetBoards = async () => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/my-boards-with-quests`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar boards:', error);
        throw error;
    }
};

// Cria uma nova quest
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

// Atualiza uma quest 
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

// Busca todas as quests do usuário
export const apiGetMyQuests = async () => {
    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/quests/my-quests`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar minhas quests:', error);
        throw error;
    }
};

// Atribui um herói a uma quest
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


