"use client";

import { useRef } from "react";
import Image from "next/image";
import { caseStudies } from "@/content/case-studies";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TransitionLink } from "@/components/layout/page-transition";
import { WashField } from "@/components/art/wash-field";

/**
 * Horizontal gallery walk — Apple product-track style, pinned + scrubbed.
 */
export function StoryGalleryWalk() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const works = caseStudies.slice(0, 6);

  useGSAP(
    () => {
      if (reduced || !rootRef.current || !trackRef.current) return;
      // Native horizontal swipe is clearer on phones than pin+scrub.
      if (window.matchMedia("(max-width: 767px)").matches) return;

      const track = trackRef.current;
      const getScroll = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 80);

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${getScroll() * 1.15}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-border"
      aria-label="Gallery walk"
    >
      <WashField
        variant="paper"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,var(--background)_55%,transparent)]"
        aria-hidden="true"
      />

      <div className="relative flex min-h-[min(100svh,52rem)] flex-col justify-center py-10 md:h-svh md:py-0">
        <div className="container-x mb-8 shrink-0 md:mb-14">
          <p className="text-label mb-4 tracking-[0.24em]">
            Chapter III — Walk the wall
          </p>
          <h2 className="max-w-3xl font-display text-display-sm leading-[1.08]">
            Series hung in silence.
            <span className="italic text-foreground/70">
              {" "}
              <span className="md:hidden">Swipe the wall.</span>
              <span className="hidden md:inline">Scroll sideways.</span>
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto overscroll-x-contain snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max items-end gap-5 px-[var(--gutter)] pb-8 md:gap-10 md:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]"
          >
            {works.map((work, i) => (
              <TransitionLink
                key={work.slug}
                href={`/work/${work.slug}`}
                data-cursor="hover"
                className="group relative block w-[min(78vw,20rem)] shrink-0 snap-center md:w-[min(42vw,28rem)]"
              >
                <div className="artwork-mount">
                  <div
                    className="artwork-mount-inner relative aspect-[4/5] overflow-hidden"
                    style={{ background: work.accent + "22" }}
                  >
                    <Image
                      src={work.cover}
                      alt={work.title}
                      fill
                      sizes="(max-width:768px) 72vw, 28rem"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                      style={{
                        background: `linear-gradient(160deg, transparent 40%, ${work.accent}55)`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-label text-foreground/50">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-display text-2xl transition-colors group-hover:text-accent md:text-3xl">
                      {work.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {work.tagline}
                    </p>
                  </div>
                </div>
              </TransitionLink>
            ))}

            <div className="flex w-[min(70vw,20rem)] shrink-0 items-center self-center pr-10">
              <TransitionLink
                href="/work"
                data-cursor="hover"
                className="link-underline font-display text-2xl italic text-foreground md:text-3xl"
              >
                Enter the full gallery →
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>

      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[color-mix(in_oklab,var(--background)_88%,#d8d2c6)] to-transparent md:w-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[color-mix(in_oklab,var(--background)_88%,#d8d2c6)] to-transparent md:w-20"
        aria-hidden="true"
      />
    </section>
  );
}
