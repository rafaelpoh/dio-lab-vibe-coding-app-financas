// src/utils/api.ts - Cliente HTTP seguro com Validação de Fronteira Zod (Zero Trust)
import { z } from 'zod';

const API_BASE_URL = '/api';

/**
 * Envia uma requisição POST com JSON e valida a resposta contra um esquema Zod.
 * Garante segurança de tipos na fronteira de I/O, impedindo dados corrompidos de entrarem no estado do React.
 *
 * @param endpoint Caminho relativo a partir de /api
 * @param payload Objeto de dados a enviar no corpo da requisição
 * @param schema Esquema Zod para validação da resposta esperada
 */
export async function postApiSafe<T>(
  endpoint: string,
  payload: unknown,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const rawData: unknown = await response.json();

  if (!response.ok) {
    const errorMsg =
      typeof rawData === 'object' && rawData !== null && 'error' in rawData
        ? String((rawData as { readonly error: unknown }).error)
        : `Erro na requisição (${response.status}): ${response.statusText}`;
    throw new Error(errorMsg);
  }

  const result = schema.safeParse(rawData);
  if (!result.success) {
    console.error(`[API Schema Error] Falha de validação ao consumir ${endpoint}:`, result.error.format());
    throw new Error('A resposta do servidor divergiu do contrato esperado.');
  }

  return result.data;
}
