// js/api.js

const API_BASE = '/api';

export async function fetchDashboardData(userId) {
    try {
        const response = await fetch(`${API_BASE}/dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        
        if (!response.ok) throw new Error('Falha ao buscar dashboard');
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // Fallback gracefully se a API falhar
        return {
            balance: { income: 0, expense: 0, current: 0 },
            categories: []
        };
    }
}

export async function sendMessageToAI(message, userId) {
    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, userId })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Falha ao processar mensagem');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error; // Repassa para o chat.js exibir mensagem de erro
    }
}

export async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro no login');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
