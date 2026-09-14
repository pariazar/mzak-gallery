"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether an element is (roughly) inside the viewport.
 * Used to pause 3D canvases and marquees when off-screen.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "200px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
