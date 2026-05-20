import type { Metadata } from "next";
import { client } from "@/../sanity/lib/client";
import { urlFor } from "@/../sanity/lib/image";

type ImageRef = { asset?: { _ref?: string }; alt?: string } | null | undefined;

type PageSeo = {
  seoTitle?: string;
  seoDescription?: string;
  seoOgImage?: ImageRef;
  seoKeywords?: string[];
};

type GlobalSeo = {
  seoDefault?: {
    defaultTitle?: string;
    defaultDescription?: string;
    defaultOgImage?: ImageRef;
    keywords?: string[];
    canonicalBaseUrl?: string;
  };
};

type Args = {
  /** ID Sanity del singleton di pagina (es. "paginaSpettacoliCopy"). Se null,
   *  usa solo i default globali (es. /formazione che non ha singleton). */
  singletonId: string | null;
  /** Path della pagina (es. "/spettacoli"). Usato per canonical URL. */
  slug: string;
  /** Fallback title se nessun override e nessun default globale. */
  defaultTitle?: string;
  /** Fallback description. */
  defaultDescription?: string;
  /** Tipo OpenGraph. Default "website". */
  ogType?: "website" | "article";
};

function ogImageUrl(img: ImageRef): string | undefined {
  if (!img?.asset?._ref) return undefined;
  return urlFor(img as Parameters<typeof urlFor>[0])
    .width(1200)
    .height(630)
    .fit("crop")
    .quality(85)
    .url();
}

/** Risolve i metadata della pagina applicando il chain di override:
 *  pagina (seoTitle/Description/OgImage/Keywords) → defaults locali → globali
 *  (seoDefault.defaultTitle/...) → fallback hardcoded.
 *
 *  Usato dai `generateMetadata` di tutte le pagine principali per evitare
 *  copia-incolla. Fail-open: in caso di errore Sanity restituisce metadata
 *  minimi basati sui defaults locali, non blocca il build. */
export async function generatePageMetadata({
  singletonId,
  slug,
  defaultTitle,
  defaultDescription,
  ogType = "website",
}: Args): Promise<Metadata> {
  let pagina: PageSeo | null = null;
  let globali: GlobalSeo | null = null;

  try {
    const data = await client.fetch<{
      pagina: PageSeo | null;
      globali: GlobalSeo | null;
    }>(
      singletonId
        ? `{
            "pagina": *[_id == $singletonId][0]{ seoTitle, seoDescription, seoOgImage, seoKeywords },
            "globali": *[_id == "impostazioniSito"][0]{ seoDefault }
          }`
        : `{
            "pagina": null,
            "globali": *[_id == "impostazioniSito"][0]{ seoDefault }
          }`,
      singletonId ? { singletonId } : {}
    );
    pagina = data.pagina;
    globali = data.globali;
  } catch {
    /* fail-open */
  }

  const seoG = globali?.seoDefault ?? {};
  const title =
    pagina?.seoTitle ||
    defaultTitle ||
    seoG.defaultTitle ||
    "Caraval Spettacoli";
  const description =
    pagina?.seoDescription ||
    defaultDescription ||
    seoG.defaultDescription ||
    "Compagnia teatrale di Soncino (Cremona). Prosa, fuoco, strada. Festival Imaginarium.";

  const ogImage = ogImageUrl(pagina?.seoOgImage) ?? ogImageUrl(seoG.defaultOgImage);

  const keywords = [
    ...(pagina?.seoKeywords ?? []),
    ...(seoG.keywords ?? []),
  ];

  const baseUrl = seoG.canonicalBaseUrl || "https://caraval.it";
  const canonical = `${baseUrl}${slug}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: ogType,
      locale: "it_IT",
      siteName: "Caraval Spettacoli",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
