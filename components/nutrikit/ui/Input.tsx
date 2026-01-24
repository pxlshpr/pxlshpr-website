import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Vaporwave Terminal-Style Input Component
 *
 * Features:
 * - Underline border only (magenta by default, cyan on focus)
 * - Black background
 * - Cyan text
 * - Neon glow on focus
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-mono uppercase tracking-wider text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-terminal w-full ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs font-mono text-primary">
            &gt; {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
