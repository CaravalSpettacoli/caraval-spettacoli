import { client } from "@/../sanity/lib/client";
import { Sipario } from "@/components/layout/Sipario";
import { HeroHomepage, type HeroHomepageData } from "@/components/caraval/HeroHomepage";
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
  RepertorioPreview,
  type SpettacoloRepertorio,
} from "@/components/caraval/RepertorioPreview";
import { OfficinaTeaser } from "@/components/caraval/OfficinaTeaser";
import { OspitaTeaser } from "@/components/caraval/OspitaTeaser";
import { ContattiPrelude } from "@/components/caraval/ContattiPrelude";

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
    client.fetch<SpettacoloRepertorio[]>(
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
      <div className="preloader-zoom-target">
        <HeroHomepage data={data.hero} />
        <StripPremi premi={data.premi} heading={data.copy?.premiHeading} />
        <ImaginariumPreview
          edizione={data.edizioneCorrente}
          spettacoli={data.spettacoliCorrente}
          body={data.copy?.imaginariumPreviewBody}
          ctaTesto={data.copy?.imaginariumPreviewCtaTesto}
        />
        <RepertorioPreview spettacoli={data.repertorio} copy={data.copy} />
        <OfficinaTeaser copy={data.copy} />
        <OspitaTeaser copy={data.copy} />
        <ContattiPrelude copy={data.copy} contatti={data.contatti} />
      </div>
    </>
  );
}
