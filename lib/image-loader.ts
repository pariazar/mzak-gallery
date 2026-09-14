/**
 * Prefix static assets with the GitHub Pages base path.
 * Used by next/image (loaderFile) so /covers/... resolves under /mzak-gallery/.
 */
export default function imageLoader({ src }: { src: string }) {
  if (/^https?:\/\//.test(src) || src.startsWith("data:")) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src.startsWith("/") ? src : `/${src}`}`;
}
