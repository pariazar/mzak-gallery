"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { WashField } from "@/components/art/wash-field";

const TOOLS = [
  {
    id: "palette",
    label: "Porcelain palette",
    x: "12%",
    y: "28%",
    rot: -8,
  },
  {
    id: "brushes",
    label: "Kolinsky set",
    x: "70%",
    y: "22%",
    rot: 12,
  },
  {
    id: "paper",
    label: "Cold-pressed sheet",
    x: "38%",
    y: "48%",
    rot: -3,
  },
  {
    id: "jar",
    label: "Rinse water",
    x: "78%",
    y: "58%",
    rot: 6,
  },
  {
    id: "tubes",
    label: "Pigment tubes",
    x: "18%",
    y: "62%",
    rot: -14,
  },
];

/**
 * Atelier desk assembles on scroll — graphical still-life of painting tools.
 */
export function StoryAtelierDesk() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const tools = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-tool]"),
      );
      const shadow = rootRef.current.querySelector("[data-desk-shadow]");
      const title = rootRef.current.querySelector("[data-desk-title]");
      const petals = rootRef.current.querySelectorAll("[data-petal]");

      gsap.set(tools, {
        opacity: 0,
        y: 80,
        scale: 0.85,
        rotation: (i) => TOOLS[i]?.rot ?? 0,
      });
      gsap.set(petals, { opacity: 0, y: -20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=340%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7 },
          0,
        );
      }
      if (shadow) {
        tl.fromTo(
          shadow,
          { scaleX: 0.4, opacity: 0 },
          { scaleX: 1, opacity: 0.35, duration: 1 },
          0.2,
        );
      }

      tools.forEach((tool, i) => {
        tl.to(
          tool,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: TOOLS[i]?.rot ?? 0,
            duration: 0.85,
            ease: "power2.out",
          },
          0.35 + i * 0.35,
        );
      });

      tl.to(
        petals,
        { opacity: 0.8, y: 0, stagger: 0.1, duration: 0.6 },
        2.2,
      );

      tl.to(
        tools,
        {
          y: (i) => (i % 2 === 0 ? -8 : 6),
          rotation: (i) => (TOOLS[i]?.rot ?? 0) + (i % 2 === 0 ? -2 : 2),
          duration: 1.2,
        },
        3,
      );

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
      className="relative h-svh overflow-hidden border-t border-border"
      aria-label="Atelier desk"
    >
      <WashField
        variant="paper"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div
        data-desk-shadow
        className="pointer-events-none absolute bottom-[8%] left-1/2 h-16 w-[min(90%,52rem)] -translate-x-1/2 rounded-[100%] bg-[#1a1410]/25 blur-2xl"
        aria-hidden="true"
      />

      <div className="container-x relative z-10 pt-14 md:pt-18">
        <div data-desk-title>
          <p className="text-label mb-4 tracking-[0.24em]">
            Chapter — The desk
          </p>
          <h2 className="max-w-2xl font-display text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[1.05]">
            Tools wait like quiet animals.
          </h2>
        </div>
      </div>

      {/* Graphical tools */}
      <div
        data-tool
        className="absolute z-20"
        style={{ left: TOOLS[0].x, top: TOOLS[0].y }}
      >
        <PaletteGraphic />
        <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55">
          {TOOLS[0].label}
        </p>
      </div>

      <div
        data-tool
        className="absolute z-20"
        style={{ left: TOOLS[1].x, top: TOOLS[1].y }}
      >
        <BrushesGraphic />
        <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55">
          {TOOLS[1].label}
        </p>
      </div>

      <div
        data-tool
        className="absolute z-20 w-[min(42vw,16rem)]"
        style={{ left: TOOLS[2].x, top: TOOLS[2].y }}
      >
        <PaperGraphic />
        <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55">
          {TOOLS[2].label}
        </p>
      </div>

      <div
        data-tool
        className="absolute z-20"
        style={{ left: TOOLS[3].x, top: TOOLS[3].y }}
      >
        <JarGraphic />
        <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55">
          {TOOLS[3].label}
        </p>
      </div>

      <div
        data-tool
        className="absolute z-20"
        style={{ left: TOOLS[4].x, top: TOOLS[4].y }}
      >
        <TubesGraphic />
        <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55">
          {TOOLS[4].label}
        </p>
      </div>

      {/* Floating petals */}
      {[
        { l: "55%", t: "18%", c: "#c43c2e" },
        { l: "48%", t: "72%", c: "#1e4d8c" },
        { l: "88%", t: "40%", c: "#c9a227" },
        { l: "6%", t: "40%", c: "#2d6b4f" },
      ].map((p, i) => (
        <div
          key={i}
          data-petal
          className="pointer-events-none absolute"
          style={{
            left: p.l,
            top: p.t,
            width: 14,
            height: 18,
            borderRadius: "60% 60% 55% 55%",
            background: p.c,
            opacity: 0.55,
          }}
          aria-hidden="true"
        />
      ))}
    </section>
  );
}

function PaletteGraphic() {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" className="drop-shadow-lg">
      <ellipse cx="70" cy="52" rx="62" ry="40" fill="#f3ebe3" stroke="#cfc4b4" strokeWidth="2" />
      <circle cx="38" cy="42" r="12" fill="#1e4d8c" />
      <circle cx="62" cy="34" r="11" fill="#c43c2e" />
      <circle cx="88" cy="40" r="12" fill="#c9a227" />
      <circle cx="70" cy="58" r="11" fill="#1f7a6c" />
      <circle cx="44" cy="64" r="10" fill="#2d6b4f" />
      <ellipse cx="108" cy="62" rx="10" ry="14" fill="#e6e1d6" stroke="#cfc4b4" />
    </svg>
  );
}

function BrushesGraphic() {
  return (
    <svg width="90" height="150" viewBox="0 0 90 150" className="drop-shadow-md">
      {[
        { x: 20, rot: -8, tip: "#1e4d8c" },
        { x: 42, rot: 0, tip: "#c43c2e" },
        { x: 64, rot: 10, tip: "#1a1410" },
      ].map((b) => (
        <g key={b.x} transform={`rotate(${b.rot} ${b.x} 75)`}>
          <rect x={b.x - 3} y="10" width="6" height="70" rx="1" fill="#c4a574" />
          <rect x={b.x - 4} y="75" width="8" height="12" fill="#3a2a1a" />
          <path
            d={`M${b.x - 4} 87 C${b.x - 6} 110 ${b.x - 2} 130 ${b.x} 145 C${b.x + 2} 130 ${b.x + 6} 110 ${b.x + 4} 87 Z`}
            fill={b.tip}
          />
        </g>
      ))}
    </svg>
  );
}

function PaperGraphic() {
  return (
    <div className="artwork-mount">
      <div className="artwork-mount-inner relative aspect-[5/4] overflow-hidden bg-[#f0ebe3]">
        <svg viewBox="0 0 200 160" className="h-full w-full">
          <defs>
            <filter id="paper-wet">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" />
              <feDisplacementMap in="SourceGraphic" scale="8" />
            </filter>
          </defs>
          <rect width="200" height="160" fill="#f0ebe3" />
          <ellipse cx="70" cy="70" rx="50" ry="40" fill="#1e4d8c" opacity="0.35" filter="url(#paper-wet)" />
          <ellipse cx="130" cy="90" rx="45" ry="35" fill="#c43c2e" opacity="0.3" filter="url(#paper-wet)" />
          <path d="M40 120 Q100 40 160 100" stroke="#2d6b4f" strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function JarGraphic() {
  return (
    <svg width="70" height="100" viewBox="0 0 70 100" className="drop-shadow-md">
      <rect x="18" y="8" width="34" height="10" rx="2" fill="#cfc4b4" />
      <path
        d="M20 18 L16 88 Q35 98 54 88 L50 18 Z"
        fill="#dce8f0"
        opacity="0.75"
        stroke="#a8b8c4"
        strokeWidth="1.5"
      />
      <ellipse cx="35" cy="55" rx="14" ry="8" fill="#1e4d8c" opacity="0.25" />
      <path d="M24 40 Q35 50 46 38" stroke="#1e4d8c" strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  );
}

function TubesGraphic() {
  const colors = ["#1e4d8c", "#c43c2e", "#c9a227", "#1f7a6c"];
  return (
    <svg width="120" height="70" viewBox="0 0 120 70" className="drop-shadow-md">
      {colors.map((c, i) => (
        <g key={c} transform={`translate(${i * 28}, ${i % 2 === 0 ? 0 : 8}) rotate(${-20 + i * 8} 15 35)`}>
          <rect x="8" y="8" width="14" height="40" rx="2" fill={c} />
          <rect x="6" y="48" width="18" height="8" rx="1" fill="#e8e0d4" stroke="#cfc4b4" />
          <rect x="10" y="2" width="10" height="8" rx="1" fill="#3a2a1a" />
        </g>
      ))}
    </svg>
  );
}
