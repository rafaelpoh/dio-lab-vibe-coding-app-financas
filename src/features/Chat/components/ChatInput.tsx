// src/features/Chat/components/ChatInput.tsx - Área de Entrada de Texto do Chat
import React, { useState, memo } from 'react';
import styles from '../Chat.module.css';

export interface ChatInputProps {
  readonly onSendMessage: (content: string) => void;
  readonly disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = memo(({
  onSendMessage,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setInputText('');
  };

  return (
    <form className={styles.inputArea} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder="Digite sua mensagem (ex: Gastei 50 com pizza)..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={disabled}
        autoComplete="off"
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={disabled || !inputText.trim()}
        aria-label="Enviar Mensagem"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';
