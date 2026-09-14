"use client";

import { ArrowUpRight, ArrowUp } from "lucide-react";
import { siteConfig } from "@/content/site.config";
import { getLenis } from "@/lib/hooks/use-lenis";
import { TransitionLink } from "@/components/layout/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { Magnetic } from "@/components/motion/magnetic";

/** Footer with a big final CTA, socials and back-to-top. */
export function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border">
      <div className="container-x section-y">
        <Reveal>
          <p className="text-label mb-8">A commission, a visit, a dream?</p>
        </Reveal>
        <TransitionLink
          href="/contact"
          data-cursor="view"
          data-cursor-label="Write"
          className="group block"
        >
          <SplitTextReveal
            as="p"
            type="words"
            className="text-display-xl transition-colors duration-500 group-hover:text-accent"
          >
            Let&apos;s paint something soft
          </SplitTextReveal>
          <span className="mt-6 inline-flex items-center gap-2 text-label transition-colors group-hover:text-accent">
            Open a conversation
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </TransitionLink>

        <div className="mt-24 grid gap-10 border-t border-border pt-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-xl italic">{siteConfig.name}</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {siteConfig.tagline}. {siteConfig.location}.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-label mb-4">Sitemap</p>
            <ul className="flex flex-col gap-2 text-sm">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    data-cursor="hover"
                    className="link-underline text-foreground/80 hover:text-foreground"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-label mb-4">Socials</p>
            <ul className="flex flex-col gap-2 text-sm">
              {siteConfig.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="link-underline text-foreground/80 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <Magnetic>
            <button
              type="button"
              onClick={scrollTop}
              data-cursor="hover"
              aria-label="Back to top"
              className="flex size-12 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
            >
              <ArrowUp className="size-4" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
