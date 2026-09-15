// src/features/Chat/schemas.ts - Esquemas Zod para Validação da IA
import { z } from 'zod';

export const TransactionPayloadSchema = z.object({
  amount: z.number().catch(0),
  category: z.string().catch(''),
  description: z.string().catch(''),
  type: z.string().catch(''),
  botMessage: z.string().optional(),
});

export const ChatResponseSchema = z.object({
  text: z.string(),
  transaction: TransactionPayloadSchema.optional(),
});
