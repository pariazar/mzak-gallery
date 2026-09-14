"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { WashField } from "@/components/art/wash-field";
import { caseStudies } from "@/content/case-studies";

const CHAPTERS = [
  {
    kicker: "Chapter I",
    line: "Every painting begins the same way.",
  },
  {
    kicker: "Chapter I",
    line: "With clear water on cotton paper.",
  },
  {
    kicker: "Chapter I",
    line: "Pigment finds the wet edge — and softens.",
  },
  {
    kicker: "Chapter I",
    line: "A world appears where the wash decides.",
  },
];

const FLOATS = caseStudies.slice(0, 4);

/**
 * Dense graphical prologue — wash field, floating studies, ink drips, chapter lines.
 */
export function StoryPrologue() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current || !stageRef.current) return;

      const chapters = gsap.utils.toArray<HTMLElement>(
        stageRef.current.querySelectorAll("[data-chapter]"),
      );
      const bloom = stageRef.current.querySelector<HTMLElement>("[data-bloom]");
      const ink = stageRef.current.querySelector<HTMLElement>("[data-ink]");
      const floats = gsap.utils.toArray<HTMLElement>(
        stageRef.current.querySelectorAll("[data-float]"),
      );
      const drips = stageRef.current.querySelectorAll("[data-drip]");

      gsap.set(chapters, { opacity: 0, y: 28, filter: "blur(8px)" });
      gsap.set(chapters[0], { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(floats, { opacity: 0, y: 40, rotate: 0 });
      gsap.set(drips, { scaleY: 0, transformOrigin: "top" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=340%",
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
        },
      });

      tl.to(drips, { scaleY: 1, stagger: 0.1, duration: 1.2 }, 0);

      floats.forEach((el, i) => {
        tl.to(
          el,
          {
            opacity: 0.95,
            y: 0,
            rotate: i % 2 === 0 ? -8 : 10,
            duration: 0.9,
          },
          0.15 + i * 0.2,
        );
      });

      chapters.forEach((el, i) => {
        if (i === 0) return;
        tl.to(
          chapters[i - 1],
          { opacity: 0, y: -24, filter: "blur(10px)", duration: 0.5 },
          1 + i * 0.7,
        ).to(
          el,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5 },
          1.1 + i * 0.7,
        );
      });

      if (bloom) {
        tl.fromTo(
          bloom,
          { scale: 0.55, opacity: 0.25 },
          { scale: 1.4, opacity: 0.9, duration: 3.5 },
          0,
        );
      }
      if (ink) {
        tl.fromTo(
          ink,
          { scaleX: 0 },
          { scaleX: 1, duration: 3, ease: "none" },
          0.3,
        );
      }

      tl.to(
        floats,
        {
          y: (i) => (i % 2 === 0 ? -18 : 14),
          x: (i) => (i % 2 === 0 ? 12 : -10),
          duration: 2,
        },
        2,
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
      className="story-prologue relative h-svh overflow-hidden border-t border-border"
      aria-label="Story prologue"
    >
      <WashField
        variant="paper"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-95"
      />

      <div ref={stageRef} className="relative flex h-full items-center justify-center">
        <div
          data-bloom
          className="pointer-events-none absolute left-1/2 top-[42%] h-[min(70vw,34rem)] w-[min(70vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, #1e4d8c 40%, transparent), color-mix(in oklab, #c43c2e 20%, transparent) 45%, transparent 72%)",
            filter: "blur(28px)",
          }}
          aria-hidden="true"
        />

        {/* Ink drips */}
        {[12, 28, 55, 72, 88].map((left, i) => (
          <div
            key={left}
            data-drip
            className="pointer-events-none absolute top-0 w-0.5 origin-top"
            style={{
              left: `${left}%`,
              height: `${22 + i * 7}%`,
              background: `linear-gradient(to bottom, ${
                i % 2 === 0 ? "#1e4d8c" : "#c43c2e"
              }bb, transparent)`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Floating mini studies */}
        {FLOATS.map((study, i) => {
          const pos = [
            { left: "6%", top: "18%" },
            { left: "78%", top: "14%" },
            { left: "8%", top: "62%" },
            { left: "76%", top: "58%" },
          ][i];
          return (
            <div
              key={study.slug}
              data-float
              className="absolute z-20 hidden w-[100px] md:block md:w-[120px] lg:w-[140px]"
              style={pos}
            >
              <div className="artwork-mount shadow-lg">
                <div className="artwork-mount-inner relative aspect-[4/5]">
                  <Image
                    src={study.cover}
                    alt=""
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Decorative rings + chop */}
        <div
          className="pointer-events-none absolute left-[20%] top-[30%] size-24 rounded-full border border-[#1e4d8c]/25 md:size-36"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-[22%] right-[18%] size-16 rounded-full border border-[#c43c2e]/30 md:size-28"
          aria-hidden="true"
        />
        <span
          className="artist-chop pointer-events-none absolute bottom-[16%] left-[16%] opacity-60"
          aria-hidden="true"
        >
          MZ
        </span>

        <div className="container-x relative z-10 w-full max-w-5xl text-center">
          <div className="story-chapters relative mx-auto min-h-[min(42vh,22rem)]">
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.line}
                data-chapter
                className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                style={i === 0 ? undefined : { opacity: 0 }}
                aria-hidden={i !== 0}
              >
                <p className="text-label mb-6 tracking-[0.28em] text-foreground/55">
                  {ch.kicker}
                </p>
                <p className="font-display text-[clamp(1.85rem,5.2vw,4.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-foreground">
                  {ch.line}
                </p>
              </div>
            ))}
          </div>

          <div className="story-ink mx-auto mt-16 h-px w-full max-w-xs overflow-hidden bg-foreground/10">
            <div
              data-ink
              className="h-full origin-left bg-[linear-gradient(90deg,#1e4d8c,#c43c2e,#c9a227)]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <p className="story-scroll-hint mt-5 text-label text-foreground/45">
            Scroll to begin
          </p>
        </div>
      </div>
    </section>
  );
}
