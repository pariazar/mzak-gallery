import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/motion/reveal";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { Marquee } from "@/components/motion/marquee";
import { Magnetic } from "@/components/motion/magnetic";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { DialogDemo } from "@/components/sections/dialog-demo";
import { LazyModelViewer } from "@/components/three";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Every reusable component of the boilerplate, isolated and documented.",
};

const COLORS = [
  { name: "background", varName: "--background" },
  { name: "surface", varName: "--surface" },
  { name: "surface-2", varName: "--surface-2" },
  { name: "foreground", varName: "--foreground" },
  { name: "muted-foreground", varName: "--muted-foreground" },
  { name: "accent", varName: "--accent" },
  { name: "destructive", varName: "--destructive" },
];

function Section({
  id,
  title,
  file,
  children,
}: {
  id: string;
  title: string;
  file: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border py-16">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl">{title}</h2>
        <code className="rounded bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
          {file}
        </code>
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="container-x pt-40 pb-28">
      <p className="text-label mb-8">Internal reference</p>
      <h1 className="text-display-xl mb-6">Design System</h1>
      <p className="mb-10 max-w-xl text-muted-foreground">
        Every reusable piece of the boilerplate, isolated. Re-skin the whole
        site from <code className="text-foreground">app/globals.css</code> and{" "}
        <code className="text-foreground">content/site.config.ts</code>.
      </p>

      <nav aria-label="Sections" className="mb-8 flex flex-wrap gap-2">
        {[
          "colors",
          "typography",
          "buttons",
          "forms",
          "dialog",
          "motion",
          "cursor",
          "three",
        ].map((s) => (
          <a
            key={s}
            href={`#${s}`}
            data-cursor="hover"
            className="rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {s}
          </a>
        ))}
      </nav>

      <Section id="colors" title="Colors" file="app/globals.css">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {COLORS.map((c) => (
            <div key={c.name}>
              <div
                className="aspect-square rounded border border-border"
                style={{ background: `var(${c.varName})` }}
              />
              <p className="mt-2 text-xs text-muted-foreground">{c.name}</p>
              <code className="text-[0.65rem] text-muted-foreground/60">
                {c.varName}
              </code>
            </div>
          ))}
        </div>
      </Section>

      <Section id="typography" title="Typography" file="app/globals.css">
        <div className="space-y-10">
          <div>
            <p className="text-label mb-3">.text-display-xl — Fraunces</p>
            <p className="text-display-xl">Aa Cinematic</p>
          </div>
          <div>
            <p className="text-label mb-3">.text-display</p>
            <p className="text-display">Editorial headline</p>
          </div>
          <div>
            <p className="text-label mb-3">.text-display-sm (italic)</p>
            <p className="text-display-sm italic">A quieter statement</p>
          </div>
          <div>
            <p className="text-label mb-3">Body — Manrope</p>
            <p className="max-w-xl">
              The quick brown fox jumps over the lazy dog. Body copy stays
              neutral and highly readable so the display face can do the
              talking.
            </p>
          </div>
          <div>
            <p className="text-label mb-3">.text-label</p>
            <p className="text-label">05 — Uppercase editorial label</p>
          </div>
        </div>
      </Section>

      <Section
        id="buttons"
        title="Buttons & badges"
        file="components/ui/button.tsx"
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button data-cursor="hover">Primary</Button>
          <Button variant="outline" data-cursor="hover">
            Outline
          </Button>
          <Button variant="ghost" data-cursor="hover">
            Ghost
          </Button>
          <Button variant="link" data-cursor="hover">
            Link style
          </Button>
          <Button size="sm" data-cursor="hover">
            Small
          </Button>
          <Button size="lg" data-cursor="hover">
            Large
          </Button>
          <Button
            size="icon"
            aria-label="Example icon button"
            data-cursor="hover"
          >
            <ArrowUpRight />
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Badge>Outline</Badge>
          <Badge variant="default">Accent</Badge>
          <Badge variant="muted">Muted</Badge>
        </div>
        <div className="mt-8">
          <p className="text-label mb-4">Magnetic wrapper</p>
          <Magnetic>
            <Button size="lg" data-cursor="hover">
              I follow your cursor
            </Button>
          </Magnetic>
        </div>
      </Section>

      <Section id="forms" title="Form elements" file="components/ui/input.tsx">
        <div className="grid max-w-2xl gap-8">
          <div className="space-y-3">
            <Label htmlFor="ds-input">Text input</Label>
            <Input id="ds-input" placeholder="Underlined, editorial" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="ds-textarea">Textarea</Label>
            <Textarea id="ds-textarea" placeholder="Same language, taller" />
          </div>
        </div>
      </Section>

      <Section id="dialog" title="Dialog" file="components/ui/dialog.tsx">
        <DialogDemo />
      </Section>

      <Section id="motion" title="Motion primitives" file="components/motion/*">
        <div className="space-y-14">
          <div>
            <p className="text-label mb-4">&lt;Reveal&gt; — scroll into view</p>
            <Reveal>
              <div className="rounded border border-border bg-surface p-8">
                Fades and rises when it enters the viewport.
              </div>
            </Reveal>
          </div>
          <div>
            <p className="text-label mb-4">
              &lt;SplitTextReveal&gt; — masked lines
            </p>
            <SplitTextReveal as="p" type="words" className="text-display-sm">
              Words slide out of a mask
            </SplitTextReveal>
          </div>
          <div>
            <p className="text-label mb-4">&lt;Marquee&gt;</p>
            <div className="border-y border-border py-6">
              <Marquee duration={18}>
                <span className="flex items-center gap-[4vw] whitespace-nowrap font-display text-2xl text-muted-foreground">
                  Infinite scrolling strip — duplicate, translate, loop —
                </span>
              </Marquee>
            </div>
          </div>
          <div>
            <p className="text-label mb-4">
              &lt;ParallaxLayer speed=&#123;-0.5&#125;&gt;
            </p>
            <div className="h-48 overflow-hidden rounded border border-border">
              <ParallaxLayer
                speed={-0.5}
                className="flex h-72 items-center justify-center bg-surface"
              >
                <span className="text-muted-foreground">
                  I scroll at a different speed
                </span>
              </ParallaxLayer>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="cursor"
        title="Custom cursor"
        file="components/layout/custom-cursor.tsx"
      >
        <p className="mb-6 max-w-xl text-sm text-muted-foreground">
          Decorative only — keyboard and screen readers are unaffected. Drive it
          with <code>data-cursor</code> attributes:
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div
            data-cursor="hover"
            className="flex h-40 items-center justify-center rounded border border-border bg-surface text-sm text-muted-foreground"
          >
            data-cursor=&quot;hover&quot;
          </div>
          <div
            data-cursor="view"
            data-cursor-label="View"
            className="flex h-40 items-center justify-center rounded border border-border bg-surface text-sm text-muted-foreground"
          >
            data-cursor=&quot;view&quot;
          </div>
          <div
            data-cursor="drag"
            data-cursor-label="Drag"
            className="flex h-40 items-center justify-center rounded border border-border bg-surface text-sm text-muted-foreground"
          >
            data-cursor=&quot;drag&quot;
          </div>
        </div>
      </Section>

      <Section
        id="three"
        title="3D — ModelViewer"
        file="components/three/model-viewer.tsx"
      >
        <p className="mb-6 max-w-xl text-sm text-muted-foreground">
          Without a <code>glbUrl</code> it renders the procedural AuroraBlob.
          Point it at an optimized .glb from the Blender pipeline to swap in a
          real model — same lighting, same behavior.
        </p>
        <div
          className="relative h-[28rem] overflow-hidden rounded border border-border"
          data-cursor="drag"
          data-cursor-label="Look"
        >
          <LazyModelViewer className="absolute inset-0" />
        </div>
      </Section>
    </main>
  );
}
