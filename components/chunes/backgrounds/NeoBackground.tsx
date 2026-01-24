"use client";

export function NeoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-neo-background">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Floating decorative shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-neo-secondary border-4 border-black shadow-neo-lg rotate-12 opacity-60" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-neo-muted border-4 border-black shadow-neo-md -rotate-6 opacity-60" />
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-neo-accent border-4 border-black shadow-neo-md rotate-3 opacity-50" />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-neo-secondary border-4 border-black shadow-neo-lg -rotate-12 opacity-40" />

      {/* Large background circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border-4 border-black opacity-10" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border-4 border-black opacity-10" />

      {/* Halftone dots at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-halftone opacity-20" />
    </div>
  );
}
