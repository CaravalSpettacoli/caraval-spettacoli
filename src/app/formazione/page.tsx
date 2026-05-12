import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CorsoCard, type CorsoCardData } from "@/components/caraval/CorsoCard";
import { LaboratoriScuoleSection } from "@/components/caraval/LaboratoriScuoleSection";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import { CtaFinale } from "@/components/caraval/CtaFinale";
import { OndaDecorativa } from "@/components/decorative/OndaDecorativa";

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
  formazioneHeroFotoSfondo?: { asset?: { _ref?: string }; alt?: string };
  corsiSezioneEyebrow?: string;
  corsiSezioneHeading?: string;
  corsiStatoVuotoTesto?: string;
  corsoCardCtaLabel?: string;
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
        formazioneHeroFotoSfondo,
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
    copy.laboratoriCtaTesto ?? "Contattaci per i laboratori scolastici";
  const labCtaHref = `mailto:${
    impostazioni.contattiPubblici?.email ?? "caravalspettacoli@gmail.com"
  }?subject=${encodeURIComponent("Laboratori scolastici")}`;

  const contattiEmail =
    impostazioni.contattiPubblici?.email ?? "caravalspettacoli@gmail.com";
  const contattiTel = impostazioni.contattiPubblici?.telefono;

  return (
    <>
      <HeroPagina
        eyebrow={heroEyebrow}
        heading={heroHeading}
        sottotitolo={[heroSubheading, heroIntro].filter(Boolean).join("\n\n")}
        fotoSfondo={copy.formazioneHeroFotoSfondo}
        palette="default"
        altezza="compatto"
      />

      {/* Sezione corsi */}
      <Section theme="dark" bgVariant="soft" glow="top-left">
        <Container>
          <div className="mb-10 flex flex-col items-start gap-4">
            <OndaDecorativa
              width={120}
              variant="sottile"
              className="text-rosso-base/60"
            />
            <div>
              <p className="text-label uppercase-tracked text-rosso-hover mb-3">
                {corsiEyebrow}
              </p>
              <h2 className="font-display text-h2 text-crema-base leading-tight">
                {corsiHeading}
              </h2>
            </div>
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
                <CorsoCard
                  key={c._id}
                  corso={{ ...c, ctaLabel: copy.corsoCardCtaLabel }}
                />
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

      <CtaFinale
        variant="accent"
        heading="Vuoi iscriverti all'Officina Teatrale?"
        sottotitolo="Scrivici o chiamaci per informazioni."
        ctaPrimaria={{
          label: "Scrivici",
          href: `mailto:${contattiEmail}?subject=${encodeURIComponent("Informazioni corsi")}`,
        }}
        ctaSecondaria={
          contattiTel
            ? {
                label: `Chiama ${contattiTel}`,
                href: `tel:${contattiTel.replace(/\s+/g, "")}`,
              }
            : undefined
        }
      />
    </>
  );
}
