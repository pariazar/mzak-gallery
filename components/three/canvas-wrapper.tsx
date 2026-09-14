"use client";

import { useRef, useState, type ReactNode, type ComponentProps } from "react";
import { Canvas } from "@react-three/fiber";
import { getQualityTier, type QualityTier } from "@/lib/device";
import { useInViewport } from "@/lib/hooks/use-in-viewport";
import { StaticPoster } from "@/components/three/static-poster";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type CameraProps = ComponentProps<typeof Canvas>["camera"];

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
  camera?: CameraProps;
  /** Force a quality tier (defaults to automatic device detection) */
  quality?: QualityTier;
}

/**
 * Performance-safe R3F canvas:
 *  - never SSR'd (import through `components/three/index.tsx`)
 *  - dpr capped by device quality tier
 *  - rendering pauses when off-screen or the tab is hidden
 *  - renders a static gradient poster on "off" tier
 *    (low-end hardware / prefers-reduced-motion)
 */
export function CanvasWrapper({
  children,
  className,
  camera,
  quality,
}: CanvasWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const [tier] = useState<QualityTier>(() => quality ?? getQualityTier());
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (tier === "off") {
    return (
      <div ref={ref} className={cn("relative", className)}>
        <StaticPoster />
      </div>
    );
  }

  const active = inView && tabVisible;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Canvas
        className="!absolute !inset-0"
        dpr={tier === "low" ? [1, 1] : [1, 1.5]}
        camera={camera ?? { fov: 45, position: [0, 0, 6] }}
        frameloop={active ? "always" : "never"}
        performance={{ min: 0.5 }}
        gl={{
          antialias: tier === "high",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        aria-hidden="true"
      >
        {children}
      </Canvas>
    </div>
  );
}
