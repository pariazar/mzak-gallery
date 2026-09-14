"use client";

import { Component, Suspense, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CanvasWrapper } from "@/components/three/canvas-wrapper";
import { AuroraBlob, SceneLights } from "@/components/three/scenes/aurora-blob";

/**
 * <ModelViewer glbUrl="/models/client-asset.glb" />
 *
 * Displays a real .glb (exported from Blender via the BlenderMCP
 * pipeline, optimized with `npm run optimize-model`). Draco-compressed
 * files are supported out of the box. Without a `glbUrl` — or if the
 * file fails to load — it falls back to the procedural AuroraBlob so
 * the boilerplate stays demo-complete with zero external assets.
 */
interface ModelViewerProps {
  glbUrl?: string;
  className?: string;
  /** Radians/second of idle rotation */
  autoRotateSpeed?: number;
  scale?: number;
}

export function ModelViewer({
  glbUrl,
  className,
  autoRotateSpeed = 0.25,
  scale = 1,
}: ModelViewerProps) {
  return (
    <CanvasWrapper className={className}>
      <SceneLights />
      <Suspense fallback={null}>
        {glbUrl ? (
          <ModelErrorBoundary fallback={<AuroraBlob />}>
            <RotatingRig speed={autoRotateSpeed}>
              <Center>
                <GLBModel url={glbUrl} scale={scale} />
              </Center>
            </RotatingRig>
          </ModelErrorBoundary>
        ) : (
          <AuroraBlob />
        )}
      </Suspense>
    </CanvasWrapper>
  );
}

function GLBModel({ url, scale }: { url: string; scale: number }) {
  // second arg `true` → Draco decoder (loaded on demand)
  const { scene } = useGLTF(url, true);
  return <primitive object={scene} scale={scale} />;
}

/** Slow idle rotation + pointer tilt for any child model. */
function RotatingRig({
  children,
  speed,
}: {
  children: ReactNode;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    group.rotation.y += delta * speed;
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      state.pointer.y * 0.25,
      2,
      delta,
    );
  });

  return <group ref={ref}>{children}</group>;
}

/** Falls back to the procedural blob if the .glb fails to load. */
class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[ModelViewer] Failed to load model, using fallback:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
