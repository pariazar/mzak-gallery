"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { isTouchDevice } from "@/lib/device";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0–1) */
  strength?: number;
}

/**
 * Magnetic wrapper — the element is gently attracted to the cursor
 * while hovered and springs back on leave. Wrap buttons/links with it.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion || isTouchDevice()) return;

      const xTo = gsap.quickTo(el, "x", {
        duration: 0.9,
        ease: "elastic.out(1, 0.4)",
      });
      const yTo = gsap.quickTo(el, "y", {
        duration: 0.9,
        ease: "elastic.out(1, 0.4)",
      });

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [reducedMotion, strength] },
  );

  return (
    <div
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </div>
  );
}
