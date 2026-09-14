import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath ? `${basePath}/` : undefined,
        trailingSlash: true,
      }
    : {}),
  poweredByHeader: false,
  images: {
    unoptimized: isGithubPages,
    // Demo covers are local, self-generated SVGs (scripts/generate-covers.mjs).
    // Safe to allow; remove if client projects use raster imagery only.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    // Tree-shake barrel imports so lucide / framer / drei don't inflate the
    // initial client bundle.
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@react-three/drei",
      "gsap",
    ],
  },
};

export default nextConfig;
