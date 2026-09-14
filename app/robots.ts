import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // internal reference page — keep it out of search results
      disallow: "/design-system",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
