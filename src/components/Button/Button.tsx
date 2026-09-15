// src/components/Button/Button.tsx - Componente de Botão desacoplado e reutilizável
import React, { memo } from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly variant?: 'primary' | 'secondary' | 'icon';
  readonly disabled?: boolean;
  readonly ariaLabel?: string;
  readonly className?: string;
}

export const Button: React.FC<ButtonProps> = memo(({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  ariaLabel,
  className,
}) => {
  const variantClass = styles[variant] ?? styles.primary;
  const combinedClasses = className ? `${styles.button} ${variantClass} ${className}` : `${styles.button} ${variantClass}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={combinedClasses}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
