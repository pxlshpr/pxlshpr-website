"use client";

export function MonochromeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[var(--color-background)]">
      {/* Horizontal lines texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            #000 1px,
            #000 2px
          )`,
          backgroundSize: '100% 4px',
          opacity: 0.015,
        }}
      />
    </div>
  );
}
