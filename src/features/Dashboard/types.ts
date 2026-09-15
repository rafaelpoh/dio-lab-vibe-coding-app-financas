// src/features/Dashboard/types.ts - Contratos e Interfaces da Feature Dashboard
import { z } from 'zod';
import type { DashboardDataSchema, BalanceSummarySchema, CategoryExpenseSchema } from './schemas';

export type BalanceSummary = z.infer<typeof BalanceSummarySchema>;
export type CategoryExpense = z.infer<typeof CategoryExpenseSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;

export interface DashboardProps {
  readonly userId: string;
  readonly refreshSignal?: number;
}
