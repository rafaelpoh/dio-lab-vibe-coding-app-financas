// src/features/Dashboard/schemas.ts - Esquemas Zod para o Dashboard
import { z } from 'zod';

export const BalanceSummarySchema = z.object({
  income: z.number(),
  totalIncome: z.number().optional(),
  expense: z.number(),
  investment: z.number(),
  current: z.number(),
});

export const CategoryExpenseSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  current: z.number(),
});

export const FinancialBoxSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  deadlineMonths: z.number(),
  monthlyTarget: z.number(),
  progressPercentage: z.number(),
  savedThisMonth: z.number(),
  isMonthTargetReached: z.boolean(),
});

export const DashboardDataSchema = z.object({
  balance: BalanceSummarySchema,
  categories: z.array(CategoryExpenseSchema),
  boxes: z.array(FinancialBoxSchema).default([]),
});
