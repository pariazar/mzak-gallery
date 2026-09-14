import { Marquee } from "@/components/motion/marquee";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { Reveal } from "@/components/motion/reveal";

const EXHIBITIONS = [
  "Indigo Hour — Autumn Salon",
  "Paper Tide — Group show",
  "Still Window — Atelier open day",
  "River Mist — Private viewing",
  "Soft Horizon — Regional biennale",
  "Quiet Pool — Collector preview",
];

/** Exhibition marquee + collector / critic quote. */
export function Testimonial() {
  return (
    <section>
      <div className="py-10" aria-label="Exhibitions">
        <Marquee duration={28} reverse>
          {EXHIBITIONS.map((item) => (
            <span
              key={item}
              className="flex items-center gap-[4vw] whitespace-nowrap text-label !text-base"
            >
              {item}
              <span className="text-accent" aria-hidden="true">
                —
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x section-y">
        <Reveal>
          <p className="text-label mb-10">Voices — From the wall</p>
        </Reveal>
        <figure>
          <blockquote>
            <SplitTextReveal
              as="p"
              type="lines"
              className="text-display-sm max-w-5xl italic text-foreground/90"
            >
              “MZAK paints the pause — that soft second when water still decides
              the edge. The works feel like rooms you can breathe in.”
            </SplitTextReveal>
          </blockquote>
          <Reveal delay={0.25}>
            <figcaption className="mt-10 text-sm text-muted-foreground">
              <span className="text-foreground">Elena Varga</span> — Independent
              curator
            </figcaption>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
