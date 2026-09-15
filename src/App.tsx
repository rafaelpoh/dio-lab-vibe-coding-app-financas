// src/App.tsx - Orquestrador Raiz da Aplicação (Composition Root)
import React, { useState, useCallback } from 'react';
import type { ActiveTab } from './types/common';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './features/Auth/hooks/useAuth';
import { useDashboard } from './features/Dashboard/hooks/useDashboard';
import { Auth } from './features/Auth/Auth';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Chat } from './features/Chat/Chat';
import { Dashboard } from './features/Dashboard/Dashboard';
import styles from './App.module.css';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [refreshSignal, setRefreshSignal] = useState<number>(0);

  // Sincroniza o saldo compartilhado para a badge do Chat e painel do Dashboard
  const { data: dashboardData, refetch: refetchDashboard } = useDashboard(
    currentUser ?? '',
    refreshSignal
  );

  const handleTransactionCreated = useCallback((): void => {
    setRefreshSignal((prev) => prev + 1);
    void refetchDashboard();
  }, [refetchDashboard]);

  const handleLogout = useCallback((): void => {
    logout();
    setActiveTab('chat');
    setRefreshSignal(0);
  }, [logout]);

  if (!currentUser) {
    return (
      <Auth
        onLoginSuccess={() => setActiveTab('chat')}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
      />
    );
  }

  return (
    <div className={styles.appLayout}>
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
      />

      <main className={styles.mainContent}>
        {activeTab === 'chat' ? (
          <Chat
            userId={currentUser}
            currentBalance={dashboardData.balance.current}
            onTransactionCreated={handleTransactionCreated}
          />
        ) : (
          <Dashboard userId={currentUser} refreshSignal={refreshSignal} />
        )}
      </main>
    </div>
  );
};
