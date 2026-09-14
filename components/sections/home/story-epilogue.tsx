"use client";

import { useRef } from "react";
import Image from "next/image";
import { caseStudies } from "@/content/case-studies";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/layout/page-transition";
import { siteConfig } from "@/content/site.config";
import { WashField } from "@/components/art/wash-field";

/**
 * Cinematic closing invite with orbiting studies + expanding wash.
 */
export function StoryEpilogue() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const orbs = caseStudies.slice(0, 4);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const word = rootRef.current.querySelector<HTMLElement>("[data-word]");
      const sub = rootRef.current.querySelector<HTMLElement>("[data-sub]");
      const cta = rootRef.current.querySelector<HTMLElement>("[data-cta]");
      const wash = rootRef.current.querySelector<HTMLElement>("[data-wash]");
      const cards = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-orb]"),
      );

      gsap.set(cards, { opacity: 0, scale: 0.6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      if (wash) {
        tl.fromTo(
          wash,
          { scale: 0.6, opacity: 0.2 },
          { scale: 1.5, opacity: 0.8, duration: 2 },
          0,
        );
      }

      tl.to(
        cards,
        {
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 0.9,
        },
        0.3,
      );

      if (word) {
        tl.fromTo(
          word,
          { scale: 1.35, opacity: 0, filter: "blur(12px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.4 },
          0.2,
        );
      }
      if (sub) {
        tl.fromTo(
          sub,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          1,
        );
      }
      if (cta) {
        tl.fromTo(
          cta,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          1.3,
        );
      }

      tl.to(
        cards,
        {
          y: (i) => (i % 2 === 0 ? -20 : 16),
          rotate: (i) => (i % 2 === 0 ? -8 : 10),
          duration: 1.2,
        },
        1.6,
      );

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => st.trigger === rootRef.current)
          .forEach((st) => st.kill());
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  const positions = [
    { left: "6%", top: "18%" },
    { right: "8%", top: "16%" },
    { left: "10%", bottom: "14%" },
    { right: "6%", bottom: "18%" },
  ];

  return (
    <section
      ref={rootRef}
      className="relative h-svh overflow-hidden border-t border-border"
      aria-label="Atelier invitation"
    >
      <WashField
        variant="indigo"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      />

      <div
        data-wash
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,40rem)] w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, #1e4d8c 32%, transparent), color-mix(in oklab, #c9a227 16%, transparent) 40%, color-mix(in oklab, #c43c2e 14%, transparent) 58%, transparent 72%)",
          filter: "blur(24px)",
        }}
        aria-hidden="true"
      />

      {orbs.map((o, i) => (
        <div
          key={o.slug}
          data-orb
          className="absolute z-10 hidden w-[88px] md:block md:w-[110px]"
          style={positions[i]}
        >
          <div className="artwork-mount shadow-xl">
            <div className="artwork-mount-inner relative aspect-[4/5]">
              <Image
                src={o.cover}
                alt=""
                fill
                sizes="110px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="container-x relative z-20 flex h-full flex-col items-center justify-center text-center">
        <p className="text-label mb-8 tracking-[0.28em] text-foreground/50">
          Chapter V — The door
        </p>
        <h2
          data-word
          className="font-display text-[clamp(3.2rem,12vw,9rem)] font-medium leading-[0.9] tracking-[-0.03em]"
        >
          Step closer.
        </h2>
        <p
          data-sub
          className="mt-6 max-w-md font-display text-[clamp(1.15rem,2.4vw,1.65rem)] italic leading-snug text-foreground/75"
        >
          The atelier is open — paintings, commissions, and quiet rooms for
          pigment to breathe.
        </p>
        <div
          data-cta
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <Button asChild size="lg">
              <TransitionLink href="/work">
                {siteConfig.hero.cta.label}
              </TransitionLink>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="outline" size="lg">
              <TransitionLink href="/contact">Request a visit</TransitionLink>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
