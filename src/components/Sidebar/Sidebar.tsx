// src/components/Sidebar/Sidebar.tsx - Barra Lateral de Navegação
import React, { memo } from 'react';
import type { ActiveTab, ThemeMode } from '../../types/common';
import { Button } from '../Button/Button';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  readonly activeTab: ActiveTab;
  readonly onSelectTab: (tab: ActiveTab) => void;
  readonly onLogout: () => void;
  readonly onToggleTheme: () => void;
  readonly currentTheme: ThemeMode;
}

export const Sidebar: React.FC<SidebarProps> = memo(({
  activeTab,
  onSelectTab,
  onLogout,
  onToggleTheme,
  currentTheme,
}) => {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Agente<br />Financeiro
        </h2>
      </header>

      <nav className={styles.nav} aria-label="Navegação Principal">
        <button
          type="button"
          className={`${styles.navItem} ${activeTab === 'chat' ? styles.navItemActive : ''}`}
          onClick={() => onSelectTab('chat')}
        >
          Chat
        </button>
        <button
          type="button"
          className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`}
          onClick={() => onSelectTab('dashboard')}
        >
          Dashboard
        </button>
      </nav>

      <footer className={styles.footer}>
        <Button
          variant="icon"
          onClick={onToggleTheme}
          ariaLabel="Alternar Tema Claro/Escuro"
        >
          {currentTheme === 'dark' ? (
            /* Ícone de Sol quando no tema escuro */
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
            /* Ícone de Lua no tema claro */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={onLogout}
        >
          Sair
        </Button>
      </footer>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
