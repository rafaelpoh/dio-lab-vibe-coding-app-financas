// src/features/Auth/components/LoginForm.tsx - Formulário de Autenticação do Firebase
import React, { useState, memo } from 'react';
import type { AuthCredentials } from '../types';
import { Button } from '../../../components/Button/Button';
import styles from '../Auth.module.css';

interface LoginFormProps {
  readonly onSubmit: (credentials: AuthCredentials) => void;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = memo(({
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit({ email, password, isSignUp });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errorMessage && (
        <div className={styles.errorBanner} role="alert">
          {errorMessage}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="auth-email" className={styles.label}>
          E-mail
        </label>
        <input
          id="auth-email"
          type="email"
          className={styles.input}
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="auth-password" className={styles.label}>
          Senha
        </label>
        <input
          id="auth-password"
          type="password"
          className={styles.input}
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          disabled={isLoading}
          minLength={6}
        />
      </div>

      <Button type="submit" disabled={isLoading} variant="primary">
        {isLoading
          ? (isSignUp ? 'Criando conta...' : 'Entrando...')
          : (isSignUp ? 'Criar Conta' : 'Entrar')}
      </Button>

      <button
        type="button"
        className={styles.toggleModeButton}
        onClick={() => setIsSignUp((prev) => !prev)}
        disabled={isLoading}
      >
        {isSignUp
          ? 'Já possui uma conta? Clique para Entrar'
          : 'Novo por aqui? Clique para Criar Conta'}
      </button>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';
