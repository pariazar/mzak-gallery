"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { useAppStore } from "@/lib/store";
import { HeroWash } from "@/components/sections/home/hero-wash";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/layout/page-transition";

const PALETTE = [
  { name: "Ultramarine", hex: "#1e4d8c" },
  { name: "Vermilion", hex: "#c43c2e" },
  { name: "Sap green", hex: "#2d6b4f" },
  { name: "Ochre", hex: "#c9a227" },
  { name: "Teal wash", hex: "#1f7a6c" },
];

/**
 * Arty abstract hero: watercolor field + gallery composition.
 * MZAK as brand, pigment swatches, framed study panel.
 */
export function Hero() {
  const loaderDone = useAppStore((s) => s.loaderDone);
  const { titleLines, subtitle, cta } = siteConfig.hero;

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      <HeroWash className="pointer-events-none absolute inset-0" />

      {/* Paper vignette — darkened edges like a mounted sheet */}
      <div
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(36,48,68,0.18)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[color-mix(in_oklab,var(--background)_88%,transparent)] to-transparent"
        aria-hidden="true"
      />

      <div className="container-x relative z-10 grid flex-1 items-center gap-10 pb-12 pt-24 sm:gap-12 sm:pb-16 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-32">
        {/* Left: brand + copy */}
        <div>
          <motion.div
            className="mb-6 flex min-w-0 flex-wrap items-center gap-3 sm:mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={loaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="artist-chop shrink-0" aria-hidden="true">
              MZ
            </span>
            <p className="text-label min-w-0 tracking-[0.14em] text-foreground/70 sm:tracking-[0.22em]">
              <span className="sm:hidden">Watercolor · MZAK</span>
              <span className="hidden sm:inline">
                Watercolor gallery · Atelier MZAK
              </span>
            </p>
          </motion.div>

          <motion.h1
            className="font-display text-[clamp(2.75rem,18vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 36 }}
            animate={loaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="italic">{siteConfig.name}</span>
          </motion.h1>

          <motion.div
            className="mt-3 h-1.5 w-28 rounded-full bg-[linear-gradient(90deg,#1e4d8c,#c43c2e,#c9a227,#1f7a6c)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={loaderDone ? { scaleX: 1, opacity: 1 } : {}}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.8, delay: 0.35 }}
            aria-hidden="true"
          />

          <motion.p
            className="mt-7 max-w-[16ch] font-display text-[clamp(1.55rem,3.6vw,2.75rem)] italic leading-[1.2] text-foreground/85"
            initial={{ opacity: 0, y: 20 }}
            animate={loaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.28 }}
          >
            {titleLines.join(" ")}
          </motion.p>

          <motion.p
            className="mt-6 max-w-md text-base leading-relaxed text-foreground/65 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={loaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={loaderDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.52 }}
          >
            <Magnetic>
              <Button asChild size="lg" data-cursor="hover">
                <TransitionLink href={cta.href}>{cta.label}</TransitionLink>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="lg" data-cursor="hover">
                <TransitionLink href="/about">Meet the artist</TransitionLink>
              </Button>
            </Magnetic>
          </motion.div>

          {/* Artist palette swatches */}
          <motion.ul
            className="mt-12 flex flex-wrap items-end gap-3"
            initial={{ opacity: 0 }}
            animate={loaderDone ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.65 }}
            aria-label="Pigment palette"
          >
            {PALETTE.map((p, i) => (
              <li key={p.name} className="flex flex-col items-center gap-2">
                <span
                  className="pigment-swatch"
                  style={{
                    background: p.hex,
                    animationDelay: `${i * 0.15}s`,
                  }}
                  title={p.name}
                />
                <span className="text-[0.58rem] uppercase tracking-[0.14em] text-foreground/45">
                  {p.name}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: framed abstract study — gallery wall vibe */}
        <motion.aside
          className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end"
          initial={{ opacity: 0, y: 40, rotate: -1.5 }}
          animate={loaderDone ? { opacity: 1, y: 0, rotate: 0 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <div className="gallery-frame">
            <div className="gallery-mat">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#d9d2c4]">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <filter id="study-wet">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.03"
                        numOctaves="2"
                        result="n"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="n"
                        scale="14"
                      />
                    </filter>
                  </defs>
                  <rect width="400" height="500" fill="#e4ddd0" />
                  <g filter="url(#study-wet)">
                    <ellipse cx="280" cy="120" rx="130" ry="110" fill="#1e4d8c" opacity="0.7" />
                    <ellipse cx="120" cy="220" rx="140" ry="120" fill="#c43c2e" opacity="0.62" />
                    <ellipse cx="220" cy="340" rx="150" ry="100" fill="#1f7a6c" opacity="0.55" />
                    <ellipse cx="90" cy="400" rx="90" ry="70" fill="#c9a227" opacity="0.5" />
                    <ellipse cx="310" cy="380" rx="80" ry="90" fill="#2d6b4f" opacity="0.45" />
                  </g>
                  <path
                    d="M 40 60 Q 60 200 48 420"
                    fill="none"
                    stroke="#1e4d8c"
                    strokeWidth="8"
                    opacity="0.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 70 40 Q 75 220 68 380"
                    fill="none"
                    stroke="#c43c2e"
                    strokeWidth="3"
                    opacity="0.5"
                    strokeLinecap="round"
                  />
                  <circle cx="200" cy="180" r="5" fill="#243044" opacity="0.4" />
                  <circle cx="250" cy="260" r="3" fill="#c43c2e" opacity="0.5" />
                  <circle cx="140" cy="300" r="4" fill="#1f7a6c" opacity="0.45" />
                  <text
                    x="28"
                    y="470"
                    fill="#243044"
                    opacity="0.45"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fontSize="14"
                  >
                    Study No. VII — wet on wet
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center font-display text-sm italic text-foreground/50 lg:text-left">
            Mounted study · pigment on cotton
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
