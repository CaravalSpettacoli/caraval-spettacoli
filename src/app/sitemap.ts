import type { MetadataRoute } from "next";
import { client } from "@/../sanity/lib/client";

const BASE_URL = "https://caraval.it";

type SpettacoloSlug = { slug?: { current?: string }; _updatedAt?: string };
type EdizioneSlug = { anno?: number; _updatedAt?: string };

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let spettacoli: SpettacoloSlug[] = [];
  let edizioni: EdizioneSlug[] = [];

  try {
    const data = await client.fetch<{
      spettacoli: SpettacoloSlug[];
      edizioni: EdizioneSlug[];
    }>(`{
      "spettacoli": *[_type == "spettacolo" && defined(slug.current)]{ slug, _updatedAt },
      "edizioni": *[_type == "edizioneImaginarium" && defined(anno)]{ anno, _updatedAt }
    }`);
    spettacoli = data.spettacoli ?? [];
    edizioni = data.edizioni ?? [];
  } catch {
    /* fail-open: sitemap statica funziona comunque */
  }

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/spettacoli`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/imaginarium`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/formazione`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/chi-siamo`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contatti`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/ospita`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const spettacoliRoutes: MetadataRoute.Sitemap = spettacoli
    .filter((s) => s.slug?.current)
    .map((s) => ({
      url: `${BASE_URL}/spettacoli/${s.slug!.current}`,
      lastModified: s._updatedAt ? new Date(s._updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const imaginariumRoutes: MetadataRoute.Sitemap = edizioni
    .filter((e) => e.anno)
    .map((e) => ({
      url: `${BASE_URL}/imaginarium/${e.anno}`,
      lastModified: e._updatedAt ? new Date(e._updatedAt) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...spettacoliRoutes, ...imaginariumRoutes];
}
