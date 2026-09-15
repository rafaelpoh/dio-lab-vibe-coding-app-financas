// src/features/Dashboard/components/CategoryList.tsx - Lista de Gastos por Categoria
import React, { memo } from 'react';
import type { CategoryExpense } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import styles from '../Dashboard.module.css';

export interface CategoryListProps {
  readonly categories: ReadonlyArray<CategoryExpense>;
}

export const CategoryList: React.FC<CategoryListProps> = memo(({ categories }) => {
  return (
    <div className={`${styles.card} ${styles.reportCard}`}>
      <h3 className={styles.reportTitle}>Despesas por Categoria (Neste Mês)</h3>

      {categories.length === 0 ? (
        <div className={styles.emptyStateContainer} role="status">
          <p className={styles.emptyStateTitle}>Nenhuma despesa registrada neste mês</p>
          <p className={styles.emptyStateText}>
            Converse com o Agente no Chat para registrar seus gastos automaticamente.
          </p>
        </div>
      ) : (
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li key={category.name} className={styles.categoryItem}>
              <span>{category.name}</span>
              <span className={category.current > 0 ? styles.categoryAmountDanger : styles.categoryAmountNeutral}>
                {formatCurrency(category.current)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

CategoryList.displayName = 'CategoryList';
