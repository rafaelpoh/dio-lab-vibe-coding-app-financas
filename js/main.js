// js/main.js
import { initAuth } from './auth.js';
import { initChat } from './chat.js';
import { fetchDashboardData } from './api.js';
import { createElementSafe, formatCurrency } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management
    initTheme();

    // 2. Auth Management
    let currentUserId = null;
    initAuth((username) => {
        currentUserId = username;
        // Pós login: inicializa app
        setupApp(currentUserId);
    }, () => {
        // Pós logout: limpa dados
        currentUserId = null;
        clearDashboard();
    });

    // 3. Navigation via Event Delegation
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
        sidebarNav.addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-item');
            if (!btn) return;
            
            // Remove active de todos
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');

            // Troca sections
            const targetId = btn.getAttribute('data-target') + '-section';
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('active');
            }
        });
    }

    // 4. Update Dashboard on new transaction
    window.addEventListener('transactionAdded', () => {
        if (currentUserId) {
            loadDashboard(currentUserId);
        }
    });
});

function initTheme() {
    const root = document.documentElement;
    const toggles = document.querySelectorAll('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    }

    toggles.forEach(toggleBtn => {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    });
}

function setupApp(userId) {
    initChat(userId);
    loadDashboard(userId);
}

async function loadDashboard(userId) {
    try {
        const data = await fetchDashboardData(userId);
        
        // Update Balances
        const incomeEl = document.getElementById('total-income');
        const expenseEl = document.getElementById('total-expense');
        const investmentEl = document.getElementById('total-investment');
        const currentBalEl = document.getElementById('current-balance');
        
        if(incomeEl) incomeEl.textContent = formatCurrency(data.balance.income).replace('R$', '').trim();
        if(expenseEl) expenseEl.textContent = formatCurrency(data.balance.expense).replace('R$', '').trim();
        if(investmentEl) investmentEl.textContent = formatCurrency(data.balance.investment || 0).replace('R$', '').trim();
        if(currentBalEl) currentBalEl.textContent = formatCurrency(data.balance.current).replace('R$', '').trim();

        // Render Pie Chart (Vanilla CSS)
        const chartEl = document.getElementById('dashboard-chart');
        if (chartEl) {
            const total = (data.balance.income || 0) + (data.balance.expense || 0) + (data.balance.investment || 0);
            if (total === 0) {
                chartEl.style.background = 'var(--bg-tertiary)';
            } else {
                const incomePct = ((data.balance.income || 0) / total) * 100;
                const expensePct = ((data.balance.expense || 0) / total) * 100;
                // const investPct = ((data.balance.investment || 0) / total) * 100;
                
                // Conic Gradient string: success (0% to income%), danger (income% to income+expense%), investment (rest)
                const point1 = incomePct.toFixed(1);
                const point2 = (incomePct + expensePct).toFixed(1);
                
                chartEl.style.background = `conic-gradient(
                    var(--success-color) 0% ${point1}%, 
                    var(--danger-color) ${point1}% ${point2}%, 
                    var(--investment-color) ${point2}% 100%
                )`;
            }
        }

        // Update Categories (Safe DOM creation)
        const categoryList = document.getElementById('category-list');
        if (categoryList) {
            categoryList.innerHTML = ''; // Limpeza inicial segura apenas para esvaziar o container pai
            
            data.categories.forEach(cat => {
                const nameSpan = createElementSafe('span', {}, cat.name);
                const valueSpan = createElementSafe('span', { 
                    className: cat.current > cat.limit ? 'danger' : 'success' 
                }, `${formatCurrency(cat.current)} / ${formatCurrency(cat.limit)}`);
                
                const item = createElementSafe('li', { className: 'category-item' }, [nameSpan, valueSpan]);
                categoryList.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
    }
}

function clearDashboard() {
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) {
        // Mantém apenas a mensagem do bot original
        chatHistory.innerHTML = `
            <div class="message bot">
                <div class="message-bubble">
                    Olá! Sou seu Agente Financeiro. Me conte o que você gastou hoje ou se recebeu algum dinheiro. Ex: "Gastei R$ 30 com almoço".
                </div>
            </div>`;
    }
}
