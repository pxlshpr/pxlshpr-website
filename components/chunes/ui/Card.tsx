"use client";

import { type ReactNode, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "border" | "inverted";
  hoverable?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  inverted?: boolean;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const cardVariants = {
  default: "bg-[var(--color-card)] border border-[var(--color-border-light)]",
  border: "bg-[var(--color-card)] border-2 border-[var(--color-border)]",
  inverted: "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)] border-0",
};

export function Card({
  children,
  variant = "default",
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        text-[var(--color-card-foreground)]
        ${cardVariants[variant]}
        ${hoverable ? "group cursor-pointer transition-colors duration-100 hover:bg-[var(--color-foreground)] hover:text-[var(--color-accent-foreground)]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  inverted = false,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`
        px-8 py-6
        ${inverted ? "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)]" : "border-b border-[var(--color-border-light)]"}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: CardContentProps) {
  return (
    <div className={`px-8 py-8 ${className}`} {...props}>
      {children}
    </div>
  );
}
