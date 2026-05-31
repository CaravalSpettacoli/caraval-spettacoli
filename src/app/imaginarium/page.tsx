import { client } from "@/../sanity/lib/client";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import { partsInRome } from "@/lib/date-format";

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
  EdizioniPassate,
  type EdizionePassataItem,
} from "@/components/imaginarium/EdizioniPassate";
import { CounterStrip, type CounterItem } from "@/components/caraval/CounterStrip";
import { VideoYoutube } from "@/components/caraval/VideoYoutube";
import { CtaFinale } from "@/components/caraval/CtaFinale";
import { FaqSezione } from "@/components/caraval/FaqSezione";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import {
  PatrociniStrip,
  type PatrocinioItem,
} from "@/components/caraval/PatrociniStrip";
import { Stella5Punte } from "@/components/decorative/Stella5Punte";

export const revalidate = 60;

type SponsorPartnerData = {
  patrocinio?: string[];
  sponsor?: string[];
  partnerLista?: string[];
};

type EdizioneCorrenteFull = EdizioneHero & SponsorPartnerData & { anno?: number };

type PaginaImagCopy = {
  counterEyebrow?: string;
  counterElenco?: CounterItem[];
  videoEyebrow?: string;
  videoHeading?: string;
  videoYoutubeUrl?: string;
  heroFotoSfondo?: { asset?: { _ref?: string }; alt?: string };
  faq?: { domanda?: string; risposta?: string }[];
};

async function getImaginariumData() {
  const [edizioneCorrente, paginaCopy, homepageCopy] = await Promise.all([
    client.fetch<EdizioneCorrenteFull | null>(
      `*[_type == "edizioneImaginarium"] | order(anno desc)[0]{
        anno, titoloEdizione, dataInizio, dataFine,
        locationPrincipale, descrizione, descrizioneBreve,
        fotoSfondoHero,
        patrocinio, sponsor, partnerLista
      }`
    ),
    client.fetch<PaginaImagCopy | null>(
      `*[_type == "paginaImaginariumCopy"][0]{
        counterEyebrow, counterElenco,
        videoEyebrow, videoHeading, videoYoutubeUrl,
        heroFotoSfondo,
        faq[]{ domanda, risposta }
      }`
    ),
    client.fetch<{ patrociniHomepage?: PatrocinioItem[] } | null>(
      `*[_type == "homepageCopy"][0]{
        "patrociniHomepage": patrociniHomepage[]{ _key, categoria, nome, logo, url }
      }`
    ),
  ]);

  const annoCorrente = edizioneCorrente?.anno ?? null;

  const [spettacoliCorrente, edizioniPassate] = await Promise.all([
    annoCorrente
      ? client.fetch<SpettacoloImagItem[]>(
          `*[_type == "spettacoloImaginarium" && edizioneRif->anno == $anno] | order(dataInizio asc){
            _id, titolo, dataInizio, linkCompagniaEsterna,
            compagnia { nome, urlSitoCompagnia, descrizioneCompagniaBreve },
            descrizione, descrizioneBreve, cast, locationSpecifica,
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

  return {
    edizioneCorrente,
    spettacoliCorrente,
    edizioniPassate,
    paginaCopy,
    patrocini: homepageCopy?.patrociniHomepage ?? null,
  };
}

import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/generate-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    singletonId: "paginaImaginariumCopy",
    slug: "/imaginarium",
    defaultTitle: "Imaginarium 2026 — Festival teatrale di Soncino",
    defaultDescription:
      "Imaginarium è il festival teatrale annuale di Caraval Spettacoli a Soncino (CR). Programma 2026, sei serate, ingresso libero.",
  });
}

const MESI_HERO = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

function formatRange(inizio?: string, fine?: string): string {
  if (!inizio || !fine) return "";
  const a = partsInRome(inizio);
  const b = partsInRome(fine);
  const meseA = MESI_HERO[a.month];
  const meseB = MESI_HERO[b.month];
  if (meseA === meseB) return `${a.day}–${b.day} ${meseB} ${b.year}`;
  return `${a.day} ${meseA} – ${b.day} ${meseB} ${b.year}`;
}

function descrToText(blocks?: EdizioneHero["descrizione"]): string {
  if (!blocks) return "";
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n\n");
}

export default async function ImaginariumPage() {
  const {
    edizioneCorrente,
    spettacoliCorrente,
    edizioniPassate,
    paginaCopy,
    patrocini,
  } = await getImaginariumData();

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
    <div>
      {/* Hotfix 4: hero su sfondo nero (palette default) per dare un distacco
          visivo netto con la sezione "Programma" successiva (palette light = rosso).
          Il logo PNG è beige naturale, perfetto su nero. */}
      <HeroPagina
        eyebrow="Festival di Teatro Itinerante"
        heading={
          edizioneCorrente?.anno
            ? `Imaginarium ${edizioneCorrente.anno}`
            : "Imaginarium"
        }
        sottotitolo={sottotitoloHero || undefined}
        fotoSfondo={paginaCopy?.heroFotoSfondo ?? edizioneCorrente?.fotoSfondoHero}
        palette="default"
        altezza="full"
        logoSrc="/imaginarium-logo.png"
        logoAlt="Imaginarium — Festival di Teatro Itinerante"
      />
      {/* Hotfix pre-golive: divisore di transizione hero (nero) → counter (rosso).
          Risolve la mancanza di distacco segnalata da Vera. Gradient verticale +
          stella centrale + bordo netto basso per ancorare l'occhio. */}
      <div
        aria-hidden
        className="relative w-full"
        style={{
          height: "72px",
          background:
            "linear-gradient(to bottom, #050505 0%, #5c0d2a 60%, #a8174a 100%)",
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-crema-base/80">
          <Stella5Punte size={20} />
        </span>
      </div>
      <CounterStrip
        eyebrow={paginaCopy?.counterEyebrow ?? "IMAGINARIUM IN NUMERI"}
        numeri={counterNumeri}
        palette="imaginarium"
      />
      <VideoYoutube
        url={
          paginaCopy?.videoYoutubeUrl ??
          "https://www.youtube.com/watch?v=KNRC35KjVeA"
        }
        eyebrow={paginaCopy?.videoEyebrow ?? "GUARDA"}
        heading={paginaCopy?.videoHeading ?? "Imaginarium in due minuti"}
        palette="imaginarium"
      />
      <ProgrammaCompleto
        spettacoli={spettacoliCorrente}
        heading={
          edizioneCorrente?.anno
            ? `Programma ${edizioneCorrente.anno}`
            : "Programma"
        }
        palette="imaginarium"
      />
      {/* Hotfix Finale 2: PatrociniStrip ora rende 3 categorie distinte
          (patrocinio / sponsor / partner) basate sul campo Sanity
          `patrociniHomepage[].categoria`. Niente eyebrow override —
          ogni gruppo ha il suo titolo. */}
      <PatrociniStrip patrocini={patrocini} palette="light" />
      <EdizioniPassate edizioni={edizioniPassate} />
      <FaqSezione items={paginaCopy?.faq} />
      <FaqJsonLd items={paginaCopy?.faq} />
      <CtaFinale
        variant="dark"
        heading="Imaginarium è un progetto della comunità."
        sottotitolo={
          edizioneCorrente?.dataInizio && edizioneCorrente?.dataFine
            ? "Ti aspettiamo dal 4 al 18 giugno 2026."
            : undefined
        }
        ctaPrimaria={{ label: "Scopri Caraval", href: "/" }}
      />
    </div>
  );
}
