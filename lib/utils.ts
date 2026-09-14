import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation — used by cursor / magnetic effects. */
export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

/** Format an index as a padded editorial number: 1 -> "01" */
export function padIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}
