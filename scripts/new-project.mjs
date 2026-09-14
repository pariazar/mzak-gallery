#!/usr/bin/env node
/**
 * Bootstrap a new client project from this boilerplate.
 *
 *   npm run new-project -- --name="Client Name" [--accent="#00ff88"] \
 *     [--url="https://client.com"] [--email="hello@client.com"]
 *
 * Non-interactive by design: pass everything as flags.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const { values } = parseArgs({
  options: {
    name: { type: "string" },
    accent: { type: "string" },
    url: { type: "string" },
    email: { type: "string" },
  },
});

if (!values.name) {
  console.error(
    'Usage: npm run new-project -- --name="Client Name" [--accent="#00ff88"] [--url=…] [--email=…]',
  );
  process.exit(1);
}

const displayName = values.name.trim();
const slug = displayName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

function patchFile(relPath, replacers) {
  const path = join(root, relPath);
  let content = readFileSync(path, "utf8");
  for (const [pattern, replacement, label] of replacers) {
    if (!pattern.test(content)) {
      console.warn(`  ⚠ could not find ${label} in ${relPath} — skipped`);
      continue;
    }
    content = content.replace(pattern, replacement);
    console.log(`  ✓ ${relPath}: ${label}`);
  }
  writeFileSync(path, content);
}

console.log(`\nConfiguring project for "${displayName}" (${slug})\n`);

// package.json — name
patchFile("package.json", [
  [/"name":\s*"[^"]*"/, `"name": "${slug}"`, "package name"],
]);

// site.config.ts — brand identity
const configReplacers = [
  [
    /name: "[^"]*",\n\s+\/\*\* Legal/,
    `name: "${displayName.toUpperCase()}",\n  /** Legal`,
    "brand name",
  ],
  [/legalName: "[^"]*"/, `legalName: "${displayName}"`, "legal name"],
];
if (values.url) {
  configReplacers.push([/url: "[^"]*"/, `url: "${values.url}"`, "site URL"]);
}
if (values.email) {
  configReplacers.push([/email: "[^"]*"/, `email: "${values.email}"`, "email"]);
}
patchFile("content/site.config.ts", configReplacers);

// globals.css — accent color
if (values.accent) {
  patchFile("app/globals.css", [
    [/--accent: [^;]+;/, `--accent: ${values.accent};`, "accent color"],
  ]);
}

console.log(`
────────────────────────────────────────────────────────
Done. Manual checklist for ${displayName}:

  □ content/site.config.ts   → tagline, description, socials, nav, hero copy
  □ content/case-studies.ts  → real projects (covers in /public/covers)
  □ app/globals.css          → full palette, fonts, radius (accent ${values.accent ? "already set" : "still default"})
  □ app/layout.tsx           → swap Fraunces/Manrope if the brand needs it
  □ public/models/           → real .glb via Blender → npm run optimize-model
  □ components/three         → point ModelViewer/hero at the client asset
  □ app/favicon.ico          → client favicon
  □ OG image                 → app/opengraph-image.tsx renders from config;
                               replace with a designed image if provided
  □ Contact form             → wire onSubmit to a real endpoint
  □ git remote               → point at the client repository
────────────────────────────────────────────────────────
`);
