import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CorsoCard, type CorsoCardData } from "@/components/caraval/CorsoCard";
import { LaboratoriScuoleSection } from "@/components/caraval/LaboratoriScuoleSection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Officina Teatrale · Caraval Spettacoli",
  description:
    "Corsi serali per adulti da ottobre a maggio. Spettacolo finale a Imaginarium. Laboratori nelle scuole primarie del territorio.",
};

type CopyFormazione = {
  formazioneHeroEyebrow?: string;
  formazioneHeroHeading?: string;
  formazioneHeroSubheading?: string;
  formazioneHeroIntro?: string;
  corsiSezioneEyebrow?: string;
  corsiSezioneHeading?: string;
  corsiStatoVuotoTesto?: string;
  laboratoriEyebrow?: string;
  laboratoriHeading?: string;
  laboratoriBody?: string;
  laboratoriCtaTesto?: string;
};

type ImpostazioniSubset = {
  contattiPubblici?: { email?: string; telefono?: string };
};

async function getFormazioneData() {
  const [corsi, copy, impostazioni] = await Promise.all([
    client.fetch<CorsoCardData[]>(
      `*[_type == "corso" && statoCorso != "concluso"] | order(dataInizio asc) {
        _id, titolo, target, statoCorso, frequenza, dataInizio, dataFine,
        spettacoloFinaleLinked->{
          titolo,
          "slug": slug.current,
          edizione->{ anno }
        },
        referenteIscrizioni->{
          nome, telefonoPubblico, emailPubblica
        }
      }`
    ),
    client.fetch<CopyFormazione | null>(
      `*[_type == "homepageCopy"][0]{
        formazioneHeroEyebrow, formazioneHeroHeading, formazioneHeroSubheading, formazioneHeroIntro,
        corsiSezioneEyebrow, corsiSezioneHeading, corsiStatoVuotoTesto,
        laboratoriEyebrow, laboratoriHeading, laboratoriBody, laboratoriCtaTesto
      }`
    ),
    client.fetch<ImpostazioniSubset | null>(
      `*[_type == "impostazioniSito"][0]{ contattiPubblici }`
    ),
  ]);

  return { corsi: corsi ?? [], copy: copy ?? {}, impostazioni: impostazioni ?? {} };
}

export default async function FormazionePage() {
  const { corsi, copy, impostazioni } = await getFormazioneData();

  const heroEyebrow = copy.formazioneHeroEyebrow ?? "FORMAZIONE";
  const heroHeading = copy.formazioneHeroHeading ?? "Officina Teatrale";
  const heroSubheading =
    copy.formazioneHeroSubheading ?? "Non serve esperienza. Serve curiosità.";
  const heroIntro =
    copy.formazioneHeroIntro ??
    "Corsi serali per adulti da ottobre a maggio. Spettacolo finale a Imaginarium.";

  const corsiEyebrow = copy.corsiSezioneEyebrow ?? "I CORSI ATTIVI";
  const corsiHeading = copy.corsiSezioneHeading ?? "Stagione corrente";
  const corsiVuoto =
    copy.corsiStatoVuotoTesto ??
    "Le iscrizioni per la prossima stagione apriranno a settembre. Resta in contatto per essere aggiornato →";

  const labEyebrow = copy.laboratoriEyebrow ?? "LABORATORI SCOLASTICI";
  const labHeading = copy.laboratoriHeading ?? "Nelle scuole del territorio";
  const labBody =
    copy.laboratoriBody ??
    "Caraval collabora con le scuole primarie del territorio attraverso laboratori teatrali pensati per i bambini. Un percorso di gioco, espressione e racconto, dentro l'orario scolastico. Per le scuole interessate, scriviamo un progetto su misura.";
  const labCtaTesto =
    copy.laboratoriCtaTesto ?? "Contatta Vera per i laboratori scolastici";
  const labCtaHref = `mailto:${
    impostazioni.contattiPubblici?.email ?? "caravalspettacoli@gmail.com"
  }?subject=${encodeURIComponent("Laboratori scolastici")}`;

  // Telefono CTA finale: Vera (referente formazione)
  const veraTel =
    corsi.find((c) => c.referenteIscrizioni?.telefonoPubblico)
      ?.referenteIscrizioni?.telefonoPubblico ?? "+39 348 9143189";
  const veraTelHref = `tel:${veraTel.replace(/\s+/g, "")}`;

  return (
    <>
      {/* Hero 50vh */}
      <section className="relative w-full bg-nero-deep min-h-[50vh] flex items-center border-b border-crema-faint/40">
        <Container className="py-16 md:py-24">
          <p className="text-label uppercase-tracked text-rosso-hover mb-3">
            {heroEyebrow}
          </p>
          <h1 className="font-display text-display-l text-crema-base leading-[1.05] tracking-tight">
            {heroHeading}
          </h1>
          <p className="mt-6 max-w-[680px] font-display text-h3 text-crema-base/90 leading-snug italic">
            {heroSubheading}
          </p>
          <p className="mt-6 max-w-[680px] text-body-l text-crema-muted whitespace-pre-line">
            {heroIntro}
          </p>
        </Container>
      </section>

      {/* Sezione corsi */}
      <Section className="bg-nero-base">
        <Container>
          <div className="mb-10">
            <p className="text-label uppercase-tracked text-rosso-hover mb-3">
              {corsiEyebrow}
            </p>
            <h2 className="font-display text-h2 text-crema-base leading-tight">
              {corsiHeading}
            </h2>
          </div>

          {corsi.length === 0 ? (
            <div className="py-12 max-w-2xl">
              <p className="text-body-l text-crema-muted whitespace-pre-line">
                {corsiVuoto}
              </p>
              <Link
                href="/contatti"
                className="mt-6 inline-flex items-center text-body-l text-crema-base underline underline-offset-8 decoration-rosso-base hover:text-rosso-hover transition-colors"
              >
                Contattaci →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {corsi.map((c) => (
                <CorsoCard key={c._id} corso={c} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Sezione laboratori */}
      <LaboratoriScuoleSection
        eyebrow={labEyebrow}
        heading={labHeading}
        body={labBody}
        ctaTesto={labCtaTesto}
        ctaHref={labCtaHref}
      />

      {/* CTA finale */}
      <Section className="bg-nero-base">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-body-l text-crema-muted mb-2">
              Hai domande sui corsi?
            </p>
            <p className="font-display text-h2 text-crema-base leading-tight">
              Chiama Vera al{" "}
              <a
                href={veraTelHref}
                className="text-rosso-hover hover:text-rosso-base transition-colors underline underline-offset-8 decoration-rosso-base/40"
              >
                {veraTel}
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
