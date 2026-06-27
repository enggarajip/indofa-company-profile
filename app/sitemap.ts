// ===========================================================================
// app/sitemap.ts
// Sitemap otomatis. Base URL diambil dari COMPANY.url (lib/config/company.ts),
// tidak ada domain yang di-hardcode di sini.
// ===========================================================================

import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/actions/projects";
import { COMPANY } from "@/lib/config/company";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = COMPANY.url;
  const now  = new Date();

  // ── Halaman statis wajib ────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             base,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${base}/about`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${base}/services`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${base}/portfolio`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${base}/contact`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
  ];

  // ── Halaman dinamis: detail setiap proyek dari database ─────────────────────
  const result = await getProjects({ orderBy: "created_at_desc" });
  const projectRoutes: MetadataRoute.Sitemap = result.success
    ? result.data.map((project) => ({
        url:             `${base}/portfolio/${project.slug}`,
        lastModified:    new Date(project.updated_at),
        changeFrequency: "monthly" as const,
        priority:        0.8,
      }))
    : [];

  return [...staticRoutes, ...projectRoutes];
}
