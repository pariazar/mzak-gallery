# AETHER — Award-style Website Boilerplate

A reusable starting point for cinematic, "Awwwards-style" client websites:
Next.js 16 + real-time 3D + GSAP scroll animations, shipped as a **complete,
working demo site** — not an empty skeleton. Run it, look at it, then re-skin
it per client.

```bash
npm install
npm run dev        # → http://localhost:3000
```

`npm run build` passes with zero TypeScript errors and zero ESLint warnings.

---

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) + TypeScript strict | async `params`, no `next lint` |
| Styling | **Tailwind CSS v4** + shadcn-style UI kit | all tokens are CSS variables |
| 3D | **React Three Fiber 9** + drei + three.js | lazy-loaded, never in the initial bundle |
| Scroll/text animation | **GSAP 3** + ScrollTrigger + SplitText (free since 3.13) | central setup in `lib/gsap.ts` |
| UI micro-interactions | **Framer Motion 12** | menu overlay, page wipes, filters |
| Smooth scroll | **Lenis** | synced with ScrollTrigger via `useLenis()` |
| State | **Zustand** | preloader + menu state |
| Forms | react-hook-form + zod | contact form with animated states |
| Quality | ESLint 9 (+ React Compiler rules) · Prettier · Husky + lint-staged | pre-commit enforced |
| Fonts | Fraunces (display serif) + Manrope (body) via `next/font` | swap in `app/layout.tsx` |

## Design language (demo brand: "AETHER")

Minimal dark editorial: near-black `#0a0a0b`, warm ivory text, one hot accent
(`#ff4d00`), oversized Fraunces italics for display type, hairline borders,
film-grain overlay, pill buttons with uppercase tracking. All of it is
token-driven — see **Theming** below.

---

## Folder structure

```
app/
  (marketing)/            # public site
    page.tsx              # homepage: 3D hero → marquee → work → manifesto → …
    work/page.tsx         # filterable project grid
    work/[slug]/page.tsx  # case-study template (SSG)
    about/page.tsx
    contact/page.tsx      # RHF + zod form (submit is a stub — wire per client)
  design-system/page.tsx  # every reusable component, isolated (noindex'd)
  layout.tsx              # fonts, metadata, JSON-LD, global chrome
  template.tsx            # per-route enter animation
  sitemap.ts / robots.ts / opengraph-image.tsx
components/
  ui/                     # shadcn-style: button, input, textarea, label, badge, dialog
  motion/                 # Reveal, SplitTextReveal, ParallaxLayer, Marquee,
                          # Magnetic, SmoothScroll
  three/                  # CanvasWrapper, ParticleField, AuroraBlob, HeroScene,
                          # ModelViewer, StaticPoster, lazy barrel (index.tsx)
  layout/                 # Preloader, CustomCursor, Navbar, MenuOverlay,
                          # Footer, GrainOverlay, page transitions
  sections/               # page-level sections (home/*, work-grid, contact-form)
content/
  site.config.ts          # ⭐ brand, copy, SEO, socials — edit per client
  case-studies.ts         # mock projects — replace per client
lib/
  gsap.ts                 # plugin registration + house easings
  store.ts                # zustand app state
  device.ts               # quality tiers (high/low/off) for 3D
  theme-colors.ts         # read CSS vars from JS (3D picks up the theme)
  utils.ts, hooks/        # cn, lerp, useLenis, useReducedMotion, …
scripts/
  new-project.mjs         # re-brand the boilerplate for a new client
  optimize-model.mjs      # Draco+WebP compress Blender .glb exports
  generate-covers.mjs     # regenerate the procedural demo cover art
public/
  covers/                 # generated SVG artwork (demo)
  models/                 # optimized .glb files go here
```

---

## Starting a new client project

```bash
# 1. copy the boilerplate
npx degit <your-remote>/aether-boilerplate client-name && cd client-name
git init && npm install

# 2. re-brand in one command
npm run new-project -- --name="Client Name" --accent="#00ff88" \
  --url="https://client.com" --email="hello@client.com"

# 3. follow the printed checklist (copy, case studies, fonts, favicon, models…)
```

The script patches `package.json`, `content/site.config.ts` and the accent
color in `app/globals.css`, then prints everything that still needs a human.

## Theming — one file to re-skin everything

All colors, radii, spacing rhythm and type scale live as CSS variables in
**`app/globals.css`** (`:root` block) and map into Tailwind utilities through
`@theme inline`. Components never hardcode colors.

- Palette: `--background`, `--surface`, `--foreground`, `--accent`, …
- Type scale: `--text-display-xl/display/display-sm` (fluid `clamp()`)
- Rhythm: `--gutter`, `--section-y` · Shape: `--radius`
- Fonts: swap `Fraunces`/`Manrope` in `app/layout.tsx`; the CSS variables
  (`--font-fraunces`, `--font-manrope`) feed `--font-display`/`--font-sans`.
- **3D follows the theme too**: scenes read `--accent`/`--foreground` at
  runtime via `lib/theme-colors.ts`.

Brand copy, nav, socials and SEO defaults live in `content/site.config.ts`.

---

## Reusable components (see them live at `/design-system`)

| Component | File | Use |
| --- | --- | --- |
| `<Reveal>` | `components/motion/reveal.tsx` | fade+rise on scroll |
| `<SplitTextReveal>` | `components/motion/split-text-reveal.tsx` | masked line/word/char reveal; `trigger="manual"` to sync with the preloader |
| `<ParallaxLayer>` | `components/motion/parallax-layer.tsx` | scrubbed vertical parallax |
| `<Marquee>` | `components/motion/marquee.tsx` | infinite strip (CSS-driven) |
| `<Magnetic>` | `components/motion/magnetic.tsx` | cursor-attracted wrapper |
| `<TransitionLink>` | `components/layout/page-transition.tsx` | link with cinematic page wipe |
| `<Preloader>` | `components/layout/preloader.tsx` | counter + curtain; sets `loaderDone` |
| `<CustomCursor>` | `components/layout/custom-cursor.tsx` | drive via `data-cursor` / `data-cursor-label` |
| `<CanvasWrapper>` | `components/three/canvas-wrapper.tsx` | perf-safe R3F canvas |
| `<ParticleField>` / `<AuroraBlob>` | `components/three/scenes/` | procedural hero scenes |
| `<ModelViewer>` | `components/three/model-viewer.tsx` | .glb viewer with procedural fallback |
| UI kit | `components/ui/` | button, input, textarea, label, badge, dialog |

**Always import 3D through `components/three/index.tsx`** (`LazyHeroCanvas`,
`LazyModelViewer`) — that keeps three.js code-split with an SSR-safe gradient
poster while loading.

### Performance & accessibility built-ins

- `lib/device.ts` tiers devices (`high/low/off`): low-end gets fewer
  particles and capped DPR; weakest devices and `prefers-reduced-motion`
  get a static poster instead of WebGL.
- Every animation (GSAP, Framer Motion, Lenis, marquee, grain) respects
  `prefers-reduced-motion`.
- The custom cursor is decorative (`aria-hidden`, `pointer-events: none`);
  keyboard focus states are visible site-wide; icon-only buttons carry
  `aria-label`s.
- Canvases pause when off-screen or when the tab is hidden.

---

## 3D asset workflow (Blender + BlenderMCP)

The boilerplate never *requires* Blender — procedural scenes keep it
demo-complete. When you want a real client asset:

1. **One-time setup** (per machine): install [BlenderMCP](https://github.com/ahujasid/blender-mcp)
   — `brew install uv`, then `claude mcp add blender -- uvx blender-mcp`, then
   install `addon.py` in Blender (Edit → Preferences → Add-ons).
2. Open Blender, press `N` → **BlenderMCP** tab → **Connect to Claude**.
3. In Claude Code, ask for the model you need ("model an abstract chrome
   torus knot for the hero…"). Iterate in natural language.
4. Export as `.glb` (File → Export → glTF 2.0).
5. Compress it: `npm run optimize-model -- ~/Downloads/asset.glb public/models/hero.glb`
   (Draco meshes + WebP textures ≤1024px via gltf-transform).
6. Point the component at it:

```tsx
<LazyModelViewer glbUrl="/models/hero.glb" className="absolute inset-0" />
```

If the file is missing or fails to parse, `<ModelViewer>` falls back to the
procedural blob — the site never breaks because an asset isn't ready.

---

## SEO

- Title template + description from `site.config.ts` (Metadata API)
- Dynamic OG image (`app/opengraph-image.tsx`) rendered from the config
- `sitemap.ts` (includes case studies) and `robots.ts` (`/design-system`
  is disallowed)
- Organization JSON-LD in the root layout
- Per-page metadata on work/about/contact; per-project on `work/[slug]`

## Deploy (Vercel)

```bash
npm i -g vercel   # once
vercel            # preview
vercel --prod     # production
```

No special config needed — defaults work. Copy `.env.example` → `.env.local`
for anything server-side (contact form provider, analytics).
Set the real domain in `content/site.config.ts` before the first deploy.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js lifecycle |
| `npm run lint` / `format` | ESLint / Prettier over the repo |
| `npm run new-project -- --name="X"` | re-brand for a new client |
| `npm run optimize-model -- in.glb [out.glb]` | compress a Blender export |
| `node scripts/generate-covers.mjs` | regenerate demo cover art |

Husky runs lint-staged (ESLint + Prettier) on every commit.

---

## Pre-delivery checklist (per client)

- [ ] Real copy everywhere (`site.config.ts`, pages, case studies)
- [ ] Real imagery in `public/covers` (raster → keep `next/image` `sizes` correct;
      you can then remove `dangerouslyAllowSVG` from `next.config.ts`)
- [ ] Real 3D model optimized into `public/models` (or hero kept procedural)
- [ ] Contact form wired to a real endpoint (Resend/route handler) + spam control
- [ ] Favicon + designed OG image (replace `app/opengraph-image.tsx` if needed)
- [ ] `site.config.ts` URL = production domain; check `sitemap.xml` + `robots.txt`
- [ ] Lighthouse pass ≥ 90 perf / ≥ 95 a11y on key pages (test with 3D on)
- [ ] Test keyboard navigation and `prefers-reduced-motion`
- [ ] Analytics + cookie policy if required
- [ ] Remove `/design-system` from nav if the client shouldn't see it
