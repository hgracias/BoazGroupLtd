import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/driver/", "/admin/", "/api/"],
    },
    sitemap: "https://boazgroup.co.tz/sitemap.xml",
  };
}
