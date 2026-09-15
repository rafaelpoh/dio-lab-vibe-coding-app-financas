// src/features/Dashboard/hooks/useDashboard.ts - Hook de dados do Dashboard
import { useState, useEffect, useCallback } from 'react';
import { postApiSafe } from '../../../utils/api';
import { DashboardDataSchema } from '../schemas';
import type { DashboardData } from '../types';

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  balance: { income: 0, expense: 0, investment: 0, current: 0 },
  categories: [],
};

export function useDashboard(userId: string, refreshSignal: number = 0) {
  const [data, setData] = useState<DashboardData>(DEFAULT_DASHBOARD_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (): Promise<void> => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await postApiSafe('/dashboard', { userId }, DashboardDataSchema);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar métricas.';
      setError(message);
      // Fallback gracioso para manter a UI operacional
      setData(DEFAULT_DASHBOARD_DATA);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard, refreshSignal]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
