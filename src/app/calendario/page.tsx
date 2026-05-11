import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  buildCalendario,
  type EventoFromSanity,
  type SpettacoloImaginariumFromSanity,
} from "@/lib/calendario-utils";
import { CalendarioFilter } from "@/components/caraval/CalendarioFilter";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import { CtaFinale } from "@/components/caraval/CtaFinale";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Calendario · Caraval Spettacoli",
  description:
    "Tutte le date di Caraval Spettacoli e del festival Imaginarium.",
};

type CopyCalendario = {
  calendarioHeroEyebrow?: string;
  calendarioHeroHeading?: string;
  calendarioHeroIntro?: string;
  ospitaHeading?: string;
  ospitaBody?: string;
  ospitaCtaTesto?: string;
  ospitaCtaLink?: string;
};

async function getCalendarioData() {
  const oggi = new Date().toISOString();
  const [eventi, spettacoliImaginarium, copy] = await Promise.all([
    client.fetch<EventoFromSanity[]>(
      `*[_type == "evento" && dataOra >= $oggi && mostraInCalendario == true] | order(dataOra asc) {
        _id, dataOra, modalitaAccesso, urlBiglietti, note,
        "luogo": { "nome": luogo.nomeStruttura, "citta": luogo.citta, "indirizzo": luogo.indirizzo },
        spettacolo->{
          titolo,
          "slug": slug.current,
          categoria,
          "fotoCover": immagineCover
        }
      }`,
      { oggi }
    ),
    client.fetch<SpettacoloImaginariumFromSanity[]>(
      `*[_type == "spettacoloImaginarium" && data >= $oggi] | order(data asc) {
        _id, titolo, data, compagnia, foto, linkCompagniaEsterna, locationSpecifica,
        edizione->{ anno, locationPrincipale, "slug": slug.current }
      }`,
      { oggi }
    ),
    client.fetch<CopyCalendario | null>(
      `*[_type == "homepageCopy"][0]{
        calendarioHeroEyebrow, calendarioHeroHeading, calendarioHeroIntro,
        ospitaHeading, ospitaBody, ospitaCtaTesto, ospitaCtaLink
      }`
    ),
  ]);

  return {
    items: buildCalendario(eventi, spettacoliImaginarium),
    copy: copy ?? {},
  };
}

export default async function CalendarioPage() {
  const { items, copy } = await getCalendarioData();

  const eyebrow = copy.calendarioHeroEyebrow ?? "CALENDARIO";
  const heading = copy.calendarioHeroHeading ?? "I prossimi appuntamenti";
  const intro =
    copy.calendarioHeroIntro ??
    "Tutte le date di Caraval Spettacoli e del festival Imaginarium.";

  const ospitaHeading =
    copy.ospitaHeading ??
    "Sei un Comune, una Pro Loco, una dimora storica?";
  const ospitaBody =
    copy.ospitaBody ??
    "Caraval può portare uno spettacolo da te.";
  const ospitaCtaTesto = copy.ospitaCtaTesto ?? "Scopri come ingaggiarci";
  const ospitaCtaLink = copy.ospitaCtaLink ?? "/ospita";

  return (
    <>
      <HeroPagina
        eyebrow={eyebrow}
        heading={heading}
        sottotitolo={intro}
        palette="default"
        altezza="compatto"
      />

      {/* Lista eventi + filtri */}
      <Section theme="dark" bgVariant="soft">
        <Container>
          <CalendarioFilter
            items={items}
            emptyText="Nessuna data in calendario al momento. Per ingaggiarci, contattaci."
          />
          {items.length === 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/contatti"
                className="inline-flex items-center text-body-l text-crema-base underline underline-offset-8 decoration-rosso-base hover:text-rosso-hover transition-colors"
              >
                Scrivici →
              </Link>
            </div>
          )}
        </Container>
      </Section>

      <CtaFinale
        variant="accent"
        heading={ospitaHeading}
        sottotitolo={ospitaBody}
        ctaPrimaria={{ label: ospitaCtaTesto, href: ospitaCtaLink }}
      />
    </>
  );
}
