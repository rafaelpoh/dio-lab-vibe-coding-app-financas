// src/hooks/useTheme.ts - Hook de Gerenciamento de Tema (Claro/Escuro)
import { useState, useEffect, useCallback } from 'react';
import type { ThemeMode } from '../types/common';

const THEME_STORAGE_KEY = 'app_financas_theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Inicialização síncrona lendo do armazenamento local
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback((): void => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    theme,
    toggleTheme,
  };
}
