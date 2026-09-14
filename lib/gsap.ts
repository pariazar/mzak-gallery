"use client";

/**
 * Central GSAP setup — import gsap from here everywhere so plugins
 * are registered exactly once and defaults stay consistent.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({
    // Avoid expensive full refreshes on mobile URL-bar resize
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
  ScrollTrigger.defaults({
    anticipatePin: 1,
    fastScrollEnd: true,
    preventOverlaps: true,
  });
}

/** House easing curves — keep motion consistent across the site. */
export const EASE = {
  out: "power3.out",
  inOut: "power3.inOut",
  expo: "expo.out",
  /** Dramatic reveal curve for hero/preloader moments */
  cinematic: "expo.inOut",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
