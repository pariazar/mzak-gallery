#!/usr/bin/env node
/**
 * Compress a Blender-exported .glb for the web:
 * Draco mesh compression + WebP textures capped at 1024px.
 *
 *   npm run optimize-model -- public/models/raw.glb [public/models/hero.glb]
 *
 * Uses @gltf-transform/cli via npx (downloaded on first run).
 * Part of the BlenderMCP pipeline — see README "3D asset workflow".
 */
import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";

const [input, output] = process.argv.slice(2);

if (!input) {
  console.error("Usage: npm run optimize-model -- <input.glb> [output.glb]");
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`File not found: ${input}`);
  process.exit(1);
}

const out = output ?? input.replace(/\.glb$/i, ".web.glb");
const mb = (path) => (statSync(path).size / 1024 / 1024).toFixed(2);

console.log(`Optimizing ${input} (${mb(input)} MB)…`);

const result = spawnSync(
  "npx",
  [
    "--yes",
    "@gltf-transform/cli",
    "optimize",
    input,
    out,
    "--compress",
    "draco",
    "--texture-compress",
    "webp",
    "--texture-size",
    "1024",
  ],
  { stdio: "inherit" },
);

if (result.status !== 0) {
  console.error("gltf-transform failed — is the input a valid .glb?");
  process.exit(result.status ?? 1);
}

console.log(`\n✓ ${out} (${mb(out)} MB, was ${mb(input)} MB)`);
console.log("Move it to public/models/ and set glbUrl on <ModelViewer>.");
