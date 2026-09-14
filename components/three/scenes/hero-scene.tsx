"use client";

import { AuroraBlob, SceneLights } from "./aurora-blob";
import { ParticleField } from "./particle-field";

/**
 * Hero background: soft watercolor bloom + pigment flecks on cool paper fog.
 */
export function HeroScene() {
  return (
    <>
      <SceneLights />
      <ParticleField />
      <AuroraBlob position={[2.2, 0.45, -0.9]} scale={1.35} color="#6a8fc4" />
      <AuroraBlob
        position={[-1.8, -0.6, -1.6]}
        scale={0.7}
        distort={0.22}
        color="#c45c6a"
      />
      <fog attach="fog" args={["#f0f3f6", 6, 16]} />
    </>
  );
}
