import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SpettacoliGrid } from "@/components/caraval/SpettacoliGrid";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import {
  ArchivioSpettacoliGrid,
  type ArchivioItem,
} from "@/components/caraval/ArchivioSpettacoliGrid";
import type { SpettacoloCardLargeData } from "@/components/caraval/SpettacoloCardLarge";
import { CtaFinale } from "@/components/caraval/CtaFinale";
import { GlifoDecorativo } from "@/components/decorative/GlifoDecorativo";
import { OndaDecorativa } from "@/components/decorative/OndaDecorativa";

type PaginaCopy = {
  heroFotoSfondo?: { asset?: { _ref?: string }; alt?: string } | null;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  archivioEyebrow?: string;
  archivioHeading?: string;
  archivioIntro?: string;
};

export const revalidate = 60;

async function getData() {
  const [spettacoli, archivio, copy] = await Promise.all([
    client.fetch<SpettacoloCardLargeData[]>(
      `*[_type == "spettacolo" && inRepertorio == true] | order(ordineHomepage asc, titolo asc){
        _id, titolo, sottotitolo, slug, categoria, descrizioneBreve, immagineCover,
        "premiAssociati": premiAssociati[]->{ _id, anno, nomePremio }
      }`
    ),
    client.fetch<ArchivioItem[]>(
      `*[_type == "spettacolo" && inRepertorio == false] | order(annoCreazione desc, titolo asc){
        _id, titolo, annoCreazione, regia, immagineCover,
        "premiAssociati": premiAssociati[]->{ _id, anno, nomePremio }
      }`
    ),
    client.fetch<PaginaCopy | null>(
      `*[_type == "paginaSpettacoliCopy"][0]{
        eyebrow, heading, intro,
        archivioEyebrow, archivioHeading, archivioIntro,
        heroFotoSfondo{ asset, alt }
      }`
    ),
  ]);
  return { spettacoli, archivio, copy };
}

export const metadata = {
  title: "Spettacoli",
  description:
    "Il repertorio attivo di Caraval Spettacoli: prosa, teatro di fuoco, teatro di strada.",
};

export default async function PaginaSpettacoli() {
  const { spettacoli, archivio, copy } = await getData();

  return (
    <>
      <HeroPagina
        eyebrow={copy?.eyebrow ?? "IL REPERTORIO"}
        heading={copy?.heading ?? "Produzioni in repertorio"}
        sottotitolo={copy?.intro}
        palette="default"
        altezza="compatto"
        fotoSfondo={copy?.heroFotoSfondo ?? undefined}
      />

      <div className="flex justify-center bg-nero-deep pt-6 pb-2">
        <OndaDecorativa width={220} variant="sottile" className="text-rosso-base/60" />
      </div>

      <Section theme="dark" bgVariant="soft" glow="top-right">
        <Container>
          <SpettacoliGrid spettacoli={spettacoli} />
        </Container>
      </Section>

      {archivio.length > 0 && (
        <Section theme="dark" bgVariant="base" id="archivio">
          <Container>
            <div className="mb-12 max-w-2xl">
              <GlifoDecorativo tipo="sparkles" size={26} align="left" />
              <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
                {copy?.archivioEyebrow ?? "ARCHIVIO"}
              </p>
              <h2 className="font-display text-h1 text-crema-base leading-tight text-balance">
                {copy?.archivioHeading ?? "Produzioni passate"}
              </h2>
              <p className="mt-4 text-body-l text-crema-muted">
                {copy?.archivioIntro ??
                  "Spettacoli che hanno fatto parte del nostro percorso negli anni."}
              </p>
            </div>
            <ArchivioSpettacoliGrid archivio={archivio} />
          </Container>
        </Section>
      )}

      <div className="flex justify-center bg-nero-base pt-2 pb-8">
        <OndaDecorativa width={220} variant="sottile" className="text-rosso-base/60" />
      </div>

      <CtaFinale
        variant="accent"
        heading="Ti interessa uno dei nostri spettacoli?"
        sottotitolo="Contattaci per parlarne."
        ctaPrimaria={{ label: "Contattaci", href: "/contatti" }}
      />
    </>
  );
}
