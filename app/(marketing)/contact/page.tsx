import type { Metadata } from "next";
import { siteConfig } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Commissions, atelier visits, and acquisition inquiries for MZAK watercolor works.",
};

export default function ContactPage() {
  return (
    <main className="container-x pt-40 pb-28">
      <Reveal>
        <p className="text-label mb-8">Contact</p>
      </Reveal>
      <SplitTextReveal
        as="h1"
        type="words"
        className="text-display-xl mb-24 max-w-[14ch]"
      >
        Write about a work — or a wall
      </SplitTextReveal>

      <div className="grid gap-20 lg:grid-cols-[1fr_20rem]">
        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>

        <aside className="space-y-12">
          <Reveal delay={0.25}>
            <p className="text-label mb-3">Email</p>
            <a
              href={`mailto:${siteConfig.email}`}
              data-cursor="hover"
              className="link-underline text-lg"
            >
              {siteConfig.email}
            </a>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="text-label mb-3">Atelier</p>
            <p className="text-muted-foreground">{siteConfig.location}</p>
          </Reveal>
          <Reveal delay={0.45}>
            <p className="text-label mb-3">Socials</p>
            <ul className="space-y-2">
              {siteConfig.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="link-underline text-muted-foreground hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>
      </div>
    </main>
  );
}
