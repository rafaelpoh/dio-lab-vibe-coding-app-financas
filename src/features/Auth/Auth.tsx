// src/features/Auth/Auth.tsx - Componente Raiz da Feature de Autenticação
import React from 'react';
import type { AuthProps } from './types';
import { LoginForm } from './components/LoginForm';
import { useAuth } from './hooks/useAuth';
import { Button } from '../../components/Button/Button';
import styles from './Auth.module.css';

export const Auth: React.FC<AuthProps> = ({
  onLoginSuccess,
  onToggleTheme,
  currentTheme,
}) => {
  const { isLoading, errorMessage, login } = useAuth();

  const handleFormSubmit = async (credentials: import('./types').AuthCredentials) => {
    const success = await login(credentials);
    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.themeToggleWrapper}>
        <Button
          variant="icon"
          onClick={onToggleTheme}
          ariaLabel="Alternar Tema Claro/Escuro"
        >
          {currentTheme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </Button>
      </div>

      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Agente Financeiro</h1>
          <p className={styles.subtitle}>O seu controle financeiro simples e inteligente.</p>

          <aside className={styles.infoBox}>
            <span className={styles.infoHighlight}>💡 Autenticação Firebase:</span> Entre com seu e-mail e senha ou crie uma nova conta com segurança.
          </aside>
        </header>

        <LoginForm
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </main>
  );
};
