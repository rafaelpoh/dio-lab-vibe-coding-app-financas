// src/features/Auth/types.ts - Contratos e Interfaces da Feature de Autenticação Firebase

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
  readonly isSignUp?: boolean;
}

export interface AuthProps {
  readonly onLoginSuccess: () => void;
  readonly onToggleTheme: () => void;
  readonly currentTheme: 'light' | 'dark';
}
