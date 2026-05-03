// js/auth.js
import { loginUser } from './api.js';

export function initAuth(onLoginSuccess, onLogout) {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            
            const btn = loginForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Carregando...";
            btn.disabled = true;

            try {
                // Chama a API real (MongoDB)
                const data = await loginUser(usernameInput, passwordInput);
                
                localStorage.setItem('currentUser', data.userId);
                
                loginView.classList.remove('active');
                loginView.classList.add('hidden');
                
                appView.classList.remove('hidden');
                appView.classList.add('active');
                
                if (onLoginSuccess) onLoginSuccess(data.userId);
            } catch (error) {
                alert(error.message); // Usar alert simples para erro no MVP
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            
            appView.classList.remove('active');
            appView.classList.add('hidden');
            
            loginView.classList.remove('hidden');
            loginView.classList.add('active');
            
            if (loginForm) loginForm.reset();
            
            if (onLogout) onLogout();
        });
    }

    // Check if already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        loginView.classList.remove('active');
        loginView.classList.add('hidden');
        
        appView.classList.remove('hidden');
        appView.classList.add('active');
        
        if (onLoginSuccess) onLoginSuccess(currentUser);
    }
}
