// src/features/Chat/Chat.tsx - Componente Raiz da Feature Chat
import React from 'react';
import type { ChatProps } from './types';
import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { BalanceBadge } from './components/BalanceBadge';
import { Tooltip } from '../../components/Tooltip/Tooltip';
import styles from './Chat.module.css';

export const Chat: React.FC<ChatProps> = ({
  userId,
  currentBalance,
  onTransactionCreated,
}) => {
  const { messages, isTyping, sendMessage, historyBottomRef } = useChat(userId, onTransactionCreated);

  return (
    <section className={styles.container} aria-label="Área de Conversa Financeira">
      <header className={styles.header}>
        <h2 className={styles.title}>
          Conversa Financeira
          <Tooltip text="Como usar: Digite seus gastos (Ex: 'Gastei 50 com pizza'), receitas ('Recebi 1000 de salário') ou peça conselhos de investimento. Você também pode pedir para zerar sua conta." />
        </h2>
        <BalanceBadge balance={currentBalance} />
      </header>

      <div className={styles.chatHistory}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className={`${styles.message} ${styles.messageBot}`}>
            <div className={`${styles.messageBubble} ${styles.bubbleBot} ${styles.typingBubble}`}>
              Digitando...
            </div>
          </div>
        )}

        <div ref={historyBottomRef} />
      </div>

      <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
    </section>
  );
};
