import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "@/../sanity/lib/client";
import { urlFor } from "@/../sanity/lib/image";
import {
  HeroSpettacolo,
  type HeroSpettacoloData,
} from "@/components/caraval/HeroSpettacolo";
import { DescrizioneNarrativa } from "@/components/caraval/DescrizioneNarrativa";
import {
  GalleriaFoto,
  type GalleriaItem,
} from "@/components/caraval/GalleriaFoto";
import { TrailerVideo } from "@/components/caraval/TrailerVideo";
import {
  SchedaTecnica,
  type SchedaTecnicaData,
} from "@/components/caraval/SchedaTecnica";
import {
  CastECrediti,
  type CastItem,
} from "@/components/caraval/CastECrediti";
import {
  CitazioniStampaList,
  type CitazioneItem,
} from "@/components/caraval/CitazioniStampaList";
import {
  SezionePrenotazione,
  type ReferenteContatto,
} from "@/components/caraval/SezionePrenotazione";
import { SpettacoliCorrelati } from "@/components/caraval/SpettacoliCorrelati";
import type { SpettacoloCardLargeData } from "@/components/caraval/SpettacoloCardLarge";
import { CtaFinale } from "@/components/caraval/CtaFinale";

export const revalidate = 60;

type SpettacoloPage = HeroSpettacoloData & {
  _id: string;
  slug?: { current?: string };
  descrizioneNarrativa?: PortableTextBlock[];
  gallery?: GalleriaItem[];
  trailerYoutube?: string;
  schedaTecnica?: SchedaTecnicaData;
  cast?: CastItem[];
  regia?: string;
  citazioniStampa?: CitazioneItem[];
  annoProduzione?: number;
  durataMinuti?: number;
  postiLimitati?: boolean;
  prenotazione?: {
    modalita?:
      | "linkEsterno"
      | "emailTelefono"
      | "ingressoLibero"
      | "botteghino"
      | "richiestaContatto";
    urlBiglietti?: string;
    qrCode?: { asset?: { _ref?: string }; alt?: string };
    etichettaCustom?: string;
    noteAggiuntive?: string;
  };
  referenteContatto?: ReferenteContatto;
  correlati?: SpettacoloCardLargeData[];
};

type ImpostazioniContatti = {
  contattiPubblici?: { email?: string; telefono?: string };
};

export async function generateStaticParams() {
  const items = await client.fetch<{ slug: string }[]>(
    `*[_type == "spettacolo" && inRepertorio == true && defined(slug.current)]{ "slug": slug.current }`
  );
  return items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  // Chain di override SEO: spettacolo.seoTitle/.. → descrizioneBreve →
  // global defaults. OG image: spettacolo.seoOgImage → fotoHero → immagineCover
  // → globale.
  type SpettacoloSeo = {
    titolo?: string;
    categoria?: "prosa" | "fuoco" | "strada";
    descrizioneBreve?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoOgImage?: { asset?: { _ref?: string } } | null;
    seoKeywords?: string[];
    fotoHero?: { asset?: { _ref?: string } } | null;
    immagineCover?: { asset?: { _ref?: string } } | null;
  };
  type GlobalSeo = {
    seoDefault?: {
      defaultTitle?: string;
      defaultDescription?: string;
      defaultOgImage?: { asset?: { _ref?: string } } | null;
      keywords?: string[];
      canonicalBaseUrl?: string;
    };
  };

  let sp: SpettacoloSeo | null = null;
  let gl: GlobalSeo | null = null;
  try {
    const data = await client.fetch<{
      spettacolo: SpettacoloSeo | null;
      globali: GlobalSeo | null;
    }>(
      `{
        "spettacolo": *[_type == "spettacolo" && slug.current == $slug][0]{
          titolo, categoria, descrizioneBreve,
          seoTitle, seoDescription, seoOgImage, seoKeywords,
          fotoHero, immagineCover
        },
        "globali": *[_id == "impostazioniSito"][0]{ seoDefault }
      }`,
      { slug: params.slug }
    );
    sp = data.spettacolo;
    gl = data.globali;
  } catch {
    /* fail-open */
  }

  const titolo = sp?.titolo ?? "Spettacolo";
  const catLabel =
    sp?.categoria === "fuoco"
      ? "teatro di fuoco"
      : sp?.categoria === "prosa"
        ? "prosa"
        : sp?.categoria === "strada"
          ? "teatro di strada"
          : null;

  const title =
    sp?.seoTitle ||
    (catLabel
      ? `${titolo} — Spettacolo ${catLabel} | Caraval Spettacoli`
      : `${titolo} | Caraval Spettacoli`);
  const description =
    sp?.seoDescription ||
    sp?.descrizioneBreve ||
    gl?.seoDefault?.defaultDescription ||
    `${titolo} — produzione Caraval Spettacoli, compagnia teatrale di Soncino (Cremona).`;

  const ogImageSource =
    sp?.seoOgImage?.asset?._ref
      ? sp.seoOgImage
      : sp?.fotoHero?.asset?._ref
        ? sp.fotoHero
        : sp?.immagineCover?.asset?._ref
          ? sp.immagineCover
          : gl?.seoDefault?.defaultOgImage;

  const ogImage =
    ogImageSource?.asset?._ref
      ? urlFor(ogImageSource as Parameters<typeof urlFor>[0])
          .width(1200)
          .height(630)
          .fit("crop")
          .quality(85)
          .url()
      : undefined;

  const keywords = [
    ...(sp?.seoKeywords ?? []),
    ...(gl?.seoDefault?.keywords ?? []),
  ];

  const baseUrl = gl?.seoDefault?.canonicalBaseUrl || "https://caraval.it";
  const url = `${baseUrl}/spettacoli/${params.slug}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "it_IT",
      siteName: "Caraval Spettacoli",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: titolo }]
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

async function getData(slug: string) {
  const [spettacolo, impostazioni] = await Promise.all([
    client.fetch<SpettacoloPage | null>(
      `*[_type == "spettacolo" && slug.current == $slug][0]{
        _id, titolo, sottotitolo, slug, categoria, annoCreazione, regia,
        annoProduzione, durataMinuti, postiLimitati,
        descrizioneNarrativa, gallery, trailerYoutube,
        schedaTecnica, cast, citazioniStampa, immagineCover, fotoHero,
        prenotazione,
        "premiAssociati": premiAssociati[]->{ _id, anno, nomePremio },
        "referenteContatto": referenteContatto->{
          nome, ruoli, referenteAreaTesto, telefonoPubblico, emailPubblica
        },
        "correlati": *[
          _type == "spettacolo"
          && slug.current != $slug
          && categoria == ^.categoria
          && inRepertorio == true
        ] | order(ordineHomepage asc, titolo asc) [0..2] {
          _id, titolo, sottotitolo, slug, categoria, descrizioneBreve, immagineCover,
          "premiAssociati": premiAssociati[]->{ _id, anno, nomePremio }
        }
      }`,
      { slug }
    ),
    client.fetch<ImpostazioniContatti | null>(
      `*[_id == "impostazioniSito"][0]{ contattiPubblici { email, telefono } }`
    ),
  ]);
  return { spettacolo, fallbackContatti: impostazioni?.contattiPubblici ?? null };
}

export default async function SchedaSpettacolo({
  params,
}: {
  params: { slug: string };
}) {
  const { spettacolo, fallbackContatti } = await getData(params.slug);
  if (!spettacolo) notFound();

  return (
    <>
      <HeroSpettacolo data={spettacolo} />
      <DescrizioneNarrativa blocks={spettacolo.descrizioneNarrativa} />
      <GalleriaFoto immagini={spettacolo.gallery ?? null} />
      <TrailerVideo url={spettacolo.trailerYoutube} />
      <SchedaTecnica scheda={spettacolo.schedaTecnica ?? null} />
      <CastECrediti
        cast={spettacolo.cast ?? null}
        regia={spettacolo.regia ?? null}
      />
      <CitazioniStampaList citazioni={spettacolo.citazioniStampa ?? null} />
      <SezionePrenotazione
        spettacolo={spettacolo}
        referente={spettacolo.referenteContatto ?? null}
        fallbackContatti={fallbackContatti}
      />
      <SpettacoliCorrelati correlati={spettacolo.correlati ?? null} />
      <CtaFinale
        variant="accent"
        heading="Vuoi portare questo spettacolo da te?"
        sottotitolo="Caraval può venire ovunque."
        ctaPrimaria={{
          label: "Scrivici",
          href: `mailto:${
            fallbackContatti?.email ?? "caravalspettacoli@gmail.com"
          }?subject=${encodeURIComponent(
            `Ingaggio ${spettacolo.titolo ?? "spettacolo"}`
          )}`,
        }}
        ctaSecondaria={{ label: "Vedi altri spettacoli", href: "/spettacoli" }}
      />
    </>
  );
}
