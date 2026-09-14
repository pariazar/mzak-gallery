import { cn } from "@/lib/utils";

/**
 * Static gradient poster — shown instead of a 3D canvas on low-end
 * devices, with reduced motion, or while the canvas chunk loads.
 */
export function StaticPoster({ className }: { className?: string }) {
  return (
    <div
      className={cn("poster-gradient absolute inset-0", className)}
      aria-hidden="true"
    />
  );
}
