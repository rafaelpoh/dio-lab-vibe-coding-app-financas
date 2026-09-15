// src/features/Auth/schemas.ts - Esquemas Zod para Validação de Fronteira do Firebase Auth
import { z } from 'zod';

export const CredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'O e-mail é obrigatório.')
    .email('Informe um endereço de e-mail válido.'),
  password: z
    .string()
    .min(6, 'A senha deve conter no mínimo 6 caracteres.'),
  isSignUp: z.boolean().optional(),
});
