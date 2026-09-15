// src/utils/formatters.ts - Funções puras de formatação (SRP & Clean Code)

/**
 * Formata um valor numérico para moeda brasileira (BRL).
 * @param value Valor numérico a ser formatado.
 * @returns String formatada em Real (ex: R$ 1.250,00).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Retorna o valor formatado em moeda brasileira sem o prefixo 'R$',
 * útil para exibição em badges ou tags de saldo com prefixo estático.
 */
export function formatCurrencyNumberOnly(value: number): string {
  return formatCurrency(value).replace('R$', '').trim();
}

/**
 * Retorna a data no formato ISO YYYY-MM-DD.
 */
export function getISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0] ?? '';
}
