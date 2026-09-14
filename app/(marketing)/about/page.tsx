import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { Marquee } from "@/components/motion/marquee";
import { padIndex } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "MZAK — watercolor artist working in transparent wash, wet-on-wet, and quiet still studies.",
};

const VALUES = [
  {
    name: "Water first",
    description:
      "Every painting begins as a pour. Form arrives later — if the paper asks for it.",
  },
  {
    name: "Leave the accident",
    description:
      "Bleeds, blooms, and salt lifts stay. Control is a guest, not the host.",
  },
  {
    name: "Quiet over spectacle",
    description:
      "Works meant for long looking — soft contrast, slow edges, rooms that breathe.",
  },
  {
    name: "Paper as partner",
    description:
      "Cold-pressed cotton only. The grain is part of the image, never a backdrop.",
  },
];

const MATERIALS = [
  { name: "Cobalt & ultramarine", role: "Sky, depth, cool shadow" },
  { name: "Rose madder", role: "Warm edge, cascade, blush" },
  { name: "Sap green & ochre", role: "Field, horizon, earth breath" },
  { name: "Cold-pressed cotton", role: "300gsm — holds a long wet" },
];

export default function AboutPage() {
  return (
    <main className="pt-40">
      <header className="container-x mb-24">
        <Reveal>
          <p className="text-label mb-8">About the artist</p>
        </Reveal>
        <SplitTextReveal
          as="h1"
          type="words"
          className="text-display-xl max-w-[14ch]"
        >
          MZAK paints soft magic
        </SplitTextReveal>
        <Reveal delay={0.25}>
          <p className="mt-10 max-w-xl text-lg text-muted-foreground">
            {siteConfig.name} works from a luminous atelier — fantasy
            watercolors on cotton, commissions by appointment, gallery visits
            when the light feels kind. {siteConfig.location}.
          </p>
        </Reveal>
      </header>

      {/* Image band */}
      <div className="relative h-[50vh] overflow-hidden">
        <ParallaxLayer speed={-0.4} className="absolute -inset-y-20 inset-x-0">
          <Image
            src="/covers/indigo-hour.svg"
            alt="Indigo Hour watercolor detail"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </ParallaxLayer>
      </div>

      {/* Values */}
      <section className="container-x section-y">
        <Reveal>
          <p className="text-label mb-14">How the work thinks</p>
        </Reveal>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {VALUES.map((value, i) => (
            <Reveal key={value.name} delay={(i % 2) * 0.12}>
              <div className="border-t border-border pt-6">
                <p className="text-label mb-4">{padIndex(i)}</p>
                <h2 className="font-display text-3xl">{value.name}</h2>
                <p className="mt-4 max-w-md text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section className="border-t border-border">
        <div className="container-x section-y">
          <Reveal>
            <p className="text-label mb-14">Pigment & paper</p>
          </Reveal>
          <ul>
            {MATERIALS.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.08}>
                <li className="group flex flex-wrap items-baseline justify-between gap-2 border-t border-border py-6 last:border-b">
                  <span className="font-display text-3xl transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent">
                    {item.name}
                  </span>
                  <span className="text-label">{item.role}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Rolling statement */}
      <div className="border-t border-border py-12" aria-hidden="true">
        <Marquee duration={24}>
          <span className="flex items-center gap-[4vw] whitespace-nowrap font-display text-5xl italic text-muted-foreground/50">
            Pigment. Paper. Silence. —
          </span>
        </Marquee>
      </div>
    </main>
  );
}
