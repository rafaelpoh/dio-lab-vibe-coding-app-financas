// src/features/Dashboard/components/SummaryCard.tsx - Card de Métrica Individual
import React, { memo } from 'react';
import { Tooltip } from '../../../components/Tooltip/Tooltip';
import { formatCurrency } from '../../../utils/formatters';
import styles from '../Dashboard.module.css';

export interface SummaryCardProps {
  readonly title: string;
  readonly tooltipText: string;
  readonly amount: number;
  readonly variant: 'success' | 'danger' | 'investment' | 'balance';
}

export const SummaryCard: React.FC<SummaryCardProps> = memo(({
  title,
  tooltipText,
  amount,
  variant,
}) => {
  const valueColorClass =
    variant === 'success'
      ? styles.successValue
      : variant === 'danger'
      ? styles.dangerValue
      : variant === 'investment'
      ? styles.investmentValue
      : styles.balanceValue;

  return (
    <div className={`${styles.card} ${styles.summaryCard}`}>
      <h3 className={styles.summaryTitle}>
        {title}
        <Tooltip text={tooltipText} />
      </h3>
      <p className={`${styles.summaryValue} ${valueColorClass}`}>
        {formatCurrency(amount)}
      </p>
    </div>
  );
});

SummaryCard.displayName = 'SummaryCard';
