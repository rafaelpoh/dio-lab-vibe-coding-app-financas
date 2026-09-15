// src/features/Chat/types.ts - Contratos e Interfaces da Feature Chat

export interface TransactionPayload {
  readonly amount: number;
  readonly category: string;
  readonly description: string;
  readonly type: string;
  readonly botMessage?: string;
}

export interface ChatApiResponse {
  readonly text: string;
  readonly transaction?: TransactionPayload;
}

export interface ChatMessage {
  readonly id: string;
  readonly sender: 'user' | 'bot';
  readonly text: string;
  readonly timestamp: number;
}

export interface ChatProps {
  readonly userId: string;
  readonly currentBalance: number;
  readonly onTransactionCreated: () => void;
}
