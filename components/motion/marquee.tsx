"use client";

import { type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  /** Gap between repeated groups */
  gapClassName?: string;
}

/**
 * Infinite CSS marquee — content is duplicated once and translated -50%.
 * Static (no animation) when reduced motion is preferred.
 */
export function Marquee({
  children,
  className,
  duration = 30,
  reverse = false,
  gapClassName = "gap-[4vw] pr-[4vw]",
}: MarqueeProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      role="presentation"
    >
      <div
        className={cn(
          "flex w-max",
          !reducedMotion && "animate-marquee",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className={cn("flex shrink-0 items-center", gapClassName)}>
          {children}
        </div>
        <div
          className={cn("flex shrink-0 items-center", gapClassName)}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
