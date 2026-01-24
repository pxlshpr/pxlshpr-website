"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-foreground)] text-[var(--color-background)] border-0 hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)] hover:border-2 hover:border-[var(--color-foreground)] transition-none",
  secondary:
    "bg-[var(--color-background)] text-[var(--color-foreground)] border-2 border-[var(--color-foreground)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors duration-100",
  outline:
    "bg-transparent text-[var(--color-foreground)] border-2 border-[var(--color-foreground)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors duration-100",
  ghost:
    "bg-transparent text-[var(--color-foreground)] border-0 hover:underline transition-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-11 px-5 text-sm",
  md: "h-14 px-8 text-sm",
  lg: "h-16 px-8 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center gap-3
          font-medium tracking-[0.1em] uppercase
          focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-foreground)] focus-visible:outline-offset-3
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        style={{ fontFamily: "var(--font-display)" }}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
