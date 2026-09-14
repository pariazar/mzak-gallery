#!/usr/bin/env node
/**
 * Generates watercolor-wash SVG cover art for MZAK gallery series.
 * Deterministic per slug — re-run: `node scripts/generate-covers.mjs`
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "covers");
mkdirSync(outDir, { recursive: true });

const PROJECTS = [
  { slug: "river-mist", a: "#1e4d8c", b: "#4a7eb8", c: "#1f7a6c", mood: "mist" },
  { slug: "still-window", a: "#c43c2e", b: "#e07060", c: "#1e4d8c", mood: "glass" },
  { slug: "indigo-hour", a: "#1a3a6e", b: "#3d5a9c", c: "#2d6b4f", mood: "night" },
  { slug: "soft-horizon", a: "#2d6b4f", b: "#c9a227", c: "#1e4d8c", mood: "field" },
  { slug: "rose-cascade", a: "#c43c2e", b: "#a85a6e", c: "#c9a227", mood: "cascade" },
  { slug: "quiet-pool", a: "#1e4d8c", b: "#1f7a6c", c: "#5a6573", mood: "pool" },
];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seedOf = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0);

function blob(rnd, color, opacity, scale = 1) {
  const cx = 200 + rnd() * 1200;
  const cy = 150 + rnd() * 900;
  const rx = (180 + rnd() * 420) * scale;
  const ry = (140 + rnd() * 380) * scale;
  const rot = rnd() * 60 - 30;
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" transform="rotate(${rot} ${cx} ${cy})"/>`;
}

function speckles(rnd, color, count) {
  return Array.from({ length: count })
    .map(() => {
      const x = 80 + rnd() * 1440;
      const y = 80 + rnd() * 1040;
      const r = 1.2 + rnd() * 4.5;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${0.15 + rnd() * 0.35}"/>`;
    })
    .join("\n");
}

function moodShapes(mood, a, b, c, rnd, variant) {
  switch (mood) {
    case "mist":
      return `
        ${blob(rnd, a, 0.45 + variant * 0.05, 1.15)}
        ${blob(rnd, b, 0.35, 0.95)}
        ${blob(rnd, c, 0.22, 0.75)}
        <path d="M 100 ${700 + variant * 40} Q 800 ${520 + variant * 30} 1500 ${680 + variant * 50}" fill="none" stroke="${a}" stroke-width="28" stroke-opacity="0.28" stroke-linecap="round"/>
      `;
    case "glass":
      return `
        <rect x="${480 + variant * 20}" y="220" width="${280 - variant * 20}" height="${620}" rx="4" fill="${b}" opacity="0.4"/>
        <rect x="${500 + variant * 20}" y="240" width="${40}" height="${560}" fill="${a}" opacity="0.22"/>
        ${blob(rnd, a, 0.32, 0.6)}
        ${blob(rnd, c, 0.2, 0.45)}
      `;
    case "night":
      return `
        ${blob(rnd, a, 0.55, 1.25)}
        ${blob(rnd, b, 0.38, 0.9)}
        ${speckles(rnd, "#efe9dc", 22 + variant * 4)}
        ${blob(rnd, c, 0.18, 0.55)}
      `;
    case "field":
      return `
        <ellipse cx="800" cy="${780 - variant * 30}" rx="700" ry="${160 + variant * 20}" fill="${a}" opacity="0.45"/>
        <ellipse cx="800" cy="${640 - variant * 20}" rx="650" ry="90" fill="${b}" opacity="0.35"/>
        ${blob(rnd, c, 0.25, 0.65)}
        ${blob(rnd, a, 0.3, 0.8)}
      `;
    case "cascade":
      return `
        <path d="M ${720 + variant * 40} 80 Q ${640 + variant * 20} 400 ${700 + variant * 30} 1100" fill="none" stroke="${a}" stroke-width="${110 - variant * 10}" stroke-opacity="0.4" stroke-linecap="round"/>
        <path d="M ${800 + variant * 20} 60 Q ${760} 450 ${820} 1120" fill="none" stroke="${b}" stroke-width="60" stroke-opacity="0.32" stroke-linecap="round"/>
        ${speckles(rnd, c, 16)}
        ${blob(rnd, a, 0.28, 0.55)}
      `;
    case "pool":
      return `
        <ellipse cx="800" cy="620" rx="${320 + variant * 40}" ry="${220 + variant * 20}" fill="${a}" opacity="0.48"/>
        <ellipse cx="800" cy="620" rx="${220 + variant * 20}" ry="${140 + variant * 10}" fill="${b}" opacity="0.4"/>
        <ellipse cx="760" cy="560" rx="60" ry="30" fill="#efe9dc" opacity="0.4"/>
        ${blob(rnd, c, 0.22, 0.5)}
      `;
    default:
      return blob(rnd, a, 0.25, 1);
  }
}

function makeSvg({ slug, a, b, c, mood }, variant) {
  const rnd = mulberry32(seedOf(slug) * 31 + variant * 7919);
  const uid = `${slug}-${variant}`.replace(/[^a-z0-9]/gi, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200">
  <defs>
    <filter id="paper-${uid}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer>
    </filter>
    <filter id="soft-${uid}">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <radialGradient id="edge-${uid}" cx="50%" cy="50%" r="70%">
      <stop offset="55%" stop-color="#e6e1d6" stop-opacity="0"/>
      <stop offset="100%" stop-color="#cfc8ba" stop-opacity="0.5"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1200" fill="#e6e1d6"/>
  <g filter="url(#soft-${uid})" opacity="0.98">
    ${moodShapes(mood, a, b, c, rnd, variant)}
    ${blob(rnd, a, 0.22, 0.85)}
    ${blob(rnd, b, 0.18, 0.7)}
  </g>
  ${speckles(rnd, a, 14 + variant * 3)}
  <rect width="1600" height="1200" fill="url(#edge-${uid})"/>
  <rect width="1600" height="1200" filter="url(#paper-${uid})"/>
</svg>`;
}

// Clear old demo covers so stale tech SVGs don't linger
for (const file of readdirSync(outDir)) {
  if (file.endsWith(".svg")) unlinkSync(join(outDir, file));
}

for (const project of PROJECTS) {
  for (const variant of [0, 1, 2]) {
    const name =
      variant === 0 ? `${project.slug}.svg` : `${project.slug}-${variant}.svg`;
    writeFileSync(join(outDir, name), makeSvg(project, variant));
    console.log(`✓ public/covers/${name}`);
  }
}
console.log("Done — watercolor covers regenerated.");
