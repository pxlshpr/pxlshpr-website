"use client";

export function ClayBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 bg-clay-background">
      {/* Violet Blob - Top Left */}
      <div
        className="absolute h-[60vh] w-[60vh] rounded-full bg-[#8B5CF6]/10 blur-3xl animate-clay-float"
        style={{
          top: "-10%",
          left: "-10%",
        }}
      />

      {/* Pink Blob - Top Right */}
      <div
        className="absolute h-[50vh] w-[50vh] rounded-full bg-[#EC4899]/10 blur-3xl animate-clay-float-delayed animation-delay-2000"
        style={{
          top: "20%",
          right: "-10%",
        }}
      />

      {/* Sky Blue Blob - Center */}
      <div
        className="absolute h-[55vh] w-[55vh] rounded-full bg-[#0EA5E9]/10 blur-3xl animate-clay-float animation-delay-4000"
        style={{
          top: "50%",
          left: "30%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Emerald Blob - Bottom Left */}
      <div
        className="absolute h-[45vh] w-[45vh] rounded-full bg-[#10B981]/10 blur-3xl animate-clay-float-delayed"
        style={{
          bottom: "-5%",
          left: "-5%",
        }}
      />

      {/* Amber Blob - Bottom Right */}
      <div
        className="absolute h-[40vh] w-[40vh] rounded-full bg-[#F59E0B]/10 blur-3xl animate-clay-float animation-delay-2000"
        style={{
          bottom: "10%",
          right: "10%",
        }}
      />
    </div>
  );
}
