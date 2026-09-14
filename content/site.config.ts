/**
 * ─────────────────────────────────────────────────────────────────
 *  SITE CONFIG — MZAK watercolor fantasy atelier & gallery.
 * ─────────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  name: "MZAK",
  legalName: "MZAK Atelier",
  tagline: "Where water dreams in color",
  description:
    "MZAK paints luminous watercolor worlds — mist rivers, soft moons, and fantasy landscapes on paper.",
  url: "https://mzak.gallery",
  email: "studio@mzak.gallery",
  location: "Atelier visits by appointment",
  since: 2014,

  nav: [
    { label: "Gallery", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] as const,

  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Artsy", href: "https://artsy.net" },
    { label: "Behance", href: "https://behance.net" },
  ] as const,

  hero: {
    titleLines: ["Where water", "dreams in color"] as const,
    subtitle:
      "Luminous washes, mist rivers, and soft moons — fantasy watercolors for rooms that want a little magic.",
    cta: { label: "Step into the gallery", href: "/work" },
  },

  clients: [
    "River Mist",
    "Still Window",
    "Indigo Hour",
    "Soft Horizon",
    "Paper Tide",
    "Rose Cascade",
    "Sap Green Field",
    "Quiet Pool",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
