"use client";

import { useRef } from "react";
import Image from "next/image";
import { caseStudies } from "@/content/case-studies";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { WashField } from "@/components/art/wash-field";

const LINES = [
  "Water remembers every edge it softens.",
  "Paper holds the weather of a single afternoon.",
  "Color arrives late — and stays forever.",
];

/**
 * Credo with giant watermark glyphs + drifting study cards behind the lines.
 */
export function StoryManifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const studies = caseStudies.slice(0, 3);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const lines = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-line]"),
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-bg-card]"),
      );
      const glyph = rootRef.current.querySelector("[data-glyph]");

      gsap.set(lines, { opacity: 0.12 });
      gsap.set(cards, { opacity: 0.15, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      if (glyph) {
        tl.fromTo(
          glyph,
          { scale: 1.2, opacity: 0.03 },
          { scale: 1, opacity: 0.08, duration: 2 },
          0,
        );
      }

      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            opacity: 0.45,
            y: 0,
            rotate: i % 2 === 0 ? -6 : 8,
            duration: 1,
          },
          0.2 + i * 0.35,
        );
      });

      lines.forEach((line, i) => {
        tl.to(line, { opacity: 1, duration: 0.6 }, 0.8 + i * 0.85);
        if (i > 0) {
          tl.to(lines[i - 1], { opacity: 0.28, duration: 0.5 }, 0.8 + i * 0.85);
        }
      });

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
      aria-label="Artist credo"
    >
      <WashField
        variant="rose"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
      />

      <p
        data-glyph
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(10rem,32vw,26rem)] leading-none text-foreground select-none"
        aria-hidden="true"
      >
        水
      </p>

      {studies.map((s, i) => {
        const pos = [
          { left: "4%", top: "20%" },
          { right: "6%", top: "28%" },
          { left: "12%", bottom: "12%" },
        ][i];
        return (
          <div
            key={s.slug}
            data-bg-card
            className="absolute z-[1] w-[90px] opacity-20 md:w-[130px]"
            style={pos}
          >
            <div className="artwork-mount">
              <div className="artwork-mount-inner relative aspect-[4/5]">
                <Image
                  src={s.cover}
                  alt=""
                  fill
                  sizes="130px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="container-x relative z-10 flex h-full flex-col justify-center">
        <p className="text-label mb-12 tracking-[0.24em] text-foreground/50">
          Interlude — Credo
        </p>
        <div className="space-y-8 md:space-y-10">
          {LINES.map((line) => (
            <p
              key={line}
              data-line
              className="max-w-4xl font-display text-[clamp(1.6rem,4.5vw,3.4rem)] font-medium leading-[1.15] tracking-[-0.02em]"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
