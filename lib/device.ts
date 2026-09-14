"use client";

/**
 * GPU/device quality heuristics — decides how heavy the 3D scenes can be.
 *
 *  - "high" : desktop, fine pointer, enough cores → full scene
 *  - "low"  : mobile or weak hardware → reduced particle count / dpr
 *  - "off"  : reduced-motion preference or very weak device → static poster
 */
export type QualityTier = "high" | "low" | "off";

export function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "low";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) return "off";

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (cores <= 2 || memory <= 2) return "off";
  // Prefer low on typical laptops so WebGL stays smooth under multitasking
  if (coarsePointer || cores <= 6 || memory <= 4) return "low";
  return "high";
}

/** True on touch-first devices — used to disable the custom cursor. */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
