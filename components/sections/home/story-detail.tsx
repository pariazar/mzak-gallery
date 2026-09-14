"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const BEATS = [
  {
    label: "01 · Eyes closed",
    copy: "The portrait does not look out — it looks inward.",
  },
  {
    label: "02 · Feather bloom",
    copy: "Pink pigment softens into wings around the face.",
  },
  {
    label: "03 · Skin light",
    copy: "Warm washes hold the cheekbones like morning.",
  },
  {
    label: "04 · Quiet cosmos",
    copy: "Behind closed lids, an entire universe rests.",
  },
];

/**
 * Sticky cinematic zoom into the portrait — Apple detail-reveal style.
 */
export function StoryDetail() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const frame = rootRef.current.querySelector<HTMLElement>("[data-frame]");
      const img = rootRef.current.querySelector<HTMLElement>("[data-zoom]");
      const veil = rootRef.current.querySelector<HTMLElement>("[data-veil]");
      const beats = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-beat]"),
      );

      gsap.set(beats, { opacity: 0, x: 24 });
      gsap.set(beats[0], { opacity: 1, x: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=420%",
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
        },
      });

      if (frame && img) {
        tl.fromTo(
          frame,
          { scale: 0.72, borderRadius: "1.25rem" },
          { scale: 1, borderRadius: "0rem", duration: 2.2, ease: "none" },
          0,
        );
        tl.fromTo(
          img,
          { scale: 1.15 },
          { scale: 1, duration: 2.2, ease: "none" },
          0,
        );
      }

      if (veil) {
        tl.fromTo(
          veil,
          { opacity: 0.55 },
          { opacity: 0.18, duration: 1.4 },
          0.2,
        );
      }

      beats.forEach((beat, i) => {
        if (i === 0) return;
        tl.to(
          beats[i - 1],
          { opacity: 0, x: -16, duration: 0.45 },
          1.4 + i * 0.7,
        ).to(beat, { opacity: 1, x: 0, duration: 0.5 }, 1.5 + i * 0.7);
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
      className="relative h-svh overflow-hidden border-t border-border bg-[#120e0c]"
      aria-label="Portrait detail"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          data-frame
          className="relative h-full w-full max-w-[100vw] overflow-hidden"
        >
          <div data-zoom className="absolute inset-0 will-change-transform">
            <Image
              src="/covers/paint.jpeg"
              alt="MZAK watercolor portrait study"
              fill
              priority={false}
              sizes="100vw"
              className="object-cover object-[50%_22%]"
            />
          </div>
          <div
            data-veil
            className="absolute inset-0 bg-gradient-to-t from-[#120e0c] via-[#120e0c]/35 to-[#120e0c]/50"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="container-x relative z-10 flex h-full flex-col justify-between py-10 sm:py-14 md:py-20">
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <p className="text-label tracking-[0.18em] text-[#f3ebe3]/60 sm:tracking-[0.24em]">
            Chapter IV — Look closer
          </p>
          <span
            className="artist-chop opacity-70"
            aria-hidden="true"
          >
            MZ
          </span>
        </div>

        {/* Floating detail callouts */}
        <div
          className="pointer-events-none absolute left-[8%] top-[38%] hidden md:block"
          aria-hidden="true"
        >
          <div className="size-3 rounded-full bg-[#e8a090] shadow-[0_0_20px_#e8a090]" />
          <div className="mt-2 h-px w-16 bg-[#f3ebe3]/30" />
          <p className="mt-1 font-display text-xs italic text-[#f3ebe3]/50">
            rose wash
          </p>
        </div>
        <div
          className="pointer-events-none absolute right-[42%] top-[28%] hidden lg:block"
          aria-hidden="true"
        >
          <div className="size-2.5 rounded-full bg-[#8eb4e0] shadow-[0_0_16px_#8eb4e0]" />
          <div className="mt-2 h-px w-12 bg-[#f3ebe3]/30" />
          <p className="mt-1 font-display text-xs italic text-[#f3ebe3]/50">
            cool reserve
          </p>
        </div>

        <div className="w-full max-w-md self-stretch sm:self-end md:mr-[8%]">
          <div className="relative min-h-[7.5rem] rounded-sm border border-[#f3ebe3]/10 bg-[#120e0c]/40 p-4 backdrop-blur-[2px] sm:min-h-[8.5rem] sm:p-5">
            {BEATS.map((beat, i) => (
              <div
                key={beat.label}
                data-beat
                className="absolute inset-4 top-4 sm:inset-5 sm:top-5"
                aria-hidden={i !== 0}
              >
                <p className="text-label mb-2 text-[#f3ebe3]/55 sm:mb-3">
                  {beat.label}
                </p>
                <p className="font-display text-[clamp(1.15rem,3vw,2.1rem)] leading-snug text-[#f3ebe3]">
                  {beat.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
