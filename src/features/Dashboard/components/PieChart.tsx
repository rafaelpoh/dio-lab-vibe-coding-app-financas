// src/features/Dashboard/components/PieChart.tsx - Gráfico Conic-Gradient Nativo (Zero Dependências)
import React, { useMemo, memo } from 'react';
import { Tooltip } from '../../../components/Tooltip/Tooltip';
import styles from '../Dashboard.module.css';

export interface PieChartProps {
  readonly income: number;
  readonly expense: number;
  readonly investment: number;
}

export const PieChart: React.FC<PieChartProps> = memo(({
  income,
  expense,
  investment,
}) => {
  const chartStyle = useMemo(() => {
    const total = income + expense + investment;
    if (total <= 0) {
      return { background: 'var(--color-bg-tertiary)' };
    }

    const incomePct = (income / total) * 100;
    const expensePct = (expense / total) * 100;

    const point1 = incomePct.toFixed(1);
    const point2 = (incomePct + expensePct).toFixed(1);

    // Conic gradient nativo sem sobrecarga de bibliotecas de terceiros
    const gradient = `conic-gradient(
      var(--color-success) 0% ${point1}%,
      var(--color-danger) ${point1}% ${point2}%,
      var(--color-investment) ${point2}% 100%
    )`;

    return { background: gradient };
  }, [income, expense, investment]);

  return (
    <div className={`${styles.card} ${styles.chartCard}`}>
      <h3 className={styles.chartTitle}>
        Distribuição da Carteira
        <Tooltip text="Uma visão gráfica em tempo real de como seu dinheiro está sendo dividido." />
      </h3>

      <div
        className={styles.pieChart}
        style={chartStyle}
        role="img"
        aria-label="Gráfico de distribuição da carteira entre receitas, despesas e investimentos"
      />

      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendSuccess}`} />
          Receitas
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDanger}`} />
          Despesas
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendInvestment}`} />
          Investimentos
        </div>
      </div>
    </div>
  );
});

PieChart.displayName = 'PieChart';
