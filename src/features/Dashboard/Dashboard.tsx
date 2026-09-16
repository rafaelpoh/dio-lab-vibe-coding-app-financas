// src/features/Dashboard/Dashboard.tsx - Componente Raiz da Feature de Dashboard
import React from 'react';
import type { DashboardProps } from './types';
import { useDashboard } from './hooks/useDashboard';
import { SummaryCard } from './components/SummaryCard';
import { PieChart } from './components/PieChart';
import { BoxesSection } from './components/BoxesSection';
import { CategoryList } from './components/CategoryList';
import { Tooltip } from '../../components/Tooltip/Tooltip';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC<DashboardProps> = ({ userId, refreshSignal = 0 }) => {
  const { data, isLoading, error, depositMonthlyTarget } = useDashboard(userId, refreshSignal);

  return (
    <section className={styles.section} aria-label="Painel Financeiro">
      <header className={styles.header}>
        <h2 className={styles.title}>
          Dashboard
          <Tooltip text="Este painel é atualizado automaticamente conforme você conversa com o Agente Financeiro." />
        </h2>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      {isLoading && (
        <p className={styles.loadingIndicator}>
          Atualizando indicadores...
        </p>
      )}

      <div className={styles.cardsGrid}>
        <SummaryCard
          title="Receitas"
          tooltipText="Receita líquida disponível (total de receitas recebidas deduzindo os valores direcionados a investimentos e caixinhas)."
          amount={data.balance.income}
          variant="success"
        />

        <SummaryCard
          title="Despesas"
          tooltipText="A soma de todos os seus gastos reportados nas conversas com o Agente."
          amount={data.balance.expense}
          variant="danger"
        />

        <SummaryCard
          title="Investimentos"
          tooltipText="Valores que você decidiu guardar ou aplicar, separados das despesas comuns."
          amount={data.balance.investment}
          variant="investment"
        />
      </div>

      <BoxesSection
        boxes={data.boxes}
        onDepositMonthlyTarget={depositMonthlyTarget}
      />

      <PieChart
        income={data.balance.income}
        expense={data.balance.expense}
        investment={data.balance.investment}
      />

      <CategoryList categories={data.categories} />
    </section>
  );
};
