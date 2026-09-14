"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { caseStudies, allCategories } from "@/content/case-studies";
import { ProjectCard } from "@/components/sections/project-card";
import { cn } from "@/lib/utils";

/** Filterable project grid with layout animations. */
export function WorkGrid() {
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All"
      ? caseStudies
      : caseStudies.filter((c) => c.categories.includes(category));

  return (
    <div>
      <div
        className="mb-16 flex flex-wrap gap-3"
        role="group"
        aria-label="Filter works by category"
      >
        {allCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            data-cursor="hover"
            className={cn(
              "rounded-full border px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
              category === c
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-x-10 gap-y-20 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={project} index={i} priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-16 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} project{filtered.length === 1 ? "" : "s"}
        {category !== "All" && ` in ${category}`}
      </p>
    </div>
  );
}
