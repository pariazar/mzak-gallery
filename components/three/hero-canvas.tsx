"use client";

import { CanvasWrapper } from "@/components/three/canvas-wrapper";
import { HeroScene } from "@/components/three/scenes/hero-scene";

/** Fullscreen hero background canvas — used on the homepage. */
export function HeroCanvas({ className }: { className?: string }) {
  return (
    <CanvasWrapper className={className}>
      <HeroScene />
    </CanvasWrapper>
  );
}
