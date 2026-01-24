import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

/**
 * Vaporwave Button Component
 *
 * Variants:
 * - primary: Skewed cyan outline that fills on hover
 * - secondary: Magenta filled, un-skews on hover
 * - outline: Magenta outline, fills on hover
 * - ghost: Transparent, subtle hover effect
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className = '', children, ...props }, ref) => {
    const baseClasses = 'btn';
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
    };
    const sizeClasses = {
      sm: 'btn-sm',
      default: '',
      lg: 'btn-lg',
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ');

    // For skewed buttons (primary, secondary), wrap content in a counter-skew span
    const needsCounterSkew = variant === 'primary' || variant === 'secondary';

    return (
      <button ref={ref} className={classes} {...props}>
        {needsCounterSkew ? <span>{children}</span> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
