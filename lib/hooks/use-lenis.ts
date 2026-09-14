"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./use-reduced-motion";

let instance: Lenis | null = null;

/** Access the global Lenis instance (null on server / reduced motion). */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Initializes global smooth scroll and keeps GSAP ScrollTrigger in sync.
 * Mounted once via `<SmoothScroll />` in the root layout.
 * Automatically disabled when the user prefers reduced motion.
 */
export function useLenis() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.14,
      anchors: true,
      // Avoid fighting the preloader / first paint
      autoRaf: false,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, [reducedMotion]);
}
