"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { themeColors } from "@/lib/theme-colors";

interface AuroraBlobProps {
  position?: [number, number, number];
  scale?: number;
  /** 0–1 — how liquid the surface is */
  distort?: number;
  color?: string;
}

/**
 * Soft watercolor bloom — a slow liquid sphere that tilts toward the
 * pointer like pigment pooling on wet paper.
 */
export function AuroraBlob({
  position = [0, 0, 0],
  scale = 1.6,
  distort = 0.28,
  color,
}: AuroraBlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const s = scale * (1 + Math.sin(t * 0.35) * 0.025);
    mesh.scale.setScalar(s);
    const targetX = state.pointer.y * 0.28;
    const targetY = state.pointer.x * 0.4 + t * 0.03;
    mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, targetX, 1.6, delta);
    mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, targetY, 1.6, delta);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color={color ?? "#6a8fc4"}
        distort={distort}
        speed={0.7}
        roughness={0.55}
        metalness={0.08}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

/** Soft atelier light rig: cobalt key + rose rim + paper fill. */
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <pointLight
        position={[3.2, 2.2, 3.2]}
        intensity={42}
        color={themeColors.accent()}
      />
      <pointLight position={[-3.5, -1.5, 2]} intensity={28} color="#c45c6a" />
      <pointLight position={[0.5, 2.8, -2.5]} intensity={22} color="#e8eef4" />
    </>
  );
}
