import { client } from "@/../sanity/lib/client";
import {
  HeroImaginarium,
  type EdizioneHero,
} from "@/components/imaginarium/HeroImaginarium";
import {
  ProgrammaCompleto,
  type SpettacoloImagItem,
} from "@/components/imaginarium/ProgrammaCompleto";
import {
  SponsorPartnerStrip,
  type SponsorPartnerData,
} from "@/components/imaginarium/SponsorPartnerStrip";
import {
  EdizioniPassate,
  type EdizionePassataItem,
} from "@/components/imaginarium/EdizioniPassate";

export const revalidate = 60;

type EdizioneCorrenteFull = EdizioneHero & SponsorPartnerData & { anno?: number };

async function getImaginariumData() {
  const edizioneCorrente = await client.fetch<EdizioneCorrenteFull | null>(
    `*[_type == "edizioneImaginarium"] | order(anno desc)[0]{
      anno, titoloEdizione, dataInizio, dataFine,
      locationPrincipale, descrizione, descrizioneBreve,
      patrocinio, sponsor, partnerLista
    }`
  );

  const annoCorrente = edizioneCorrente?.anno ?? null;

  const [spettacoliCorrente, edizioniPassate] = await Promise.all([
    annoCorrente
      ? client.fetch<SpettacoloImagItem[]>(
          `*[_type == "spettacoloImaginarium" && edizioneRif->anno == $anno] | order(dataInizio asc){
            _id, titolo, dataInizio, linkCompagniaEsterna,
            compagnia { nome, urlSitoCompagnia },
            immagineCover
          }`,
          { anno: annoCorrente }
        )
      : Promise.resolve([] as SpettacoloImagItem[]),
    annoCorrente
      ? client.fetch<EdizionePassataItem[]>(
          `*[_type == "edizioneImaginarium" && anno < $anno] | order(anno desc){
            _id, anno, titoloEdizione, descrizioneBreve
          }`,
          { anno: annoCorrente }
        )
      : Promise.resolve([] as EdizionePassataItem[]),
  ]);

  return { edizioneCorrente, spettacoliCorrente, edizioniPassate };
}

export const metadata = {
  title: "Imaginarium",
  description:
    "Festival di Teatro Itinerante a Soncino. Sei serate, ingresso gratuito.",
};

export default async function ImaginariumPage() {
  const { edizioneCorrente, spettacoliCorrente, edizioniPassate } =
    await getImaginariumData();

  return (
    <div className="theme-imaginarium">
      <HeroImaginarium edizione={edizioneCorrente} />
      <ProgrammaCompleto
        spettacoli={spettacoliCorrente}
        heading="Programma"
      />
      <SponsorPartnerStrip data={edizioneCorrente} />
      <EdizioniPassate edizioni={edizioniPassate} />
    </div>
  );
}
