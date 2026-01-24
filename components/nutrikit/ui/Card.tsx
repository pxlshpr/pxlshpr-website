import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'terminal';
}

/**
 * Vaporwave Card Component
 *
 * Variants:
 * - default: Glass panel with cyan top border
 * - terminal: Terminal window style with title bar
 */
export function Card({ children, className = '', variant = 'default' }: CardProps) {
  if (variant === 'terminal') {
    return (
      <div className={`terminal-window ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`card transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`card-title ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`card-description ${className}`}>
      {children}
    </p>
  );
}

/**
 * Terminal Window Components
 */
export function TerminalTitleBar({
  title,
  className = ''
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={`terminal-title-bar ${className}`}>
      <div className="terminal-dots">
        <div className="terminal-dot-magenta" />
        <div className="terminal-dot-cyan" />
        <div className="terminal-dot-orange" />
      </div>
      {title && (
        <span className="text-xs font-mono uppercase text-secondary/70">
          {title}
        </span>
      )}
    </div>
  );
}

export function TerminalContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
