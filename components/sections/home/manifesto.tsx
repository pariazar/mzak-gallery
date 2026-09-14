import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/layout/page-transition";
import { ArrowUpRight } from "lucide-react";

const STATS = [
  { value: "90+", label: "Works on paper" },
  { value: "12", label: "Solo & group shows" },
  { value: "11", label: "Years with watercolor" },
];

/** Artist credo — big editorial statement + stats row. */
export function Manifesto() {
  return (
    <section>
      <div className="container-x section-y">
        <Reveal>
          <p className="text-label mb-10">Atelier — Numbers on paper</p>
        </Reveal>

        <SplitTextReveal
          as="p"
          type="lines"
          className="text-display-sm max-w-4xl text-foreground/90"
        >
          Watercolor is how dreams keep a soft edge. MZAK paints mist rivers,
          floating moons, and quiet magic — pigment that still remembers water.
        </SplitTextReveal>

        <Reveal delay={0.2} className="mt-10">
          <TransitionLink
            href="/about"
            data-cursor="hover"
            className="link-underline inline-flex items-center gap-2 text-label text-foreground"
          >
            About the artist <ArrowUpRight className="size-3.5" />
          </TransitionLink>
        </Reveal>

        <div className="mt-24 grid gap-10 border-t border-border pt-10 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.12}>
              <p className="font-display text-6xl">{stat.value}</p>
              <p className="text-label mt-3">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
