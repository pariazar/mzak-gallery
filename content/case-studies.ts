/**
 * MZAK watercolor series — keep CaseStudy shape for gallery routes.
 * Covers are procedural watercolor SVGs from `scripts/generate-covers.mjs`.
 */

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  year: number;
  categories: string[];
  services: string[];
  cover: string;
  gallery: string[];
  /** Accent color used for hover states on this work */
  accent: string;
  tagline: string;
  intro: string;
  challenge: string;
  approach: string;
  results: { value: string; label: string }[];
  website?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "river-mist",
    title: "River Mist",
    client: "Series I",
    year: 2025,
    categories: ["Landscape", "Wash"],
    services: ["Wet-on-wet", "Cobalt", "Cold-pressed paper"],
    cover: "/covers/river-mist.svg",
    gallery: ["/covers/river-mist-1.svg", "/covers/river-mist-2.svg"],
    accent: "#1e4d8c",
    tagline: "Dawn fog lifting off a silver bend",
    intro:
      "River Mist began as a memory of walking the bank before the city woke — water and sky the same pale ink, only the willows knowing where one ended.",
    challenge:
      "How do you paint humidity? The piece needed air more than form — edges that dissolve, horizons that refuse a hard line.",
    approach:
      "Three transparent cobalt pours on cold-pressed cotton, lifted with a thirsty brush while still wet. Rose-madder bled in at the lower bank for warmth without weight.",
    results: [
      { value: "56×76", label: "cm on cotton" },
      { value: "3", label: "Transparent layers" },
      { value: "Sold", label: "Private collection" },
    ],
  },
  {
    slug: "still-window",
    title: "Still Window",
    client: "Series II",
    year: 2025,
    categories: ["Still life", "Interior"],
    services: ["Dry brush", "Glaze", "Negative space"],
    cover: "/covers/still-window.svg",
    gallery: ["/covers/still-window-1.svg", "/covers/still-window-2.svg"],
    accent: "#c43c2e",
    tagline: "Afternoon light holding a glass of water",
    intro:
      "A single glass, a sill, and the soft rectangle of sky. Still Window is about what light does when nobody is performing for it.",
    challenge:
      "Glass is a trap in watercolor — too much edge and it becomes illustration; too little and it vanishes into the wash.",
    approach:
      "Reserved whites for the rim highlights, then a slow rose-madder glaze in the shadow pool. The glass itself is mostly what surrounds it.",
    results: [
      { value: "40×50", label: "cm on paper" },
      { value: "5", label: "Glaze passes" },
      { value: "Studio", label: "Available" },
    ],
  },
  {
    slug: "indigo-hour",
    title: "Indigo Hour",
    client: "Series III",
    year: 2024,
    categories: ["Wash", "Abstract"],
    services: ["Granulation", "Salt lift", "Indigo"],
    cover: "/covers/indigo-hour.svg",
    gallery: ["/covers/indigo-hour-1.svg", "/covers/indigo-hour-2.svg"],
    accent: "#1a3a6e",
    tagline: "The blue that arrives after the last bird",
    intro:
      "Indigo Hour is less a place than a temperature — when the paper still holds daylight but the pigment has already decided it is night.",
    challenge:
      "Indigo can deaden a page. The work needed depth without becoming a flat navy slab.",
    approach:
      "Granulating indigo poured into damp wells, salt crystals for stars of lift, a thin sap-green breath at the horizon so the blue never feels alone.",
    results: [
      { value: "70×100", label: "cm on cotton" },
      { value: "Salt", label: "Lift technique" },
      { value: "Shown", label: "Autumn salon" },
    ],
  },
  {
    slug: "soft-horizon",
    title: "Soft Horizon",
    client: "Series I",
    year: 2024,
    categories: ["Landscape", "Wash"],
    services: ["Wet-into-wet", "Sap green", "Ochre"],
    cover: "/covers/soft-horizon.svg",
    gallery: ["/covers/soft-horizon-1.svg", "/covers/soft-horizon-2.svg"],
    accent: "#2d6b4f",
    tagline: "Fields that refuse to end",
    intro:
      "Painted after a train window blurred into bands of green and pale gold — Soft Horizon keeps that motion without a vanishing point.",
    challenge:
      "A landscape without a landmark can feel empty. The piece needed quiet, not vacancy.",
    approach:
      "Horizontal pours of sap green into warm ochre, tilted board for gentle runs. One cobalt breath at the top edge to pin the sky.",
    results: [
      { value: "50×70", label: "cm on paper" },
      { value: "Tilt", label: "Board pour" },
      { value: "Edition", label: "Study available" },
    ],
  },
  {
    slug: "rose-cascade",
    title: "Rose Cascade",
    client: "Series IV",
    year: 2023,
    categories: ["Floral", "Portrait study"],
    services: ["Wet edge", "Rose madder", "Splatter"],
    cover: "/covers/rose-cascade.svg",
    gallery: ["/covers/rose-cascade-1.svg", "/covers/rose-cascade-2.svg"],
    accent: "#c43c2e",
    tagline: "Petals that almost leave the page",
    intro:
      "Rose Cascade is a vertical fall of madder and soft violet — not a bouquet, but the moment petals decide gravity is interesting.",
    challenge:
      "Florals tip easily into decoration. This needed weight, drip, and a little accident.",
    approach:
      "Loaded brush, vertical runs, then fingertip speckles of dilute cobalt into the wet cascade so cool notes interrupt the pink.",
    results: [
      { value: "30×90", label: "cm scroll format" },
      { value: "Wet", label: "Edge cascades" },
      { value: "Held", label: "Atelier archive" },
    ],
  },
  {
    slug: "quiet-pool",
    title: "Quiet Pool",
    client: "Series II",
    year: 2023,
    categories: ["Landscape", "Still life"],
    services: ["Reflection", "Transparent wash", "Ultramarine"],
    cover: "/covers/quiet-pool.svg",
    gallery: ["/covers/quiet-pool-1.svg", "/covers/quiet-pool-2.svg"],
    accent: "#1e4d8c",
    tagline: "Water remembering the sky",
    intro:
      "A stone basin in the courtyard after rain — Quiet Pool is the sky turned upside down and made smaller, kinder.",
    challenge:
      "Reflections in watercolor often look pasted on. The water had to feel deeper than the pigment sitting on top.",
    approach:
      "First a pale ultramarine field; then darker rings while damp; finally a dry-brush whisper of stone so the pool has a lip without a hard outline.",
    results: [
      { value: "45×45", label: "cm square" },
      { value: "2", label: "Reflection passes" },
      { value: "Open", label: "For commission twin" },
    ],
  },
];

export const allCategories = [
  "All",
  ...Array.from(new Set(caseStudies.flatMap((c) => c.categories))),
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getAdjacentCaseStudies(slug: string) {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  return {
    prev: caseStudies[(index - 1 + caseStudies.length) % caseStudies.length],
    next: caseStudies[(index + 1) % caseStudies.length],
  };
}
