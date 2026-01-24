"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-3">
        {label && (
          <label
            htmlFor={inputId}
            className="font-medium text-xs uppercase tracking-[0.1em] text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            h-14 px-0 py-4
            bg-transparent
            border-0 border-b-2 border-[var(--color-border)]
            font-normal text-base text-[var(--color-foreground)]
            placeholder:text-[var(--color-muted-foreground)] placeholder:italic
            focus:border-b-[4px]
            focus:outline-none
            transition-none
            ${error ? "border-b-[var(--color-foreground)]" : ""}
            ${className}
          `}
          style={{ fontFamily: "var(--font-body)" }}
          {...props}
        />
        {error && (
          <span className="text-[var(--color-foreground)] font-medium text-sm italic">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
