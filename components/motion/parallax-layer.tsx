"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { isTouchDevice } from "@/lib/device";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /**
   * Parallax intensity: positive scrolls slower (background feel),
   * negative scrolls faster (foreground feel). Sensible range: -1 … 1.
   */
  speed?: number;
}

/** Scroll-scrubbed vertical parallax wrapper. */
export function ParallaxLayer({
  children,
  className,
  speed = 0.3,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      // Skip on touch — parallax + Lenis/native pins already cost enough
      if (reducedMotion || !ref.current || isTouchDevice()) return;
      gsap.fromTo(
        ref.current,
        { y: () => speed * -120 },
        {
          y: () => speed * 120,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    },
    { dependencies: [reducedMotion, speed], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
