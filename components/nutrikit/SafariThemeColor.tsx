"use client";

import { useEffect } from "react";

interface SafariThemeColorProps {
  darkColor: string;
  lightColor: string;
}

export default function SafariThemeColor({ darkColor, lightColor }: SafariThemeColorProps) {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateColor = () => {
      const color = mediaQuery.matches ? darkColor : lightColor;
      // Only set html background - body stays transparent for mesh gradient
      document.documentElement.style.background = color;
    };

    updateColor();
    mediaQuery.addEventListener("change", updateColor);

    return () => {
      mediaQuery.removeEventListener("change", updateColor);
      document.documentElement.style.background = "";
    };
  }, [darkColor, lightColor]);

  return null;
}
