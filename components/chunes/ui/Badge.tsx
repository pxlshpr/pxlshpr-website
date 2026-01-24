"use client";

import { type ReactNode, type HTMLAttributes } from "react";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "muted";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]",
  accent: "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)] border-0",
  success: "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)] border-0",
  warning: "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)] border-0",
  muted: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-0",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-xs",
  lg: "px-5 py-2 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium tracking-[0.1em] uppercase
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{ fontFamily: "var(--font-mono)" }}
      {...props}
    >
      {children}
    </span>
  );
}
