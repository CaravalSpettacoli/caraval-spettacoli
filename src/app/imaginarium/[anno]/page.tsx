import { notFound } from "next/navigation";
import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { HeroPagina } from "@/components/caraval/HeroPagina";

type EdizioneHero = {
  anno?: number;
  titoloEdizione?: string;
  dataInizio?: string;
  dataFine?: string;
  locationPrincipale?: string;
  descrizione?: Array<{ children?: Array<{ text?: string }> }>;
  descrizioneBreve?: string;
};
import {
  ProgrammaCompleto,
  type SpettacoloImagItem,
} from "@/components/imaginarium/ProgrammaCompleto";
import {
  SponsorPartnerStrip,
  type SponsorPartnerData,
} from "@/components/imaginarium/SponsorPartnerStrip";

export const revalidate = 60;

type EdizioneFull = EdizioneHero & SponsorPartnerData & { anno?: number };

async function getEdizione(anno: string): Promise<{
  edizione: EdizioneFull | null;
  spettacoli: SpettacoloImagItem[];
}> {
  const annoNum = parseInt(anno, 10);
  if (Number.isNaN(annoNum)) return { edizione: null, spettacoli: [] };

  const edizione = await client.fetch<EdizioneFull | null>(
    `*[_type == "edizioneImaginarium" && anno == $anno][0]{
      anno, titoloEdizione, dataInizio, dataFine,
      locationPrincipale, descrizione, descrizioneBreve,
      patrocinio, sponsor, partnerLista
    }`,
    { anno: annoNum }
  );

  if (!edizione) return { edizione: null, spettacoli: [] };

  const spettacoli = await client.fetch<SpettacoloImagItem[]>(
    `*[_type == "spettacoloImaginarium" && edizioneRif->anno == $anno] | order(dataInizio asc){
      _id, titolo, dataInizio, linkCompagniaEsterna,
      compagnia { nome, urlSitoCompagnia, descrizioneCompagniaBreve },
      descrizione, cast, locationSpecifica,
      "luogo": { "nome": luogo.nomeStruttura, "citta": luogo.citta },
      immagineCover
    }`,
    { anno: annoNum }
  );

  return { edizione, spettacoli };
}

export default async function EdizionePassataPage({
  params,
}: {
  params: { anno: string };
}) {
  const { edizione, spettacoli } = await getEdizione(params.anno);
  if (!edizione) notFound();

  const haProgramma = spettacoli.length > 0;

  const descrizione = (edizione.descrizione ?? [])
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n\n") || edizione.descrizioneBreve;

  return (
    <div className="theme-imaginarium">
      <HeroPagina
        eyebrow={`Edizione ${edizione.anno}`}
        heading={`Imaginarium ${edizione.anno}`}
        sottotitolo={
          [edizione.locationPrincipale, descrizione]
            .filter(Boolean)
            .join("\n\n") || undefined
        }
        palette="imaginarium"
        altezza="compatto"
      />

      {haProgramma ? (
        <>
          <ProgrammaCompleto spettacoli={spettacoli} heading="Programma" />
          <SponsorPartnerStrip data={edizione} />
        </>
      ) : (
        <section className="py-16 md:py-24 bg-crema-base text-nero-base">
          <Container>
            <div className="max-w-[640px] mx-auto text-center">
              <p className="font-display text-h2 text-rosso-deep">
                Programma in caricamento
              </p>
              <p className="mt-4 text-body-l text-nero-base/80">
                Stiamo riportando online la documentazione di questa edizione.
                Torna a breve.
              </p>
              <a
                href="/imaginarium"
                className="mt-8 inline-flex items-center text-body text-rosso-deep underline underline-offset-4 hover:text-rosso-base"
              >
                ← Torna a Imaginarium
              </a>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { anno: string };
}) {
  return {
    title: `Imaginarium ${params.anno}`,
  };
}
