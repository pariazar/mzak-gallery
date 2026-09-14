"use client";

import { useLenis } from "@/lib/hooks/use-lenis";

/** Effect-only component — mounts global Lenis smooth scroll. */
export function SmoothScroll() {
  useLenis();
  return null;
}
