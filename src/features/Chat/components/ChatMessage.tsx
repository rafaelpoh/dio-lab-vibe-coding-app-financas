// src/features/Chat/components/ChatMessage.tsx - Balão de Mensagem Individual Puro
import React, { memo } from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import styles from '../Chat.module.css';

export interface ChatMessageProps {
  readonly message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = memo(({ message }) => {
  const isUser = message.sender === 'user';
  const containerClass = isUser ? styles.messageUser : styles.messageBot;
  const bubbleClass = isUser ? styles.bubbleUser : styles.bubbleBot;

  return (
    <div className={`${styles.message} ${containerClass}`}>
      <div className={`${styles.messageBubble} ${bubbleClass}`}>
        {message.text}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
