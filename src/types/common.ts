// src/types/common.ts - Tipos e Contratos Compartilhados Globais

export type ThemeMode = 'light' | 'dark';

export type ActiveTab = 'chat' | 'dashboard';

export interface UserSession {
  readonly userId: string;
}

export interface ApiErrorResponse {
  readonly error: string;
}
