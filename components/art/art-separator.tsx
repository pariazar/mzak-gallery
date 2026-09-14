"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Variant = "stroke" | "drip" | "bloom" | "tear" | "ribbon";

const PALETTES: Record<
  Variant,
  { a: string; b: string; c: string }
> = {
  stroke: { a: "#1e4d8c", b: "#c43c2e", c: "#c9a227" },
  drip: { a: "#1f7a6c", b: "#1e4d8c", c: "#2d6b4f" },
  bloom: { a: "#c43c2e", b: "#6b3776", c: "#1e4d8c" },
  tear: { a: "#c9a227", b: "#c43c2e", c: "#1e4d8c" },
  ribbon: { a: "#2d6b4f", b: "#1f7a6c", c: "#c9a227" },
};

/**
 * Painted section separator — watercolor stroke / drip / bloom / torn edge.
 */
export function ArtSeparator({
  variant = "stroke",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const p = PALETTES[variant];

  return (
    <div
      className={cn(
        "art-separator relative z-20 w-full overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {variant === "stroke" && <StrokeSep uid={uid} p={p} />}
      {variant === "drip" && <DripSep uid={uid} p={p} />}
      {variant === "bloom" && <BloomSep uid={uid} p={p} />}
      {variant === "tear" && <TearSep uid={uid} p={p} />}
      {variant === "ribbon" && <RibbonSep uid={uid} p={p} />}
    </div>
  );
}

function StrokeSep({
  uid,
  p,
}: {
  uid: string;
  p: { a: string; b: string; c: string };
}) {
  return (
    <svg
      className="art-separator-svg block h-[72px] w-full md:h-[96px]"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`${uid}-wet`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="3"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" />
        </filter>
        <linearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p.a} stopOpacity="0" />
          <stop offset="18%" stopColor={p.a} stopOpacity="0.85" />
          <stop offset="48%" stopColor={p.b} stopOpacity="0.9" />
          <stop offset="78%" stopColor={p.c} stopOpacity="0.8" />
          <stop offset="100%" stopColor={p.c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 52 C180 20 320 78 480 44 S780 18 960 56 S1200 80 1440 40"
        fill="none"
        stroke={`url(#${uid}-g)`}
        strokeWidth="14"
        strokeLinecap="round"
        filter={`url(#${uid}-wet)`}
        opacity="0.75"
      />
      <path
        d="M0 58 C200 36 360 70 540 50 S860 30 1080 62 S1280 72 1440 48"
        fill="none"
        stroke={p.a}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
        filter={`url(#${uid}-wet)`}
      />
      {/* Splatters */}
      <circle cx="220" cy="38" r="3.5" fill={p.b} opacity="0.55" />
      <circle cx="710" cy="28" r="2.5" fill={p.a} opacity="0.5" />
      <circle cx="1180" cy="50" r="4" fill={p.c} opacity="0.5" />
    </svg>
  );
}

function DripSep({
  uid,
  p,
}: {
  uid: string;
  p: { a: string; b: string; c: string };
}) {
  const drips = [
    { x: 120, h: 48, c: p.a },
    { x: 280, h: 64, c: p.b },
    { x: 460, h: 40, c: p.c },
    { x: 640, h: 72, c: p.a },
    { x: 820, h: 52, c: p.b },
    { x: 1000, h: 68, c: p.c },
    { x: 1180, h: 44, c: p.a },
    { x: 1340, h: 58, c: p.b },
  ];
  return (
    <svg
      className="art-separator-svg block h-[88px] w-full md:h-[110px]"
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`${uid}-wet`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="8" />
        </filter>
      </defs>
      <path
        d="M0 18 H1440"
        stroke={p.a}
        strokeWidth="6"
        opacity="0.35"
        filter={`url(#${uid}-wet)`}
      />
      {drips.map((d) => (
        <g key={d.x} filter={`url(#${uid}-wet)`}>
          <path
            d={`M${d.x} 18 C${d.x - 4} ${18 + d.h * 0.4} ${d.x + 5} ${18 + d.h * 0.7} ${d.x} ${18 + d.h}`}
            fill="none"
            stroke={d.c}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle
            cx={d.x}
            cy={18 + d.h}
            r="4.5"
            fill={d.c}
            opacity="0.65"
          />
        </g>
      ))}
    </svg>
  );
}

function BloomSep({
  uid,
  p,
}: {
  uid: string;
  p: { a: string; b: string; c: string };
}) {
  return (
    <svg
      className="art-separator-svg block h-[100px] w-full md:h-[130px]"
      viewBox="0 0 1440 130"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`${uid}-wet`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025"
            numOctaves="3"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="18" />
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id={`${uid}-ra`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.a} stopOpacity="0.7" />
          <stop offset="100%" stopColor={p.a} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-rb`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.b} stopOpacity="0.65" />
          <stop offset="100%" stopColor={p.b} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-rc`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.c} stopOpacity="0.6" />
          <stop offset="100%" stopColor={p.c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#${uid}-wet)`}>
        <ellipse cx="360" cy="65" rx="220" ry="55" fill={`url(#${uid}-ra)`} />
        <ellipse cx="720" cy="60" rx="260" ry="62" fill={`url(#${uid}-rb)`} />
        <ellipse cx="1100" cy="70" rx="240" ry="50" fill={`url(#${uid}-rc)`} />
      </g>
    </svg>
  );
}

function TearSep({
  uid,
  p,
}: {
  uid: string;
  p: { a: string; b: string; c: string };
}) {
  return (
    <svg
      className="art-separator-svg block h-[64px] w-full md:h-[80px]"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6e1d6" stopOpacity="0" />
          <stop offset="40%" stopColor="#e6e1d6" stopOpacity="1" />
          <stop offset="100%" stopColor="#d8d2c6" stopOpacity="1" />
        </linearGradient>
        <filter id={`${uid}-rough`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.08"
            numOctaves="2"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
        </filter>
      </defs>
      <path
        d="M0 0 L1440 0 L1440 28 C1320 48 1200 18 1080 38 C960 58 840 22 720 42 C600 62 480 24 360 44 C240 64 120 28 0 40 Z"
        fill={`url(#${uid}-paper)`}
        filter={`url(#${uid}-rough)`}
      />
      <path
        d="M0 40 C180 55 360 30 540 48 S900 28 1080 46 S1320 58 1440 40"
        fill="none"
        stroke={p.a}
        strokeWidth="2"
        opacity="0.4"
      />
      <circle cx="400" cy="52" r="2.5" fill={p.b} opacity="0.5" />
      <circle cx="900" cy="56" r="2" fill={p.c} opacity="0.45" />
    </svg>
  );
}

function RibbonSep({
  uid,
  p,
}: {
  uid: string;
  p: { a: string; b: string; c: string };
}) {
  return (
    <svg
      className="art-separator-svg block h-[80px] w-full md:h-[100px]"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`${uid}-wet`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="2"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
        </filter>
        <linearGradient id={`${uid}-r`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p.a} stopOpacity="0.1" />
          <stop offset="35%" stopColor={p.a} stopOpacity="0.75" />
          <stop offset="55%" stopColor={p.b} stopOpacity="0.8" />
          <stop offset="75%" stopColor={p.c} stopOpacity="0.7" />
          <stop offset="100%" stopColor={p.c} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M0 40 C240 10 480 70 720 35 S1200 15 1440 50 L1440 70 C1200 40 960 90 720 55 S240 30 0 60 Z"
        fill={`url(#${uid}-r)`}
        filter={`url(#${uid}-wet)`}
        opacity="0.85"
      />
      <path
        d="M80 55 C300 30 500 75 740 48 S1100 25 1360 58"
        fill="none"
        stroke={p.b}
        strokeWidth="2"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
