"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { useAppStore } from "@/lib/store";
import { siteConfig } from "@/content/site.config";

const MIN_DURATION = 2.1;

const LOAD_LINES = [
  "Wetting the paper…",
  "Mixing ultramarine…",
  "First wash blooming…",
  "Letting edges breathe…",
  "Opening the atelier…",
];

/**
 * Artistic preloader — watercolor blooms, ink brand reveal,
 * pigment palette progress, then a painted curtain exit.
 */
export function Preloader() {
  const setLoaderDone = useAppStore((s) => s.setLoaderDone);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);
  const bloomsRef = useRef<HTMLDivElement>(null);
  const dripRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rootRef.current) return;

    const dismiss = () => {
      document.documentElement.style.overflow = "";
      setLoaderDone(true);
      setHidden(true);
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.visibilityState === "hidden"
    ) {
      window.setTimeout(dismiss, 0);
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const progress = { value: 0 };
    let assetsReady = false;
    let counterDone = false;
    let lineIndex = 0;

    const circumference = 2 * Math.PI * 54;
    if (arcRef.current) {
      gsap.set(arcRef.current, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      });
    }

    const blooms = bloomsRef.current
      ? Array.from(bloomsRef.current.querySelectorAll("[data-bloom]"))
      : [];
    const letters = brandRef.current
      ? Array.from(brandRef.current.querySelectorAll("[data-letter]"))
      : [];
    const drips = dripRef.current
      ? Array.from(dripRef.current.querySelectorAll("[data-drip]"))
      : [];

    gsap.set(blooms, { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set(letters, { y: 40, opacity: 0, rotate: -6 });
    gsap.set(drips, { scaleY: 0, transformOrigin: "50% 0%" });
    gsap.set(brushRef.current, { opacity: 0, x: -20, y: 10 });

    const render = () => {
      const v = progress.value;
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      }
      if (arcRef.current) {
        arcRef.current.style.strokeDashoffset = String(
          circumference * (1 - v / 100),
        );
      }
      const nextLine = Math.min(
        LOAD_LINES.length - 1,
        Math.floor((v / 100) * LOAD_LINES.length),
      );
      if (nextLine !== lineIndex && lineRef.current) {
        lineIndex = nextLine;
        gsap.fromTo(
          lineRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, overwrite: "auto" },
        );
        lineRef.current.textContent = LOAD_LINES[lineIndex];
      }
      // Brush orbits the palette
      if (brushRef.current) {
        const ang = (v / 100) * Math.PI * 2 - Math.PI / 2;
        const r = 62;
        gsap.set(brushRef.current, {
          x: Math.cos(ang) * r,
          y: Math.sin(ang) * r,
          rotation: (ang * 180) / Math.PI + 90,
          opacity: v > 4 && v < 98 ? 1 : 0,
        });
      }
    };

    // Intro art
    const intro = gsap.timeline();
    intro
      .to(
        blooms,
        {
          scale: 1,
          opacity: 1,
          duration: 1.1,
          stagger: { each: 0.12, from: "random" },
          ease: "power2.out",
        },
        0,
      )
      .to(
        letters,
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "back.out(1.6)",
        },
        0.25,
      )
      .to(
        drips,
        {
          scaleY: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power2.in",
        },
        0.4,
      );

    const finish = () => {
      if (!assetsReady || !counterDone) return;
      const tl = gsap.timeline({ onComplete: dismiss });
      tl.to(progress, {
        value: 100,
        duration: 0.28,
        ease: "power2.out",
        onUpdate: render,
      })
        .to(
          brushRef.current,
          { opacity: 0, scale: 0.6, duration: 0.25 },
          0,
        )
        .to(
          stageRef.current,
          {
            scale: 1.08,
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.45,
            ease: "power2.in",
          },
          0.15,
        )
        .to(
          blooms,
          {
            scale: 2.4,
            opacity: 0,
            duration: 0.7,
            stagger: 0.04,
            ease: "power2.in",
          },
          0.2,
        )
        .to(
          rootRef.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.85,
            ease: EASE.cinematic,
          },
          0.35,
        );
    };

    gsap.to(progress, {
      value: 99,
      duration: MIN_DURATION,
      ease: "power1.inOut",
      onUpdate: render,
      onComplete: () => {
        counterDone = true;
        finish();
      },
    });

    // Soft bloom breathing while loading
    gsap.to(blooms, {
      scale: 1.06,
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.2,
      delay: 1,
    });

    Promise.all([document.fonts.ready]).then(() => {
      assetsReady = true;
      finish();
    });
  }, []);

  if (hidden) return null;

  const letters = siteConfig.name.split("");

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 z-[150] overflow-hidden"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden="true"
    >
      {/* Paper ground */}
      <div className="absolute inset-0 bg-[#1a1410]" />
      <div className="preloader-paper absolute inset-0" />

      {/* Living watercolor blooms */}
      <div ref={bloomsRef} className="pointer-events-none absolute inset-0">
        <span
          data-bloom
          className="preloader-bloom absolute -left-[10%] top-[8%] h-[55vmax] w-[55vmax] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(30,77,140,0.55) 0%, rgba(30,77,140,0) 70%)",
          }}
        />
        <span
          data-bloom
          className="preloader-bloom absolute -right-[8%] top-[18%] h-[48vmax] w-[48vmax] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(196,60,46,0.45) 0%, rgba(196,60,46,0) 68%)",
          }}
        />
        <span
          data-bloom
          className="preloader-bloom absolute bottom-[-12%] left-[20%] h-[52vmax] w-[52vmax] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(31,122,108,0.4) 0%, rgba(31,122,108,0) 70%)",
          }}
        />
        <span
          data-bloom
          className="preloader-bloom absolute bottom-[10%] right-[15%] h-[36vmax] w-[36vmax] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.38) 0%, rgba(201,162,39,0) 65%)",
          }}
        />
        <span
          data-bloom
          className="preloader-bloom absolute left-[40%] top-[35%] h-[28vmax] w-[28vmax] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,180,160,0.28) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Ink drips */}
      <div
        ref={dripRef}
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-around px-10"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            data-drip
            className="preloader-drip block w-[2px] origin-top rounded-full"
            style={{
              height: `${48 + i * 18}px`,
              background:
                i % 2 === 0
                  ? "linear-gradient(180deg, #c43c2e, transparent)"
                  : "linear-gradient(180deg, #1e4d8c, transparent)",
              opacity: 0.55,
            }}
          />
        ))}
      </div>

      {/* Center stage */}
      <div
        ref={stageRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
      >
        <p className="mb-8 text-[0.65rem] uppercase tracking-[0.32em] text-[#f3ebe3]/45">
          Atelier loading
        </p>

        <h1
          ref={brandRef}
          className="font-display flex gap-[0.06em] text-[clamp(4rem,16vw,9rem)] italic leading-none tracking-[-0.03em] text-[#f3ebe3]"
        >
          {letters.map((ch, i) => (
            <span key={`${ch}-${i}`} data-letter className="inline-block">
              {ch}
            </span>
          ))}
        </h1>

        <p className="mt-4 max-w-xs text-center font-display text-lg italic text-[#e8b4a0]/75 md:text-xl">
          {siteConfig.tagline}
        </p>

        {/* Pigment palette ring */}
        <div className="relative mt-14 flex size-36 items-center justify-center">
          <svg
            className="absolute inset-0 size-full -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(243,235,227,0.12)"
              strokeWidth="1.5"
            />
            <circle
              ref={arcRef}
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#preloader-arc)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="preloader-arc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e4d8c" />
                <stop offset="40%" stopColor="#c43c2e" />
                <stop offset="75%" stopColor="#c9a227" />
                <stop offset="100%" stopColor="#1f7a6c" />
              </linearGradient>
            </defs>
          </svg>

          {/* Swatches inside palette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1.5">
              {["#1e4d8c", "#c43c2e", "#c9a227", "#1f7a6c"].map((c) => (
                <span
                  key={c}
                  className="size-3 rounded-full shadow-sm"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Orbiting brush */}
          <div
            ref={brushRef}
            className="pointer-events-none absolute left-1/2 top-1/2 -ml-3 -mt-3"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M18 3 L25 10 L12 24 L5 17 Z" fill="#6b4423" />
              <path d="M12 20 L16 16 L19 19 L15 23 Z" fill="#c0c4c8" />
              <path
                d="M5 17 C3 20, 2 24, 4 26 C7 25, 11 22, 12 20 Z"
                fill="#c43c2e"
              />
            </svg>
          </div>
        </div>

        <p
          ref={lineRef}
          className="mt-8 text-[0.72rem] uppercase tracking-[0.22em] text-[#f3ebe3]/55"
        >
          {LOAD_LINES[0]}
        </p>

        <span
          ref={counterRef}
          className="mt-4 font-display text-5xl tabular-nums leading-none text-[#f3ebe3]/9 md:text-6xl"
        >
          000
        </span>
      </div>

      {/* Paper grain */}
      <div className="preloader-grain pointer-events-none absolute inset-0" />
    </div>
  );
}
