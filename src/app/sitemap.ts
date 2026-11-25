import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((p) => !p.confidential)
      .map((p) => ({
        url: `${base}/work/${p.slug}`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ];
}
