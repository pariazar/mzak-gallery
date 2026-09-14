"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * Giant brush calligraphy draws itself across the page as you scroll —
 * ink path + following brush tip + pigment splatters.
 */
export function StoryBrushScript() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const path =
        rootRef.current.querySelector<SVGPathElement>("[data-ink-path]");
      const brush = rootRef.current.querySelector<HTMLElement>("[data-brush]");
      const fills = rootRef.current.querySelectorAll("[data-fill-bloom]");
      const words = rootRef.current.querySelectorAll("[data-script-word]");

      if (!path) return;

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.set(fills, { opacity: 0, scale: 0.5 });
      gsap.set(words, { opacity: 0, y: 20 });
      if (brush) gsap.set(brush, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=360%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (!brush || !path || !rootRef.current) return;
            const d = Math.min(0.98, Math.max(0.02, self.progress * 0.92));
            const p1 = path.getPointAtLength(length * d);
            const p0 = path.getPointAtLength(length * Math.max(0, d - 0.012));
            const angle =
              (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI + 35;

            const svg = path.ownerSVGElement;
            if (!svg) return;
            const pt = svg.createSVGPoint();
            pt.x = p1.x;
            pt.y = p1.y;
            const sp = pt.matrixTransform(path.getScreenCTM()!);
            const rootBox = rootRef.current.getBoundingClientRect();
            gsap.set(brush, {
              x: sp.x - rootBox.left,
              y: sp.y - rootBox.top,
              rotation: angle,
              opacity: self.progress > 0.02 && self.progress < 0.95 ? 1 : 0,
            });
          },
        },
      });

      tl.to(path, { strokeDashoffset: 0, duration: 3, ease: "none" }, 0);
      tl.to(
        fills,
        { opacity: 0.7, scale: 1, stagger: 0.2, duration: 0.8 },
        1.2,
      );
      tl.to(words, { opacity: 1, y: 0, stagger: 0.25, duration: 0.6 }, 2.2);

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => st.trigger === rootRef.current)
          .forEach((st) => st.kill());
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="relative h-svh overflow-hidden border-t border-border bg-[#1a1410]"
      aria-label="Brush script"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, #1e4d8c66, transparent 50%), radial-gradient(ellipse at 70% 60%, #c43c2e44, transparent 45%)",
        }}
        aria-hidden="true"
      />

      {[
        { x: "18%", y: "42%", c: "#1e4d8c" },
        { x: "38%", y: "28%", c: "#c9a227" },
        { x: "55%", y: "48%", c: "#c43c2e" },
        { x: "72%", y: "35%", c: "#1f7a6c" },
      ].map((b, i) => (
        <div
          key={i}
          data-fill-bloom
          className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-56 md:w-56"
          style={{
            left: b.x,
            top: b.y,
            background: `radial-gradient(circle, ${b.c}aa, transparent 70%)`,
            filter: "blur(10px)",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
        />
      ))}

      <div className="container-x relative z-10 pt-14 md:pt-16">
        <p className="text-label mb-3 tracking-[0.24em] text-[#f3ebe3]/50">
          Chapter — Ink remembers
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {["Water", "writes", "first."].map((w) => (
            <span
              key={w}
              data-script-word
              className="font-display text-[clamp(1.5rem,4vw,2.75rem)] italic text-[#f3ebe3]/85"
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ink-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8eb4e0" />
            <stop offset="40%" stopColor="#f3ebe3" />
            <stop offset="70%" stopColor="#e8a090" />
            <stop offset="100%" stopColor="#c9a227" />
          </linearGradient>
          <filter id="ink-bleed">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <path
          d="M80 420 C200 180 320 520 480 300 S780 180 920 380 S1100 520 1140 280"
          fill="none"
          stroke="#1e4d8c"
          strokeWidth="28"
          opacity="0.15"
          strokeLinecap="round"
          filter="url(#ink-bleed)"
        />
        <path
          data-ink-path
          d="M80 420 C200 180 320 520 480 300 S780 180 920 380 S1100 520 1140 280"
          fill="none"
          stroke="url(#ink-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="200" cy="300" r="3" fill="#f3ebe3" opacity="0.5" />
        <circle cx="600" cy="260" r="2.5" fill="#c9a227" opacity="0.6" />
        <circle cx="980" cy="360" r="3.5" fill="#e8a090" opacity="0.55" />
      </svg>

      <div
        data-brush
        className="pointer-events-none absolute left-0 top-0 z-20"
        style={{ marginLeft: -8, marginTop: -40 }}
        aria-hidden="true"
      >
        <svg width="28" height="72" viewBox="0 0 28 72" fill="none">
          <rect x="11" y="0" width="6" height="28" rx="1" fill="#c4a574" />
          <rect x="10" y="26" width="8" height="10" rx="1" fill="#3a2a1a" />
          <path
            d="M10 36 C8 48 6 58 14 72 C20 58 20 48 18 36 Z"
            fill="#1a1410"
          />
          <path
            d="M12 40 C11 50 12 60 14 68 C16 60 17 50 16 40 Z"
            fill="#1e4d8c"
            opacity="0.7"
          />
        </svg>
      </div>

      <p className="absolute bottom-10 left-0 right-0 text-center font-display text-sm italic text-[#f3ebe3]/45">
        Follow the brush — the line is the story
      </p>
    </section>
  );
}
