"use client";

/* eslint-disable react-hooks/purity, react-hooks/immutability --
   Idiomatic three.js: particle buffers are seeded once with Math.random
   inside useMemo, and uniforms are mutated per-frame in useFrame, which
   runs in the R3F render loop — outside React's render cycle. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getQualityTier } from "@/lib/device";
import { themeColors } from "@/lib/theme-colors";

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  attribute float aScale;
  attribute float aPhase;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;

    // slow organic drift
    p.y += sin(uTime * 0.25 + aPhase * 6.2831) * 0.35;
    p.x += cos(uTime * 0.18 + aPhase * 6.2831) * 0.28;

    // mouse parallax — deeper particles move more
    p.xy += uMouse * (0.25 + (p.z + 2.0) * 0.12);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);

    // twinkle
    vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aPhase) + aPhase * 12.0));
    vMix = aPhase;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vMix;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
    if (alpha < 0.01) discard;
    vec3 color = mix(uColorA, uColorB, step(0.82, vMix));
    gl_FragColor = vec4(color, alpha);
  }
`;

interface ParticleFieldProps {
  /** Override the automatic quality-based particle count */
  count?: number;
  /** Spread of the field in world units */
  spread?: [number, number, number];
}

/**
 * Procedural starfield-like particle system with soft round points,
 * slow drift, twinkle and mouse parallax. ~18% of particles pick up
 * the theme accent color.
 */
export function ParticleField({
  count,
  spread = [11, 6, 4],
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const resolvedCount = count ?? (getQualityTier() === "low" ? 500 : 1400);

  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(resolvedCount * 3);
    const scales = new Float32Array(resolvedCount);
    const phases = new Float32Array(resolvedCount);
    for (let i = 0; i < resolvedCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2] - 1;
      scales[i] = 0.5 + Math.random();
      phases[i] = Math.random();
    }
    return { positions, scales, phases };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 36 },
      uColorA: { value: new THREE.Color(themeColors.foreground()) },
      uColorB: { value: new THREE.Color(themeColors.accent()) },
    }),
    [],
  );

  const mouseTarget = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    // ease the mouse for a heavier, cinematic feel (reuse vectors — no GC)
    mouseTarget.set(state.pointer.x, state.pointer.y);
    uniforms.uMouse.value.lerp(mouseTarget, 0.03);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
