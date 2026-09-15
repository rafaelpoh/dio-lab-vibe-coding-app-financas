// src/features/Chat/hooks/useChat.ts - Hook de Gerenciamento do Fluxo Conversacional
import { useState, useCallback, useRef, useEffect } from 'react';
import { postApiSafe } from '../../../utils/api';
import { ChatResponseSchema } from '../schemas';
import type { ChatMessage } from '../types';

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'initial-welcome-message',
  sender: 'bot',
  text: 'Olá! Sou seu Agente Financeiro. Me conte o que você gastou hoje ou se recebeu algum dinheiro. Ex: "Gastei R$ 30 com almoço".',
  timestamp: Date.now(),
};

export function useChat(userId: string, onTransactionCreated?: () => void) {
  const [messages, setMessages] = useState<ReadonlyArray<ChatMessage>>([INITIAL_BOT_MESSAGE]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const historyBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll para a última mensagem mantendo a experiência fluida
  const scrollToBottom = useCallback((): void => {
    historyBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    const trimmed = content.trim();
    if (!trimmed || !userId) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    // Atualização imutável do estado
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await postApiSafe('/chat', { message: trimmed, userId }, ChatResponseSchema);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'bot',
        text: response.text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Notifica o dashboard para sincronizar os saldos e categorias atualizados
      if (onTransactionCreated) {
        onTransactionCreated();
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Falha ao processar mensagem.';
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: `❌ Ops: ${errorText}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [userId, onTransactionCreated]);

  return {
    messages,
    isTyping,
    sendMessage,
    historyBottomRef,
  };
}
