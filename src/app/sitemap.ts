import type { MetadataRoute } from "next";

const BASE_URL = "https://boazigroup.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Public pages only — /driver and /admin are noindex.
  return [
    { url: BASE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/routes`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/quote`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE_URL}/tracking`, lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
