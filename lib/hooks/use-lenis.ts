"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isTouchDevice } from "@/lib/device";
import { useReducedMotion } from "./use-reduced-motion";

let instance: Lenis | null = null;

/** Access the global Lenis instance (null on server / reduced motion / touch). */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Initializes global smooth scroll and keeps GSAP ScrollTrigger in sync.
 * Mounted once via `<SmoothScroll />` in the root layout.
 *
 * Touch devices keep native scrolling — Lenis + many pinned sections
 * feels laggy on phones. Desktop gets a softer, synced Lenis curve.
 */
export function useLenis() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || isTouchDevice()) return;

    const lenis = new Lenis({
      // Lower lerp = silkier catch-up (was 0.14 / snappier but choppier)
      lerp: 0.09,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      syncTouch: false,
      smoothWheel: true,
      anchors: true,
      autoRaf: false,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Mild lag smoothing keeps scrub stable after tab switches without
    // dropping long stretches of frames (0 made catch-up feel stuttery).
    gsap.ticker.lagSmoothing(500, 33);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, [reducedMotion]);
}
