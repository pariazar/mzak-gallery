"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Decorative chrome that isn't needed for first paint.
 * Deferred until after hydration + a short idle window so the hero
 * and preloader get the main thread first.
 */
const CustomCursor = dynamic(
  () =>
    import("@/components/layout/custom-cursor").then((m) => m.CustomCursor),
  { ssr: false },
);

const GrainOverlay = dynamic(
  () =>
    import("@/components/layout/grain-overlay").then((m) => m.GrainOverlay),
  { ssr: false },
);

const SmoothScroll = dynamic(
  () =>
    import("@/components/motion/smooth-scroll").then((m) => m.SmoothScroll),
  { ssr: false },
);

export function DeferredChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enable = () => setReady(true);
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(enable, 400);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <GrainOverlay />
    </>
  );
}
