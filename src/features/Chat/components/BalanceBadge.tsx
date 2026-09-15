// src/features/Chat/components/BalanceBadge.tsx - Indicador de Saldo Atual no Chat
import React, { memo } from 'react';
import { formatCurrency } from '../../../utils/formatters';
import styles from '../Chat.module.css';

export interface BalanceBadgeProps {
  readonly balance: number;
}

export const BalanceBadge: React.FC<BalanceBadgeProps> = memo(({ balance }) => {
  return (
    <div className={styles.balanceBadge} aria-label={`Saldo atual: ${formatCurrency(balance)}`}>
      Saldo: {formatCurrency(balance)}
    </div>
  );
});

BalanceBadge.displayName = 'BalanceBadge';
