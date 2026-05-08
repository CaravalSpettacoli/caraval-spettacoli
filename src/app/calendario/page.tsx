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
      {/* Hero compatto 40vh */}
      <section className="relative w-full bg-nero-deep min-h-[40vh] flex items-center border-b border-crema-faint/40">
        <Container className="py-12 md:py-16">
          <p className="text-label uppercase-tracked text-rosso-hover mb-3">
            {eyebrow}
          </p>
          <h1 className="font-display text-display-l text-crema-base leading-[1.05] tracking-tight max-w-[18ch]">
            {heading}
          </h1>
          <p className="mt-4 max-w-[680px] text-body-l text-crema-muted">
            {intro}
          </p>
        </Container>
      </section>

      {/* Lista eventi + filtri */}
      <Section className="bg-nero-base">
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

      {/* CTA finale ospita */}
      <Section className="bg-rosso-base">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-h2 text-crema-base leading-tight">
              {ospitaHeading}
            </h2>
            <p className="mt-4 text-body-l text-crema-base/90 whitespace-pre-line">
              {ospitaBody}
            </p>
            <Link
              href={ospitaCtaLink}
              className="mt-8 inline-block px-6 py-3 rounded-md bg-crema-base text-rosso-deep text-body-s font-semibold uppercase-tracked hover:bg-crema-bright transition-colors"
            >
              {ospitaCtaTesto}
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
