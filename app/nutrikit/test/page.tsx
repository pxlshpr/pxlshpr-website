"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [darkColor, setDarkColor] = useState("#0a0612");
  const [lightColor, setLightColor] = useState("#f8f5fc");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Detect color scheme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const color = isDark ? darkColor : lightColor;
    document.documentElement.style.background = color;
    document.body.style.background = color;

    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, [isDark, darkColor, lightColor]);

  const currentColor = isDark ? darkColor : lightColor;
  const textColor = isDark ? "#fff" : "#000";

  const darkPresets = [
    { name: "Base", color: "#050508" },
    { name: "Purple Tint", color: "#0a0612" },
    { name: "Blue Tint", color: "#05080a" },
    { name: "Warm", color: "#0a0808" },
  ];

  const lightPresets = [
    { name: "Base", color: "#fafafa" },
    { name: "Purple Tint", color: "#f8f5fc" },
    { name: "Blue Tint", color: "#f5f8fc" },
    { name: "Warm", color: "#fcfaf8" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: currentColor,
        padding: "80px 20px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <h1 style={{ color: textColor, fontSize: "20px", fontWeight: "bold" }}>
        Theme Color Picker
      </h1>

      <p style={{ color: textColor, opacity: 0.7, fontSize: "14px" }}>
        Mode: {isDark ? "Dark" : "Light"} · Current: {currentColor}
      </p>

      {/* Dark Mode Colors */}
      <div style={{ width: "100%", maxWidth: "300px" }}>
        <p style={{ color: textColor, fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>
          Dark Mode Color:
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
          <input
            type="color"
            value={darkColor}
            onChange={(e) => setDarkColor(e.target.value)}
            style={{ width: "50px", height: "36px" }}
          />
          <input
            type="text"
            value={darkColor}
            onChange={(e) => setDarkColor(e.target.value)}
            style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #666" }}
          />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {darkPresets.map((p) => (
            <button
              key={p.name}
              onClick={() => setDarkColor(p.color)}
              style={{
                padding: "6px 10px",
                fontSize: "11px",
                borderRadius: "6px",
                border: darkColor === p.color ? "2px solid #007aff" : "1px solid #444",
                backgroundColor: p.color,
                color: "#fff",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Light Mode Colors */}
      <div style={{ width: "100%", maxWidth: "300px" }}>
        <p style={{ color: textColor, fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>
          Light Mode Color:
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
          <input
            type="color"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
            style={{ width: "50px", height: "36px" }}
          />
          <input
            type="text"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
            style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {lightPresets.map((p) => (
            <button
              key={p.name}
              onClick={() => setLightColor(p.color)}
              style={{
                padding: "6px 10px",
                fontSize: "11px",
                borderRadius: "6px",
                border: lightColor === p.color ? "2px solid #007aff" : "1px solid #ccc",
                backgroundColor: p.color,
                color: "#000",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
