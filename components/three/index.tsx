"use client";

/**
 * Lazy entry point for all 3D — import from here in pages so the
 * three.js bundle never blocks the initial load (code-split, no SSR,
 * gradient poster shown while the chunk streams in).
 */
import dynamic from "next/dynamic";
import { StaticPoster } from "@/components/three/static-poster";

export const LazyHeroCanvas = dynamic(
  () => import("@/components/three/hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => <StaticPoster /> },
);

export const LazyModelViewer = dynamic(
  () => import("@/components/three/model-viewer").then((m) => m.ModelViewer),
  { ssr: false, loading: () => <StaticPoster /> },
);

export { StaticPoster };
