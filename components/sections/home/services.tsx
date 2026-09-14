"use client";

import { Reveal } from "@/components/motion/reveal";
import { padIndex } from "@/lib/utils";

const SERVICES = [
  {
    name: "Transparent wash",
    description:
      "Layered cobalt and indigo pours that keep the paper breathing underneath.",
  },
  {
    name: "Wet-on-wet",
    description:
      "Edges that bloom and bleed — landscapes that feel like weather, not maps.",
  },
  {
    name: "Still studies",
    description:
      "Glass, light, and quiet objects held in glaze and reserved white.",
  },
  {
    name: "Commissions",
    description:
      "Site-specific series and private works — pigment, size, and mood by brief.",
  },
];

/** Mediums & practices — editorial index rows with hover accent. */
export function Services() {
  return (
    <section>
      <div className="container-x section-y">
        <Reveal>
          <p className="text-label mb-14">Practice — Mediums</p>
        </Reveal>
        <ul>
          {SERVICES.map((service, i) => (
            <Reveal key={service.name} delay={i * 0.08}>
              <li className="group flex flex-wrap items-baseline gap-x-10 gap-y-2 border-t border-border py-8 transition-colors last:border-b hover:bg-surface/60">
                <span className="text-label w-10">{padIndex(i)}</span>
                <h3 className="font-display text-3xl transition-all duration-300 group-hover:translate-x-2 group-hover:italic group-hover:text-accent md:text-4xl">
                  {service.name}
                </h3>
                <p className="ml-auto max-w-sm text-sm text-muted-foreground">
                  {service.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
