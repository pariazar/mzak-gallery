import Image from "next/image";
import type { CaseStudy } from "@/content/case-studies";
import { TransitionLink } from "@/components/layout/page-transition";
import { padIndex } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: CaseStudy;
  index: number;
  className?: string;
  priority?: boolean;
}

/** Artwork mounted like a gallery piece — mat + pigment accent. */
export function ProjectCard({
  project,
  index,
  className,
  priority = false,
}: ProjectCardProps) {
  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      data-cursor="view"
      data-cursor-label="View"
      className={cn("group block", className)}
    >
      <div className="artwork-mount">
        <div className="artwork-mount-inner relative aspect-[4/3]">
          <Image
            src={project.cover}
            alt={`${project.title} — ${project.tagline}`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 opacity-80"
            style={{
              background: `linear-gradient(to top, ${project.accent}55, transparent)`,
            }}
          />
          <span
            className="absolute left-3 top-3 size-2.5 rounded-full shadow-sm"
            style={{ background: project.accent }}
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="text-label">{padIndex(index)}</span>
          <h3 className="font-display text-2xl transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h3>
        </div>
        <span className="text-label shrink-0">{project.year}</span>
      </div>
      <p className="mt-1 pl-10 text-sm text-muted-foreground">
        {project.categories.join(" · ")}
      </p>
    </TransitionLink>
  );
}
