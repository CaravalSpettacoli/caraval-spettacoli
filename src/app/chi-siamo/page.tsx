import { client } from "@/../sanity/lib/client";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import { SezioneStoria } from "@/components/caraval/SezioneStoria";
import type { MembroItem } from "@/components/caraval/MembriGrid";
import { MembriCarosello } from "@/components/caraval/MembriCarosello";
import { PremiSezione } from "@/components/caraval/PremiSezione";
import { ScuolaMagiaBox } from "@/components/caraval/ScuolaMagiaBox";
import { CtaFinale } from "@/components/caraval/CtaFinale";
import type { PremioItem } from "@/components/caraval/StripPremi";

type ChiSiamoCopy = {
  heroEyebrow?: string;
  heroHeading?: string;
  heroSottotitolo?: string;
  heroFotoSfondo?: { asset?: { _ref?: string }; alt?: string };
  storiaEyebrow?: string;
  storiaHeading?: string;
  storiaBody?: string;
  storiaFotoSezione?: { asset?: { _ref?: string }; alt?: string };
  membriEyebrow?: string;
  membriHeading?: string;
  membriIntro?: string;
  premiEyebrow?: string;
  premiHeading?: string;
  scuolaMagiaEyebrow?: string;
  scuolaMagiaHeading?: string;
  scuolaMagiaBody?: string;
  scuolaMagiaUrl?: string;
  scuolaMagiaFoto?: { asset?: { _ref?: string }; alt?: string };
};

export const revalidate = 60;

export const metadata = {
  title: "Chi siamo · Caraval Spettacoli",
  description:
    "Caraval è una compagnia teatrale di Soncino. Sei artisti che fanno prosa, fuoco e strada. Dal 2020.",
};

async function getData() {
  const [copy, membri, premi] = await Promise.all([
    client.fetch<ChiSiamoCopy | null>(
      `*[_type == "paginaChiSiamoCopy"][0]`
    ),
    client.fetch<MembroItem[]>(
      `*[_type == "membro"] | order(ordinamento asc, nome asc){
        _id, nome, ruoli, bioBreve, foto, ordinamento
      }`
    ),
    client.fetch<PremioItem[]>(
      `*[_type == "premio"] | order(anno desc, ordineHomepage asc){
        _id, anno, nomePremio, rassegna, motivazione,
        spettacoloAssociato->{titolo, slug}
      }`
    ),
  ]);
  return { copy: copy ?? {}, membri: membri ?? [], premi: premi ?? [] };
}

export default async function ChiSiamoPage() {
  const { copy, membri, premi } = await getData();

  return (
    <>
      <HeroPagina
        eyebrow={copy.heroEyebrow ?? "CHI SIAMO"}
        heading={copy.heroHeading ?? "Caraval Spettacoli"}
        sottotitolo={
          copy.heroSottotitolo ?? "Compagnia teatrale di Soncino, dal 2016."
        }
        fotoSfondo={copy.heroFotoSfondo}
        palette="default"
        altezza="compatto"
      />

      <SezioneStoria
        eyebrow={copy.storiaEyebrow}
        heading={copy.storiaHeading}
        body={copy.storiaBody}
        foto={copy.storiaFotoSezione}
      />

      <MembriCarosello
        eyebrow={copy.membriEyebrow ?? "LA COMPAGNIA"}
        heading={copy.membriHeading ?? "Le persone di Caraval"}
        intro={copy.membriIntro}
        membri={membri}
      />

      <PremiSezione
        eyebrow={copy.premiEyebrow ?? "RICONOSCIMENTI"}
        heading={copy.premiHeading ?? "I premi che abbiamo ricevuto"}
        premi={premi}
      />

      <ScuolaMagiaBox
        eyebrow={copy.scuolaMagiaEyebrow}
        heading={copy.scuolaMagiaHeading}
        body={copy.scuolaMagiaBody}
        url={copy.scuolaMagiaUrl}
        foto={copy.scuolaMagiaFoto}
      />

      <CtaFinale
        variant="accent"
        heading="Vuoi conoscerci meglio?"
        sottotitolo="Spettacoli, formazione, eventi: parliamoci."
        ctaPrimaria={{ label: "Vedi i nostri spettacoli", href: "/spettacoli" }}
        ctaSecondaria={{ label: "Contattaci", href: "/contatti" }}
      />
    </>
  );
}
