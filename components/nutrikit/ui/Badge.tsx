import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'magenta' | 'orange';
  className?: string;
  skewed?: boolean;
}

/**
 * Vaporwave Badge Component
 *
 * A small label with neon border and skewed appearance
 * Variants: cyan, magenta, orange
 */
export function Badge({ children, variant = 'cyan', className = '', skewed = true }: BadgeProps) {
  const variantClasses = {
    cyan: 'badge-cyan',
    magenta: 'badge-magenta',
    orange: 'badge-orange',
  };

  const classes = [
    'badge',
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {skewed ? <span>{children}</span> : children}
    </div>
  );
}
