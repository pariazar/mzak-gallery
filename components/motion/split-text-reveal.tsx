"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface SplitTextRevealProps {
  children: ReactNode;
  /** Rendered element — h1, h2, p… */
  as?: ElementType;
  className?: string;
  /** Split granularity */
  type?: "lines" | "words" | "chars";
  /**
   * "scroll" plays when entering the viewport;
   * "manual" waits for the `play` prop (e.g. after the preloader).
   */
  trigger?: "scroll" | "manual";
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
}

/**
 * Cinematic masked text reveal built on GSAP SplitText (free since 3.13).
 * Lines/words/chars slide up from behind a mask with stagger.
 * Falls back to plain visible text when reduced motion is preferred.
 */
export function SplitTextReveal({
  children,
  as = "div",
  className,
  type = "lines",
  trigger = "scroll",
  play = false,
  delay = 0,
  stagger,
  duration = 1.2,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const animRef = useRef<gsap.core.Tween | null>(null);
  const playedRef = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (reducedMotion || !el) return;

      // Hide until the split is ready to avoid a flash of unstyled text
      gsap.set(el, { autoAlpha: 0 });

      const defaultStagger =
        stagger ?? (type === "chars" ? 0.02 : type === "words" ? 0.05 : 0.09);

      const split = SplitText.create(el, {
        type: type === "lines" ? "lines" : `lines,${type}`,
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          const targets =
            type === "chars"
              ? self.chars
              : type === "words"
                ? self.words
                : self.lines;

          const shouldPause = trigger === "manual" && !playedRef.current;

          const tween = gsap.from(targets, {
            yPercent: 110,
            duration,
            delay,
            stagger: defaultStagger,
            ease: EASE.expo,
            paused: shouldPause,
            ...(trigger === "scroll"
              ? {
                  scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    once: true,
                  },
                }
              : {}),
          });
          animRef.current = tween;
          return tween;
        },
      });

      return () => {
        split.revert();
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  // Manual trigger — e.g. hero title synced with the preloader
  useGSAP(
    () => {
      if (trigger !== "manual" || !play || playedRef.current) return;
      playedRef.current = true;
      animRef.current?.play();
    },
    { dependencies: [play, trigger] },
  );

  // eslint-disable-next-line react-hooks/refs -- the ref is forwarded to the element, never read during render
  return createElement(as, { ref, className: cn(className) }, children);
}
