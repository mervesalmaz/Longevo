import type { MetadataRoute } from "next";
import { treatments } from "@/data/treatments";
import { cities } from "@/data/cities";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const BASE = "https://longevo.life";

/**
 * Dynamic sitemap.xml — merges static routes with DB-backed dynamic routes
 * (verified clinics, published articles). Rebuilt on each request (no cache)
 * because the underlying data changes frequently during beta.
 */
export const revalidate = 3600; // 1 hour is plenty for a sitemap

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static routes ─────────────────────────────────────────────────
  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "daily";
  }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/beta", priority: 0.9, changeFrequency: "weekly" },
    { path: "/search", priority: 0.9, changeFrequency: "daily" },
    { path: "/klinik-kaydi", priority: 0.8, changeFrequency: "monthly" },
    { path: "/klinik-kaydi/sss", priority: 0.5, changeFrequency: "monthly" },
    { path: "/tr/tedaviler", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tr/sehirler", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tr/rehber", priority: 0.9, changeFrequency: "weekly" },
    { path: "/hakkimizda", priority: 0.5, changeFrequency: "monthly" },
    { path: "/iletisim", priority: 0.5, changeFrequency: "monthly" },
    { path: "/yasal/kvkk", priority: 0.3, changeFrequency: "monthly" },
    { path: "/yasal/gizlilik", priority: 0.3, changeFrequency: "monthly" },
    { path: "/yasal/kullanim-kosullari", priority: 0.3, changeFrequency: "monthly" },
    { path: "/yasal/cerez", priority: 0.3, changeFrequency: "monthly" },
  ];

  const staticUrls = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // ── Static detail routes ──────────────────────────────────────────
  const treatmentUrls = treatments.map((t) => ({
    url: `${BASE}/tr/tedaviler/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityUrls = cities.map((c) => ({
    url: `${BASE}/tr/sehirler/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ── DB-backed dynamic routes ──────────────────────────────────────
  const supabase = createServerSupabaseClient();

  const [{ data: clinics }, { data: articles }] = await Promise.all([
    supabase
      .from("clinics")
      .select("slug, created_at")
      .eq("verified", true),
    supabase
      .from("articles")
      .select("slug, published_at")
      .eq("published", true),
  ]);

  const clinicUrls = (clinics ?? []).map((c) => ({
    url: `${BASE}/clinics/${c.slug}`,
    lastModified: c.created_at ? new Date(c.created_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleUrls = (articles ?? []).map((a) => ({
    url: `${BASE}/tr/rehber/${a.slug}`,
    lastModified: a.published_at ? new Date(a.published_at) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticUrls,
    ...treatmentUrls,
    ...cityUrls,
    ...clinicUrls,
    ...articleUrls,
  ];
}
