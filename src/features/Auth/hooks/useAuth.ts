// src/features/Auth/hooks/useAuth.ts - Hook de Autenticação integrado ao Firebase Auth
import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { CredentialsSchema } from '../schemas';
import type { AuthCredentials } from '../types';

function getFriendlyFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Tente entrar com sua senha.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Escolha ao menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'Endereço de e-mail com formato inválido.';
    case 'auth/too-many-requests':
      return 'Acesso temporariamente bloqueado por muitas tentativas. Tente mais tarde.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com a rede. Verifique sua internet.';
    default:
      return 'Erro na autenticação. Verifique os dados e tente novamente.';
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => auth.currentUser?.uid ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sincronização reativa e resiliente da sessão com Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (credentials: AuthCredentials): Promise<boolean> => {
    setErrorMessage(null);

    // Validação estrita defensiva com Zod
    const validation = CredentialsSchema.safeParse(credentials);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      setErrorMessage(issue?.message ?? 'Credenciais inválidas.');
      return false;
    }

    setIsLoading(true);
    try {
      if (credentials.isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          validation.data.email,
          validation.data.password
        );
        setCurrentUser(userCredential.user.uid);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          validation.data.email,
          validation.data.password
        );
        setCurrentUser(userCredential.user.uid);
      }
      return true;
    } catch (error: any) {
      const errorCode = (error && typeof error === 'object' && 'code' in error) ? String(error.code) : '';
      const friendlyMessage = getFriendlyFirebaseError(errorCode);
      setErrorMessage(friendlyMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setErrorMessage(null);
    } catch (err) {
      console.error('Erro ao encerrar sessão no Firebase:', err);
    }
  }, []);

  return {
    currentUser,
    isLoading,
    errorMessage,
    login,
    logout,
  };
}
