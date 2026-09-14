"use client";

/**
 * Reads a CSS custom property so scenes pick up the theme from globals.css.
 */
export function getCssColor(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || fallback;
}

export const themeColors = {
  accent: () => getCssColor("--accent", "#1e4d8c"),
  foreground: () => getCssColor("--foreground", "#1c2430"),
  background: () => getCssColor("--background", "#e6e1d6"),
};
