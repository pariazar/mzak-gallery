"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const PIGMENTS = [
  {
    name: "Ultramarine",
    copy: "Depth for rivers and night sky.",
    color: "#1e4d8c",
    x: "18%",
    y: "28%",
    size: "min(48vw, 22rem)",
  },
  {
    name: "Vermilion",
    copy: "Warmth that blooms at the edge.",
    color: "#c43c2e",
    x: "62%",
    y: "22%",
    size: "min(42vw, 20rem)",
  },
  {
    name: "Ochre",
    copy: "Earth light for quiet mornings.",
    color: "#c9a227",
    x: "32%",
    y: "58%",
    size: "min(38vw, 18rem)",
  },
  {
    name: "Teal wash",
    copy: "Cool breath between the marks.",
    color: "#1f7a6c",
    x: "70%",
    y: "55%",
    size: "min(44vw, 21rem)",
  },
];

/**
 * Sticky pigment ritual — dense blooms, palette rings, swatch stamps, labels.
 */
export function StoryPigment() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const blooms = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-pigment-bloom]"),
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-pigment-card]"),
      );
      const title = rootRef.current.querySelector<HTMLElement>(
        "[data-pigment-title]",
      );
      const rings = rootRef.current.querySelectorAll("[data-ring]");
      const stamps = rootRef.current.querySelectorAll("[data-stamp]");

      gsap.set(blooms, { scale: 0.15, opacity: 0 });
      gsap.set(cards, { opacity: 0.2, y: 16 });
      gsap.set(rings, { scale: 0.6, opacity: 0 });
      gsap.set(stamps, { scale: 0, opacity: 0, rotate: -20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          0,
        );
      }

      tl.to(rings, { scale: 1, opacity: 0.5, stagger: 0.15, duration: 1 }, 0.2);

      blooms.forEach((bloom, i) => {
        tl.to(
          bloom,
          { scale: 1, opacity: 0.95, duration: 1.1, ease: "power2.out" },
          0.35 + i * 0.8,
        );
        tl.to(
          cards[i],
          { opacity: 1, y: 0, duration: 0.7 },
          0.45 + i * 0.8,
        );
        if (i > 0) {
          tl.to(cards[i - 1], { opacity: 0.4, duration: 0.5 }, 0.45 + i * 0.8);
        }
      });

      tl.to(
        stamps,
        { scale: 1, opacity: 0.85, rotate: 0, stagger: 0.12, duration: 0.7 },
        2.5,
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
      className="relative min-h-svh overflow-hidden border-t border-border bg-[#120e0c] text-[#f3ebe3] md:h-svh"
      aria-label="Pigment ritual"
    >
      {/* Paper texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* Concentric palette rings */}
      {[18, 28, 38].map((rem, i) => (
        <div
          key={rem}
          data-ring
          className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f3ebe3]/15"
          style={{
            width: `min(${40 + i * 22}vw, ${rem}rem)`,
            height: `min(${40 + i * 22}vw, ${rem}rem)`,
          }}
          aria-hidden="true"
        />
      ))}

      {PIGMENTS.map((p) => (
        <div
          key={p.name}
          data-pigment-bloom
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color}dd, ${p.color}44 42%, transparent 70%)`,
            filter: "blur(14px)",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
        />
      ))}

      {/* Swatch stamps */}
      {[
        { l: "8%", t: "78%", c: "#1e4d8c" },
        { l: "22%", t: "82%", c: "#c43c2e" },
        { l: "36%", t: "76%", c: "#c9a227" },
        { l: "50%", t: "84%", c: "#1f7a6c" },
        { l: "64%", t: "78%", c: "#2d6b4f" },
      ].map((s, i) => (
        <div
          key={i}
          data-stamp
          className="pointer-events-none absolute size-7 rounded-sm md:size-10"
          style={{
            left: s.l,
            top: s.t,
            background: s.c,
            boxShadow: `0 0 20px ${s.c}88`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Giant watermark letter */}
      <p
        className="pointer-events-none absolute right-[-2%] top-[8%] select-none font-display text-[clamp(5rem,28vw,22rem)] leading-none text-[#f3ebe3]/5"
        aria-hidden="true"
      >
        色
      </p>

      <div className="container-x relative z-10 flex min-h-svh flex-col justify-between gap-10 py-14 md:h-full md:gap-0 md:py-24">
        <div>
          <p className="text-label mb-4 tracking-[0.24em] text-[#f3ebe3]/55 md:mb-5">
            Chapter II — The palette
          </p>
          <h2
            data-pigment-title
            className="max-w-3xl font-display text-[clamp(1.85rem,6vw,5rem)] font-medium leading-[1.05] tracking-[-0.02em]"
          >
            Four pigments.
            <br />
            <span className="italic text-[#f3ebe3]/75">Infinite weather.</span>
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {PIGMENTS.map((p) => (
            <li
              key={p.name}
              data-pigment-card
              className="border-t border-[#f3ebe3]/20 pt-4 md:pt-5"
            >
              <div className="mb-3 flex items-center gap-2 md:mb-4 md:gap-3">
                <span
                  className="size-3.5 shrink-0 rounded-full md:size-4"
                  style={{
                    background: p.color,
                    boxShadow: `0 0 22px ${p.color}`,
                  }}
                />
                <h3 className="font-display text-base italic md:text-xl">
                  {p.name}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-[#f3ebe3]/65 md:text-sm">
                {p.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
