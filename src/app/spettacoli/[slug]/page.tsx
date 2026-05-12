import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "@/../sanity/lib/client";
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
  prenotazione?: {
    modalita?:
      | "linkEsterno"
      | "emailTelefono"
      | "ingressoLibero"
      | "botteghino"
      | "richiestaContatto";
    urlBiglietti?: string;
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
  const data = await client.fetch<{
    titolo?: string;
    descrizioneBreve?: string;
  } | null>(
    `*[_type == "spettacolo" && slug.current == $slug][0]{ titolo, descrizioneBreve }`,
    { slug: params.slug }
  );
  return {
    title: data?.titolo,
    description: data?.descrizioneBreve,
  };
}

async function getData(slug: string) {
  const [spettacolo, impostazioni] = await Promise.all([
    client.fetch<SpettacoloPage | null>(
      `*[_type == "spettacolo" && slug.current == $slug][0]{
        _id, titolo, sottotitolo, slug, categoria, annoCreazione, regia,
        descrizioneNarrativa, gallery, trailerYoutube,
        schedaTecnica, cast, citazioniStampa, immagineCover, fotoHero,
        prenotazione,
        "premiAssociati": premiAssociati[]->{ _id, anno, nomePremio },
        "referenteContatto": referenteContatto->{
          nome, ruoli, referenteAreaTesto, telefonoPubblico, emailPubblica
        },
        "correlati": *[_type == "spettacolo" && categoria == ^.categoria && _id != ^._id && inRepertorio == true][0..2]{
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
