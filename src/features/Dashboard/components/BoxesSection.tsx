// src/features/Dashboard/components/BoxesSection.tsx - Seção de Caixinhas e Metas com Gráficos e Sinalizadores
import React, { memo } from 'react';
import type { FinancialBox } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { Tooltip } from '../../../components/Tooltip/Tooltip';
import styles from '../Dashboard.module.css';

export interface BoxesSectionProps {
  readonly boxes: ReadonlyArray<FinancialBox>;
}

export const BoxesSection: React.FC<BoxesSectionProps> = memo(({ boxes }) => {
  return (
    <div className={`${styles.card} ${styles.boxesContainer}`}>
      <div className={styles.boxesHeader}>
        <h3 className={styles.boxesTitle}>
          Minhas Caixinhas & Projetos
          <Tooltip text="Acompanhe suas metas de economia. O sinal verde indica que a parcela do mês já foi guardada e vermelho indica pendência." />
        </h3>
        <span className={styles.boxesCount}>
          {boxes.length} {boxes.length === 1 ? 'meta ativa' : 'metas ativas'}
        </span>
      </div>

      {boxes.length === 0 ? (
        <div className={styles.emptyStateContainer} role="status">
          <p className={styles.emptyStateTitle}>Nenhuma caixinha criada ainda</p>
          <p className={styles.emptyStateText}>
            Crie sua primeira caixinha conversando com o Educador Financeiro no Chat!
            <br />
            Exemplo: <em>&quot;Quero criar uma caixinha para uma viagem daqui a 12 meses de 10 mil&quot;</em>
          </p>
        </div>
      ) : (
        <div className={styles.boxesGrid}>
          {boxes.map((box) => {
            const pct = Math.min(100, Math.max(0, box.progressPercentage));
            const isReached = box.isMonthTargetReached;

            return (
              <div key={box.id} className={styles.boxCard}>
                <div className={styles.boxTopRow}>
                  <div className={styles.boxInfo}>
                    <h4 className={styles.boxName}>{box.name}</h4>
                    <span className={styles.boxDeadline}>
                      Prazo: {box.deadlineMonths} {box.deadlineMonths === 1 ? 'mês' : 'meses'} • Meta:{' '}
                      {formatCurrency(box.monthlyTarget)}/mês
                    </span>
                  </div>

                  {/* Sinalizador Mensal: Verde se guardou no mês, Vermelho se pendente */}
                  <div
                    className={`${styles.monthStatusBadge} ${
                      isReached ? styles.statusGreen : styles.statusRed
                    }`}
                    title={
                      isReached
                        ? `Meta do mês guardada! (${formatCurrency(box.savedThisMonth)})`
                        : `Parcela do mês pendente. Guarde ${formatCurrency(box.monthlyTarget)} este mês.`
                    }
                  >
                    <span
                      className={`${styles.statusDot} ${
                        isReached ? styles.dotGreen : styles.dotRed
                      }`}
                    />
                    <span className={styles.statusLabel}>
                      {isReached ? 'Parcela do mês guardada' : 'Parcela do mês pendente'}
                    </span>
                  </div>
                </div>

                {/* Gráfico Visual de Progresso */}
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className={styles.progressPercentText}>{pct}%</span>
                </div>

                {/* Linha de Balanço da Meta */}
                <div className={styles.boxFooterRow}>
                  <div className={styles.boxMetric}>
                    <span className={styles.metricLabel}>Guardado</span>
                    <span className={styles.metricValuePrimary}>
                      {formatCurrency(box.currentAmount)}
                    </span>
                  </div>
                  <div className={styles.boxMetric}>
                    <span className={styles.metricLabel}>Aporte deste mês</span>
                    <span
                      className={
                        box.savedThisMonth > 0
                          ? styles.metricValueSuccess
                          : styles.metricValueNeutral
                      }
                    >
                      {formatCurrency(box.savedThisMonth)}
                    </span>
                  </div>
                  <div className={styles.boxMetric}>
                    <span className={styles.metricLabel}>Meta Total</span>
                    <span className={styles.metricValueSecondary}>
                      {formatCurrency(box.targetAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

BoxesSection.displayName = 'BoxesSection';
