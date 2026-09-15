// src/features/Dashboard/schemas.ts - Esquemas Zod para o Dashboard
import { z } from 'zod';

export const BalanceSummarySchema = z.object({
  income: z.number(),
  expense: z.number(),
  investment: z.number(),
  current: z.number(),
});

export const CategoryExpenseSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  current: z.number(),
});

export const DashboardDataSchema = z.object({
  balance: BalanceSummarySchema,
  categories: z.array(CategoryExpenseSchema),
});
