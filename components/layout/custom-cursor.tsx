"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { isTouchDevice } from "@/lib/device";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Variant = "default" | "hover" | "view" | "drag";

const SIZE: Record<Variant, number> = {
  default: 10,
  hover: 56,
  view: 88,
  drag: 88,
};

/**
 * Custom cursor — a small dot that grows into a labelled circle over
 * interactive elements. Purely decorative (aria-hidden, pointer-events
 * none) so keyboard and screen-reader navigation are unaffected.
 *
 * Drive it from any element with data attributes:
 *   <a data-cursor="hover">…</a>
 *   <div data-cursor="view" data-cursor-label="View">…</div>
 *   <div data-cursor="drag" data-cursor-label="Drag">…</div>
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion || isTouchDevice()) return;
      setEnabled(true);

      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });

      const onOver = (e: PointerEvent) => {
        const target = (e.target as Element | null)?.closest?.("[data-cursor]");
        if (target) {
          const v = (target.getAttribute("data-cursor") as Variant) || "hover";
          setVariant(SIZE[v] ? v : "hover");
          setLabel(target.getAttribute("data-cursor-label") ?? "");
        } else {
          setVariant("default");
          setLabel("");
        }
      };

      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("pointerover", onOver);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("pointerover", onOver);
      };
    },
    { dependencies: [reducedMotion] },
  );

  // Animate size / style on variant change
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !enabled) return;
      gsap.to(el, {
        width: SIZE[variant],
        height: SIZE[variant],
        duration: 0.4,
        ease: "back.out(2)",
      });
    },
    { dependencies: [variant, enabled] },
  );

  if (reducedMotion) return null;

  const filled = variant === "view" || variant === "drag";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[300] hidden items-center justify-center rounded-full md:flex",
        filled
          ? "bg-accent text-accent-foreground"
          : "bg-foreground mix-blend-difference",
      )}
      style={{ width: SIZE.default, height: SIZE.default }}
    >
      {filled && label && (
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em]">
          {label}
        </span>
      )}
    </div>
  );
}
