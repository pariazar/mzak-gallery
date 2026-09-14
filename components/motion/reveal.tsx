"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Vertical travel distance in px */
  y?: number;
  delay?: number;
  duration?: number;
  /** Animate only the first time it enters the viewport */
  once?: boolean;
  /** ScrollTrigger start position */
  start?: string;
}

/**
 * Generic scroll-driven reveal: fades + translates content
 * when it enters the viewport. Reduced-motion safe.
 */
export function Reveal({
  children,
  className,
  y = 40,
  delay = 0,
  duration = 1.1,
  once = true,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: EASE.expo,
          scrollTrigger: {
            trigger: ref.current,
            start,
            once,
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
