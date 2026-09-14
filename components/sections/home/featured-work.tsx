import { caseStudies } from "@/content/case-studies";
import { Reveal } from "@/components/motion/reveal";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { ProjectCard } from "@/components/sections/project-card";
import { TransitionLink } from "@/components/layout/page-transition";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Selected works — staggered gallery grid. */
export function FeaturedWork() {
  const featured = caseStudies.slice(0, 4);

  return (
    <section className="section-wash container-x section-y">
      <div className="mb-16 flex items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="text-label mb-6">Collection — On the wall</p>
          </Reveal>
          <SplitTextReveal as="h2" type="words" className="text-display">
            Paintings that hold still
          </SplitTextReveal>
        </div>
        <Reveal delay={0.2} className="hidden md:block">
          <TransitionLink
            href="/work"
            data-cursor="hover"
            className="link-underline inline-flex items-center gap-2 text-label text-foreground"
          >
            Full gallery <ArrowUpRight className="size-3.5" />
          </TransitionLink>
        </Reveal>
      </div>

      <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
        {featured.map((project, i) => (
          <Reveal
            key={project.slug}
            delay={(i % 2) * 0.15}
            className={cn(i % 2 === 1 && "md:mt-24")}
          >
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 md:hidden">
        <TransitionLink
          href="/work"
          data-cursor="hover"
          className="link-underline inline-flex items-center gap-2 text-label text-foreground"
        >
          Full gallery <ArrowUpRight className="size-3.5" />
        </TransitionLink>
      </Reveal>
    </section>
  );
}
