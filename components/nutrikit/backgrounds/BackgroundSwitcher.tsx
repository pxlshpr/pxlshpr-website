"use client";

import { useState } from "react";
import BackgroundPoll from "@/components/nutrikit/BackgroundPoll";

type BackgroundType =
  | "none"
  | "particles"
  | "lava"
  | "crt"
  | "glow"
  | "mesh";

const options: { value: BackgroundType; label: string; desc: string }[] = [
  { value: "none", label: "None", desc: "Solid background only" },
  { value: "particles", label: "Particles", desc: "Floating dots" },
  { value: "lava", label: "Lava Lamp", desc: "Gooey metaballs" },
  { value: "crt", label: "CRT", desc: "Retro scanlines" },
  { value: "glow", label: "Glow", desc: "Spinning conic" },
  { value: "mesh", label: "Mesh", desc: "Original gradient" },
];

export default function BackgroundSwitcher() {
  const [bg, setBg] = useState<BackgroundType>("lava");
  const [isOpen, setIsOpen] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);

  const currentOption = options.find((o) => o.value === bg);

  return (
    <>
      {/* Particles */}
      {bg === "particles" && (
        <div className="particles-overlay">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
      )}

      {/* Lava Lamp - gooey metaballs */}
      {bg === "lava" && (
        <div className="lava-overlay">
          <div className="lava-blob" />
          <div className="lava-blob" />
          <div className="lava-blob" />
          <div className="lava-blob" />
        </div>
      )}

      {/* CRT - retro scanlines */}
      {bg === "crt" && <div className="crt-overlay" />}

      {/* Glow - spinning conic */}
      {bg === "glow" && <div className="glow-overlay" />}

      {/* Mesh - original gradient */}
      {bg === "mesh" && (
        <>
          <div className="mesh-gradient-transparent" />
          <div className="noise-overlay" />
        </>
      )}

      {/* Dropdown menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 max-h-80 overflow-y-auto glass rounded-xl shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setBg(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  bg === option.value
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-white/10 text-foreground/80"
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted">{option.desc}</div>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Poll button */}
          <button
            onClick={() => setIsPollOpen(true)}
            className="p-2 rounded-full glass opacity-70 hover:opacity-100 transition-opacity"
            title="Vote for your favorite background"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>

          {/* Background selector */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 text-xs font-mono rounded-full glass-subtle opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            <span>{currentOption?.label}</span>
            <svg
              className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Poll Dialog */}
      <BackgroundPoll isOpen={isPollOpen} onClose={() => setIsPollOpen(false)} />
    </>
  );
}
