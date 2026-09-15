// src/components/Tooltip/Tooltip.tsx - Componente de Dica Visual (Hover Card)
import React, { memo } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  readonly text: string;
}

export const Tooltip: React.FC<TooltipProps> = memo(({ text }) => {
  return (
    <span className={styles.tooltipContainer} aria-label={text} role="tooltip">
      ?
      <span className={styles.tooltipText}>{text}</span>
    </span>
  );
});

Tooltip.displayName = 'Tooltip';
