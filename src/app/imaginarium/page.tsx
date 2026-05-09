import { client } from "@/../sanity/lib/client";
import { HeroPagina } from "@/components/caraval/HeroPagina";

type EdizioneHero = {
  anno?: number;
  titoloEdizione?: string;
  dataInizio?: string;
  dataFine?: string;
  locationPrincipale?: string;
  descrizione?: Array<{ children?: Array<{ text?: string }> }>;
  descrizioneBreve?: string;
  fotoSfondoHero?: { asset?: { _ref?: string }; alt?: string };
};
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
import { CounterStrip, type CounterItem } from "@/components/caraval/CounterStrip";

export const revalidate = 60;

type EdizioneCorrenteFull = EdizioneHero & SponsorPartnerData & { anno?: number };

type PaginaImagCopy = {
  counterEyebrow?: string;
  counterElenco?: CounterItem[];
};

async function getImaginariumData() {
  const [edizioneCorrente, paginaCopy] = await Promise.all([
    client.fetch<EdizioneCorrenteFull | null>(
      `*[_type == "edizioneImaginarium"] | order(anno desc)[0]{
        anno, titoloEdizione, dataInizio, dataFine,
        locationPrincipale, descrizione, descrizioneBreve,
        fotoSfondoHero,
        patrocinio, sponsor, partnerLista
      }`
    ),
    client.fetch<PaginaImagCopy | null>(
      `*[_type == "paginaImaginariumCopy"][0]{ counterEyebrow, counterElenco }`
    ),
  ]);

  const annoCorrente = edizioneCorrente?.anno ?? null;

  const [spettacoliCorrente, edizioniPassate] = await Promise.all([
    annoCorrente
      ? client.fetch<SpettacoloImagItem[]>(
          `*[_type == "spettacoloImaginarium" && edizioneRif->anno == $anno] | order(dataInizio asc){
            _id, titolo, dataInizio, linkCompagniaEsterna,
            compagnia { nome, urlSitoCompagnia, descrizioneCompagniaBreve },
            descrizione, cast, locationSpecifica,
            "luogo": { "nome": luogo.nomeStruttura, "citta": luogo.citta },
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

  return { edizioneCorrente, spettacoliCorrente, edizioniPassate, paginaCopy };
}

export const metadata = {
  title: "Imaginarium",
  description:
    "Festival di Teatro Itinerante a Soncino. Sei serate, ingresso gratuito.",
};

const MESI_HERO = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

function formatRange(inizio?: string, fine?: string): string {
  if (!inizio || !fine) return "";
  const a = new Date(inizio);
  const b = new Date(fine);
  const meseA = MESI_HERO[a.getMonth()];
  const meseB = MESI_HERO[b.getMonth()];
  const annoB = b.getFullYear();
  if (meseA === meseB) return `${a.getDate()}–${b.getDate()} ${meseB} ${annoB}`;
  return `${a.getDate()} ${meseA} – ${b.getDate()} ${meseB} ${annoB}`;
}

function descrToText(blocks?: EdizioneHero["descrizione"]): string {
  if (!blocks) return "";
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n\n");
}

export default async function ImaginariumPage() {
  const { edizioneCorrente, spettacoliCorrente, edizioniPassate, paginaCopy } =
    await getImaginariumData();

  const counterFallback: CounterItem[] = [
    { valore: "3", etichetta: "edizioni" },
    { valore: "18", etichetta: "spettacoli ospitati" },
    { valore: "12", etichetta: "compagnie" },
    { valore: "2.500+", etichetta: "spettatori" },
  ];
  const counterNumeri =
    paginaCopy?.counterElenco && paginaCopy.counterElenco.length > 0
      ? paginaCopy.counterElenco
      : counterFallback;

  const dateRange = formatRange(
    edizioneCorrente?.dataInizio,
    edizioneCorrente?.dataFine
  );
  const descrizione =
    descrToText(edizioneCorrente?.descrizione) ||
    edizioneCorrente?.descrizioneBreve;
  const sottotitoloParts = [
    edizioneCorrente?.locationPrincipale,
    dateRange,
  ].filter(Boolean) as string[];
  const sottotitoloHero = [
    sottotitoloParts.join(" · "),
    descrizione,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="theme-imaginarium">
      <HeroPagina
        eyebrow="Festival di Teatro Itinerante"
        heading={
          edizioneCorrente?.anno
            ? `Imaginarium ${edizioneCorrente.anno}`
            : "Imaginarium"
        }
        sottotitolo={sottotitoloHero || undefined}
        fotoSfondo={edizioneCorrente?.fotoSfondoHero}
        palette="imaginarium"
        altezza="full"
      />
      <CounterStrip
        eyebrow={paginaCopy?.counterEyebrow ?? "IMAGINARIUM IN NUMERI"}
        numeri={counterNumeri}
        palette="imaginarium"
      />
      <ProgrammaCompleto
        spettacoli={spettacoliCorrente}
        heading="Programma"
      />
      <SponsorPartnerStrip data={edizioneCorrente} />
      <EdizioniPassate edizioni={edizioniPassate} />
    </div>
  );
}
