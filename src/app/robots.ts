import type { MetadataRoute } from "next";
import { client } from "@/../sanity/lib/client";

const BASE_URL = "https://caraval.it";

export const revalidate = 300;

export default async function robots(): Promise<MetadataRoute.Robots> {
  let comingSoonAttivo = false;
  try {
    const data = await client.fetch<{ attivo?: boolean } | null>(
      `*[_id == "impostazioniSito"][0]{ "attivo": comingSoon.attivo }`
    );
    comingSoonAttivo = data?.attivo === true;
  } catch {
    /* fail-open: se Sanity fallisce, lascia comportamento di default (sito live) */
  }

  // Coming-soon attivo: blocca tutti i crawler. Niente sitemap esposta.
  if (comingSoonAttivo) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api", "/coming-soon"],
      },
      // AI crawler espliciti: vogliamo essere indicizzati
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
