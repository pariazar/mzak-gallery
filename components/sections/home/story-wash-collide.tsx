"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const BLUE = { r: 30, g: 77, b: 140 };
const RED = { r: 196, g: 60, b: 46 };
const VIOLET = { r: 110, g: 55, b: 118 };

/**
 * Real wet-on-wet collide: canvas pigment rivers approach, touch, bleed violet.
 */
export function StoryWashCollide() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const reduced = useReducedMotion();
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const softBlob = (
      x: number,
      y: number,
      rx: number,
      ry: number,
      color: { r: number; g: number; b: number },
      alpha: number,
    ) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
      g.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${alpha})`);
      g.addColorStop(
        0.45,
        `rgba(${color.r},${color.g},${color.b},${alpha * 0.55})`,
      );
      g.addColorStop(
        0.75,
        `rgba(${color.r},${color.g},${color.b},${alpha * 0.18})`,
      );
      g.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const fingerBleed = (
      cx: number,
      cy: number,
      angle: number,
      len: number,
      color: { r: number; g: number; b: number },
      alpha: number,
    ) => {
      const steps = 10;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const x = cx + Math.cos(angle) * len * t;
        const y = cy + Math.sin(angle) * len * t + Math.sin(t * 9) * 6;
        const r = (1 - t) * 22 + 4;
        softBlob(x, y, r * 1.4, r, color, alpha * (1 - t * 0.7));
      }
    };

    const paint = () => {
      const p = progressRef.current;
      // Paper
      ctx.fillStyle = "#e6e1d6";
      ctx.fillRect(0, 0, w, h);

      // Subtle wet sheen
      const sheen = ctx.createLinearGradient(0, 0, w, h);
      sheen.addColorStop(0, "rgba(255,255,255,0.18)");
      sheen.addColorStop(0.5, "rgba(255,255,255,0)");
      sheen.addColorStop(1, "rgba(210,200,180,0.2)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);

      // Approach: 0 → 0.35
      const approach = Math.min(1, p / 0.35);
      // Contact / mix: 0.28 → 0.75
      const mix = Math.max(0, Math.min(1, (p - 0.28) / 0.47));
      // Settle bloom: 0.55 → 1
      const settle = Math.max(0, Math.min(1, (p - 0.55) / 0.45));

      const leftX = w * (0.18 + approach * 0.22);
      const rightX = w * (0.82 - approach * 0.22);
      const midY = h * 0.48;

      // Left ultramarine body + satellites
      softBlob(leftX, midY, w * 0.38, h * 0.42, BLUE, 0.72);
      softBlob(leftX - w * 0.08, midY - h * 0.12, w * 0.18, h * 0.16, BLUE, 0.4);
      softBlob(leftX + w * 0.06, midY + h * 0.18, w * 0.14, h * 0.12, BLUE, 0.35);

      // Right vermilion
      softBlob(rightX, midY, w * 0.36, h * 0.4, RED, 0.7);
      softBlob(rightX + w * 0.07, midY - h * 0.14, w * 0.16, h * 0.14, RED, 0.38);
      softBlob(rightX - w * 0.05, midY + h * 0.16, w * 0.15, h * 0.13, RED, 0.32);

      // Pre-contact halo (colors almost touching)
      if (approach > 0.7) {
        const edge = (approach - 0.7) / 0.3;
        softBlob(w * 0.46, midY, w * 0.08 * edge, h * 0.1 * edge, BLUE, 0.25);
        softBlob(w * 0.54, midY, w * 0.08 * edge, h * 0.1 * edge, RED, 0.25);
      }

      // Mix zone — real violet bloom
      if (mix > 0) {
        const mx = w * 0.5;
        const my = midY;
        softBlob(mx, my, w * (0.12 + mix * 0.28), h * (0.14 + mix * 0.26), VIOLET, 0.15 + mix * 0.55);
        softBlob(mx - w * 0.04, my - h * 0.05, w * 0.14 * mix, h * 0.12 * mix, VIOLET, 0.35 * mix);
        softBlob(mx + w * 0.05, my + h * 0.06, w * 0.12 * mix, h * 0.11 * mix, {
          r: 140,
          g: 70,
          b: 130,
        }, 0.3 * mix);

        // Finger bleeds — watercolor capillary action
        const bleedLen = mix * Math.min(w, h) * 0.28;
        const angles = [
          -0.4, 0.35, 1.1, 2.1, 2.8, -1.2, 0.9, -2.4, 1.7, -1.8,
        ];
        angles.forEach((a, i) => {
          const col = i % 3 === 0 ? VIOLET : i % 3 === 1 ? BLUE : RED;
          fingerBleed(
            mx + Math.cos(a) * 20,
            my + Math.sin(a) * 16,
            a,
            bleedLen * (0.7 + (i % 4) * 0.1),
            col,
            0.22 * mix,
          );
        });

        // Granulation speckles in the mix
        const speckleCount = Math.floor(mix * 48);
        for (let i = 0; i < speckleCount; i++) {
          const seed = i * 97.13;
          const sx = mx + Math.sin(seed) * w * 0.18 * mix;
          const sy = my + Math.cos(seed * 1.3) * h * 0.16 * mix;
          const sr = 1.2 + (i % 5) * 0.6;
          const c = i % 2 === 0 ? VIOLET : i % 3 === 0 ? BLUE : RED;
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.35 * mix})`;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Drips growing with progress
      const dripProg = Math.min(1, p / 0.5);
      const dripXs = [0.14, 0.28, 0.42, 0.58, 0.72, 0.86];
      dripXs.forEach((fx, i) => {
        const x = w * fx;
        const len = h * (0.18 + (i % 3) * 0.08) * dripProg;
        const col = i % 2 === 0 ? BLUE : RED;
        const g = ctx.createLinearGradient(x, 0, x, len);
        g.addColorStop(0, `rgba(${col.r},${col.g},${col.b},0.55)`);
        g.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 2 + (i % 3);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(
          x + (i % 2 === 0 ? 8 : -6),
          len * 0.35,
          x + (i % 2 === 0 ? -5 : 7),
          len * 0.7,
          x,
          len,
        );
        ctx.stroke();
        if (dripProg > 0.6) {
          softBlob(x, len, 6, 5, col, 0.35 * dripProg);
        }
      });

      // Final settle — whole field softly violets
      if (settle > 0) {
        softBlob(w * 0.5, midY, w * 0.45 * settle, h * 0.4 * settle, VIOLET, 0.12 * settle);
        // Tiny salt-lift stars
        for (let i = 0; i < 12 * settle; i++) {
          const sx = w * (0.35 + (i * 0.047) % 0.3);
          const sy = h * (0.35 + (i * 0.071) % 0.3);
          ctx.fillStyle = `rgba(243,235,227,${0.35 * settle})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Paper grain overlay — keep light; full loops are expensive on mobile
      const grainN = w < 700 ? 120 : 240;
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < grainN; i++) {
        const gx = (i * 47) % w;
        const gy = (i * 89) % h;
        ctx.fillStyle = i % 2 === 0 ? "#000" : "#fff";
        ctx.fillRect(gx, gy, 1, 1);
      }
      ctx.globalAlpha = 1;
    };

    let lastPainted = -1;
    const loop = () => {
      const p = progressRef.current;
      // Only redraw when progress moved enough — saves GPU while idle
      if (Math.abs(p - lastPainted) > 0.002) {
        lastPainted = p;
        paint();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    paint();
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(rafRef.current);
        if (entry.isIntersecting) {
          lastPainted = -1;
          loop();
        }
      },
      { rootMargin: "15% 0px" },
    );
    io.observe(canvas);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      if (!rootRef.current) return;

      const copy = rootRef.current.querySelector("[data-wash-copy]");
      const labelL = rootRef.current.querySelector("[data-label-l]");
      const labelR = rootRef.current.querySelector("[data-label-r]");
      const mixLabel = rootRef.current.querySelector("[data-mix-label]");
      const stage = rootRef.current.querySelectorAll("[data-stage]");

      gsap.set(copy, { opacity: 0, y: 36, filter: "blur(10px)" });
      gsap.set(mixLabel, { opacity: 0, scale: 0.85 });
      gsap.set(stage, { opacity: 0.25 });
      gsap.set(stage[0], { opacity: 1 });

      if (reduced) {
        progressRef.current = 1;
        gsap.set(copy, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(mixLabel, { opacity: 1, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=460%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // Stage labels
      tl.to(stage[0], { opacity: 1, duration: 0.4 }, 0);
      tl.to(stage[0], { opacity: 0.25, duration: 0.3 }, 0.9);
      tl.to(stage[1], { opacity: 1, duration: 0.4 }, 0.9);
      tl.to(stage[1], { opacity: 0.25, duration: 0.3 }, 1.8);
      tl.to(stage[2], { opacity: 1, duration: 0.4 }, 1.8);
      tl.to(stage[2], { opacity: 0.25, duration: 0.3 }, 2.7);
      tl.to(stage[3], { opacity: 1, duration: 0.4 }, 2.7);

      if (labelL && labelR) {
        tl.fromTo(
          labelL,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          0.2,
        );
        tl.fromTo(
          labelR,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          0.2,
        );
        tl.to([labelL, labelR], { opacity: 0.35, duration: 0.6 }, 2);
      }

      tl.to(mixLabel, { opacity: 1, scale: 1, duration: 0.8 }, 2.1);
      tl.to(
        copy,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
        2.6,
      );

      // Dummy duration so scrub spans full pigment lifecycle
      tl.to({}, { duration: 1.2 }, 3.2);
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  const stages = ["01 · Approach", "02 · Contact", "03 · Bleed", "04 · Violet"];

  return (
    <section
      ref={rootRef}
      className="relative h-svh overflow-hidden bg-[#e6e1d6]"
      aria-label="Wash collision"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* Soft vignette */}
      <div
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(26,20,16,0.18)]"
        aria-hidden="true"
      />

      <div className="container-x relative z-10 flex h-full flex-col justify-between py-12 md:py-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-label mb-2 tracking-[0.24em] text-foreground/55">
              Chapter — Wet into wet
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {stages.map((s) => (
                <li
                  key={s}
                  data-stage
                  className="font-display text-sm italic text-foreground/80"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <p
            data-mix-label
            className="rounded-full border border-[#6b3776]/35 bg-[#6b3776]/10 px-4 py-1.5 font-display text-sm italic text-[#6b3776]"
          >
            → Violet born
          </p>
        </div>

        <div data-wash-copy className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-foreground">
            When two colors
            <br />
            <span className="italic">refuse to stay apart.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-foreground/70 md:text-base">
            Ultramarine meets vermilion on damp cotton — capillary fingers pull
            them into a bruise of violet only water can invent.
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <p
            data-label-l
            className="font-display text-sm italic text-[#1e4d8c] md:text-base"
          >
            <span
              className="mr-2 inline-block size-2.5 rounded-full bg-[#1e4d8c] align-middle shadow-[0_0_12px_#1e4d8c]"
              aria-hidden="true"
            />
            Ultramarine
          </p>
          <p
            data-label-r
            className="font-display text-sm italic text-[#c43c2e] md:text-base"
          >
            Vermilion
            <span
              className="ml-2 inline-block size-2.5 rounded-full bg-[#c43c2e] align-middle shadow-[0_0_12px_#c43c2e]"
              aria-hidden="true"
            />
          </p>
        </div>
      </div>
    </section>
  );
}
