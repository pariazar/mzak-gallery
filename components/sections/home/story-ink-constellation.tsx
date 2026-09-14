"use client";

import { useRef } from "react";
import Image from "next/image";
import { caseStudies } from "@/content/case-studies";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { WashField } from "@/components/art/wash-field";

const STUDIES = caseStudies.slice(0, 6).map((c, i) => ({
  ...c,
  rot: [-12, 8, -6, 14, -10, 5][i],
  x: ["8%", "72%", "18%", "62%", "38%", "78%"][i],
  y: ["18%", "12%", "58%", "52%", "28%", "68%"][i],
  w: ["140px", "160px", "130px", "150px", "170px", "135px"][i],
}));

/**
 * Floating study constellation — miniature framed works orbit, then lock into a constellation.
 */
export function StoryInkConstellation() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-study]"),
      );
      const lines = rootRef.current.querySelectorAll("[data-constellation-line]");
      const title = rootRef.current.querySelector("[data-constellation-title]");
      const splatters = rootRef.current.querySelectorAll("[data-splatter]");

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const visibleCards = isMobile ? cards.slice(0, 6) : cards.slice(6);

      // Mobile: light scroll-in, no pin (grid needs natural height).
      if (isMobile) {
        gsap.set(visibleCards, { opacity: 0, y: 24 });
        gsap.to(visibleCards, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        });
        return () => {
          ScrollTrigger.getAll()
            .filter((st) => st.trigger === rootRef.current)
            .forEach((st) => st.kill());
        };
      }

      gsap.set(lines, { strokeDashoffset: 1200 });
      gsap.set(splatters, { scale: 0, opacity: 0 });
      gsap.set(visibleCards, { opacity: 0, scale: 0.4, rotate: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=420%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8 },
          0,
        );
      }

      visibleCards.forEach((card, i) => {
        const rot = STUDIES[i]?.rot ?? 0;
        tl.to(
          card,
          {
            opacity: 1,
            scale: 1,
            rotate: rot,
            duration: 0.9,
            ease: "power2.out",
          },
          0.2 + i * 0.28,
        );
      });

      tl.to(
        splatters,
        { scale: 1, opacity: 0.7, stagger: 0.08, duration: 0.6 },
        1.2,
      );

      tl.to(
        visibleCards,
        {
          x: (i) => (i % 2 === 0 ? 40 : -30),
          y: (i) => (i % 3 === 0 ? -25 : 20),
          rotate: (i) => (STUDIES[i]?.rot ?? 0) * 0.4,
          duration: 1.4,
        },
        2.2,
      );

      tl.to(lines, { strokeDashoffset: 0, duration: 1.6, stagger: 0.1 }, 2.8);

      tl.to(
        visibleCards,
        {
          x: 0,
          y: 0,
          scale: 1.05,
          filter: "brightness(1.05)",
          duration: 1,
        },
        3.6,
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
      className="relative overflow-hidden border-t border-border md:h-svh"
      aria-label="Study constellation"
    >
      <WashField
        variant="indigo"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
      />

      {/* Constellation connectors */}
      <svg
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="rgba(30,77,140,0.35)"
          strokeWidth="0.15"
          strokeDasharray="1200"
        >
          <path data-constellation-line d="M12 22 L42 32 L22 62" />
          <path data-constellation-line d="M78 16 L58 30 L82 70" />
          <path data-constellation-line d="M42 32 L58 30 L48 55" />
          <path data-constellation-line d="M22 62 L48 55 L68 58" />
        </g>
      </svg>

      {/* Ink splatters */}
      {[
        { t: "12%", l: "48%", c: "#1e4d8c", s: 28 },
        { t: "70%", l: "12%", c: "#c43c2e", s: 36 },
        { t: "22%", l: "88%", c: "#c9a227", s: 22 },
        { t: "78%", l: "55%", c: "#1f7a6c", s: 30 },
        { t: "45%", l: "5%", c: "#2d6b4f", s: 20 },
      ].map((s, i) => (
        <div
          key={i}
          data-splatter
          className="pointer-events-none absolute rounded-full"
          style={{
            top: s.t,
            left: s.l,
            width: s.s,
            height: s.s * 1.2,
            background: `radial-gradient(circle, ${s.c}99, transparent 70%)`,
            filter: "blur(1px)",
          }}
          aria-hidden="true"
        />
      ))}

      <div className="container-x relative z-10 pt-14 md:pt-20">
        <div data-constellation-title>
          <p className="text-label mb-4 tracking-[0.24em] text-foreground/60">
            Chapter — Studies in air
          </p>
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,5.5vw,4.2rem)] font-medium leading-[1.05]">
            Six sketches.
            <span className="italic text-foreground/70"> One night sky.</span>
          </h2>
        </div>
      </div>

      {/* Mobile: readable 2-col grid (absolute collage clips on phones) */}
      <div className="container-x relative z-20 mt-6 grid grid-cols-2 gap-3 pb-10 sm:gap-4 md:hidden">
        {STUDIES.map((study) => (
          <div key={study.slug} data-study className="min-w-0">
            <div className="artwork-mount shadow-[0_12px_28px_rgba(28,36,48,0.18)]">
              <div
                className="artwork-mount-inner relative aspect-[4/5] overflow-hidden"
                style={{ background: study.accent + "33" }}
              >
                <Image
                  src={study.cover}
                  alt=""
                  fill
                  sizes="45vw"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-2 truncate text-center font-display text-xs italic text-foreground/70">
              {study.title}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop: floating constellation collage */}
      {STUDIES.map((study) => (
        <div
          key={`desk-${study.slug}`}
          data-study
          className="absolute z-20 hidden md:block"
          style={{
            left: study.x,
            top: study.y,
            width: study.w,
          }}
        >
          <div className="artwork-mount shadow-[0_18px_40px_rgba(28,36,48,0.22)]">
            <div
              className="artwork-mount-inner relative aspect-[4/5] overflow-hidden"
              style={{ background: study.accent + "33" }}
            >
              <Image
                src={study.cover}
                alt=""
                fill
                sizes="170px"
                className="object-cover"
              />
            </div>
          </div>
          <p className="mt-2 truncate text-center font-display text-xs italic text-foreground/70">
            {study.title}
          </p>
        </div>
      ))}

      {/* Decorative seals */}
      <span
        className="artist-chop pointer-events-none absolute bottom-[12%] left-[10%] hidden opacity-70 md:block"
        aria-hidden="true"
      >
        MZ
      </span>
      <span
        className="artist-chop pointer-events-none absolute right-[14%] top-[38%] hidden rotate-12 opacity-40 md:block"
        aria-hidden="true"
      >
        水
      </span>
    </section>
  );
}
