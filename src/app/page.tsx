import { client } from "@/../sanity/lib/client";
import { Sipario } from "@/components/layout/Sipario";
import { HeroPagina } from "@/components/caraval/HeroPagina";

type HeroHomepageData = {
  heading?: string;
  subheading?: string;
  ctaPrimariaTesto?: string;
  ctaPrimariaLink?: string;
  ctaSecondariaTesto?: string;
  ctaSecondariaLink?: string;
  fotoSfondo?: { asset?: { _ref?: string }; alt?: string };
};
import {
  StripPremi,
  type PremioItem,
} from "@/components/caraval/StripPremi";
import {
  ImaginariumPreview,
  type EdizioneCorrente,
  type SpettacoloImag,
} from "@/components/caraval/ImaginariumPreview";
import {
  SpettacoliAccordionHomepage,
  type SpettacoloHomepage,
} from "@/components/caraval/SpettacoliAccordionHomepage";
import { OfficinaTeaser } from "@/components/caraval/OfficinaTeaser";
import { OspitaTeaser } from "@/components/caraval/OspitaTeaser";
import { ContattiPrelude } from "@/components/caraval/ContattiPrelude";
import { CounterStrip, type CounterItem } from "@/components/caraval/CounterStrip";

type HomepageCopy = {
  premiHeading?: string;
  imaginariumPreviewBody?: string;
  imaginariumPreviewCtaTesto?: string;
  repertorioEyebrow?: string;
  repertorioHeading?: string;
  repertorioIntro?: string;
  repertorioCtaTesto?: string;
  repertorioCtaLink?: string;
  officinaEyebrow?: string;
  officinaHeading?: string;
  officinaBody?: string;
  officinaTagline?: string;
  officinaCtaTesto?: string;
  officinaCtaLink?: string;
  ospitaHeading?: string;
  ospitaBody?: string;
  ospitaCtaTesto?: string;
  ospitaCtaLink?: string;
  contattiHeading?: string;
  contattiBody?: string;
  numeriEyebrow?: string;
  numeriElenco?: CounterItem[];
};

type ImpostazioniContatti = {
  contattiPubblici?: { email?: string; telefono?: string };
};

export const revalidate = 60;

async function getHomepageData() {
  const [
    hero,
    copy,
    premi,
    edizioneCorrente,
    spettacoliCorrente,
    repertorio,
    impostazioni,
  ] = await Promise.all([
    client.fetch<HeroHomepageData | null>(
      `*[_type == "homepageHero"][0]{
        heading, subheading,
        ctaPrimariaTesto, ctaPrimariaLink,
        ctaSecondariaTesto, ctaSecondariaLink,
        fotoSfondo
      }`
    ),
    client.fetch<HomepageCopy | null>(`*[_type == "homepageCopy"][0]`),
    client.fetch<PremioItem[]>(
      `*[_type == "premio" && mostraInHomepage == true] | order(ordineHomepage asc){
        _id, anno, nomePremio, rassegna, motivazione,
        spettacoloAssociato->{titolo, slug}
      }`
    ),
    client.fetch<EdizioneCorrente | null>(
      `*[_type == "edizioneImaginarium" && mostraInHomepage == true] | order(anno desc)[0]{
        anno, titoloEdizione, dataInizio, dataFine,
        locationPrincipale, patrocinio, sponsor, partnerLista
      }`
    ),
    client.fetch<SpettacoloImag[]>(
      `*[_type == "spettacoloImaginarium" && edizioneRif->mostraInHomepage == true] | order(dataInizio asc){
        _id, titolo, dataInizio, linkCompagniaEsterna,
        compagnia { nome, urlSitoCompagnia }
      }`
    ),
    client.fetch<SpettacoloHomepage[]>(
      `*[_type == "spettacolo" && inRepertorio == true && mostraInHomepage == true] | order(ordineHomepage asc){
        _id, titolo, sottotitolo, slug, categoria,
        descrizioneBreve, ordineHomepage
      }`
    ),
    client.fetch<ImpostazioniContatti | null>(
      `*[_id == "impostazioniSito"][0]{
        contattiPubblici { email, telefono }
      }`
    ),
  ]);

  return {
    hero,
    copy,
    premi,
    edizioneCorrente,
    spettacoliCorrente,
    repertorio,
    contatti: impostazioni?.contattiPubblici ?? null,
  };
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <Sipario />
      {data.hero && (
        <HeroPagina
          heading={data.hero.heading ?? "Caraval Spettacoli"}
          sottotitolo={data.hero.subheading}
          ctaPrimaria={
            data.hero.ctaPrimariaTesto && data.hero.ctaPrimariaLink
              ? { label: data.hero.ctaPrimariaTesto, href: data.hero.ctaPrimariaLink }
              : undefined
          }
          ctaSecondaria={
            data.hero.ctaSecondariaTesto && data.hero.ctaSecondariaLink
              ? { label: data.hero.ctaSecondariaTesto, href: data.hero.ctaSecondariaLink }
              : undefined
          }
          fotoSfondo={data.hero.fotoSfondo}
          palette="default"
          altezza="full"
        />
      )}
      <StripPremi premi={data.premi} heading={data.copy?.premiHeading} />
      <CounterStrip
        eyebrow={data.copy?.numeriEyebrow ?? "I NUMERI"}
        numeri={
          data.copy?.numeriElenco && data.copy.numeriElenco.length > 0
            ? data.copy.numeriElenco
            : [
                { valore: "9", etichetta: "spettacoli" },
                { valore: "3", etichetta: "anime" },
                { valore: "6", etichetta: "anni" },
                { valore: "1", etichetta: "festival" },
              ]
        }
        palette="default"
      />
      <ImaginariumPreview
        edizione={data.edizioneCorrente}
        spettacoli={data.spettacoliCorrente}
        body={data.copy?.imaginariumPreviewBody}
        ctaTesto={data.copy?.imaginariumPreviewCtaTesto}
      />
      <SpettacoliAccordionHomepage
        spettacoli={data.repertorio}
        eyebrow={data.copy?.repertorioEyebrow}
        heading={data.copy?.repertorioHeading}
        intro={data.copy?.repertorioIntro}
        ctaTesto={data.copy?.repertorioCtaTesto}
        ctaLink={data.copy?.repertorioCtaLink}
      />
      <OfficinaTeaser copy={data.copy} />
      <OspitaTeaser copy={data.copy} />
      <ContattiPrelude copy={data.copy} contatti={data.contatti} />
    </>
  );
}
