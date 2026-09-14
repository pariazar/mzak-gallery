import { siteConfig } from "@/content/site.config";
import { Marquee } from "@/components/motion/marquee";

/** Series names as a pigment ribbon through the gallery. */
export function ClientsMarquee() {
  return (
    <section
      className="relative overflow-hidden border-y border-border py-12"
      aria-label="Series and exhibitions"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, #1e4d8c 18%, transparent), color-mix(in oklab, #c43c2e 14%, transparent), color-mix(in oklab, #c9a227 16%, transparent), color-mix(in oklab, #1f7a6c 18%, transparent))",
        }}
        aria-hidden="true"
      />
      <Marquee duration={36}>
        {siteConfig.clients.map((client) => (
          <span
            key={client}
            className="relative flex items-center gap-[4vw] whitespace-nowrap font-display text-3xl text-foreground/75 md:text-4xl"
          >
            {client}
            <span className="inline-block size-2.5 rounded-full bg-accent" aria-hidden="true" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
