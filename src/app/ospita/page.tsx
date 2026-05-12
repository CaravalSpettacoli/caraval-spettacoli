import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import {
  ProcessoIngaggio,
  type StepIngaggio,
} from "@/components/caraval/ProcessoIngaggio";
import {
  TestimonianzeStrip,
  type Testimonianza,
} from "@/components/caraval/TestimonianzeStrip";
import { HannoIngaggiatoCaraval } from "@/components/caraval/HannoIngaggiatoCaraval";
import { CtaFinale } from "@/components/caraval/CtaFinale";

type OspitaCopy = {
  heroEyebrow?: string;
  heroHeading?: string;
  heroSottotitolo?: string;
  heroFotoSfondo?: { asset?: { _ref?: string }; alt?: string };
  valorePropostoEyebrow?: string;
  valorePropostoHeading?: string;
  valorePropostoBody?: string;
  processoIngaggioEyebrow?: string;
  processoIngaggioHeading?: string;
  processoIngaggioStep?: StepIngaggio[];
  testimonianzeEyebrow?: string;
  testimonianzeHeading?: string;
  testimonianze?: Testimonianza[];
  hannoIngaggiatoEyebrow?: string;
  hannoIngaggiatoElenco?: string[];
  ctaFinaleHeading?: string;
  ctaFinaleBody?: string;
};

type Impostazioni = {
  contattiPubblici?: { email?: string };
};

export const revalidate = 60;

export const metadata = {
  title: "Ospita Caraval · Caraval Spettacoli",
  description:
    "Comuni, Pro Loco, dimore storiche, associazioni: porta uno spettacolo Caraval nella tua piazza. Prosa, fuoco, strada.",
};

async function getData() {
  const [copy, impostazioni] = await Promise.all([
    client.fetch<OspitaCopy | null>(`*[_type == "paginaOspitaCopy"][0]`),
    client.fetch<Impostazioni | null>(
      `*[_type == "impostazioniSito"][0]{ contattiPubblici }`
    ),
  ]);
  return { copy: copy ?? {}, impostazioni: impostazioni ?? {} };
}

export default async function OspitaPage() {
  const { copy, impostazioni } = await getData();
  const email =
    impostazioni.contattiPubblici?.email ?? "caravalspettacoli@gmail.com";
  const ctaHref = `mailto:${email}?subject=${encodeURIComponent("Richiesta ingaggio")}`;

  return (
    <>
      <HeroPagina
        eyebrow={copy.heroEyebrow ?? "OSPITA CARAVAL"}
        heading={copy.heroHeading ?? "Porta il teatro nella tua piazza"}
        sottotitolo={copy.heroSottotitolo}
        ctaPrimaria={{ label: "Contattaci ora →", href: ctaHref, esterno: false }}
        fotoSfondo={copy.heroFotoSfondo}
        palette="default"
        altezza="compatto"
      />

      {/* Valore proposto */}
      <Section background="nero-soft">
        <Container>
          <div className="max-w-3xl">
            {copy.valorePropostoEyebrow && (
              <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
                {copy.valorePropostoEyebrow}
              </p>
            )}
            <h2 className="font-display text-h1 text-crema-base leading-tight text-balance">
              {copy.valorePropostoHeading ?? "Teatro che funziona, dove serve"}
            </h2>
            {copy.valorePropostoBody && (
              <p className="mt-6 text-body-l text-crema-muted whitespace-pre-line leading-relaxed">
                {copy.valorePropostoBody}
              </p>
            )}
          </div>
        </Container>
      </Section>

      <ProcessoIngaggio
        eyebrow={copy.processoIngaggioEyebrow}
        heading={copy.processoIngaggioHeading}
        step={copy.processoIngaggioStep ?? []}
      />

      <TestimonianzeStrip
        eyebrow={copy.testimonianzeEyebrow}
        heading={copy.testimonianzeHeading}
        testimonianze={copy.testimonianze ?? []}
      />

      <HannoIngaggiatoCaraval
        eyebrow={copy.hannoIngaggiatoEyebrow}
        enti={copy.hannoIngaggiatoElenco ?? []}
      />

      <CtaFinale
        heading={copy.ctaFinaleHeading ?? "Pronto a portare Caraval da te?"}
        sottotitolo={copy.ctaFinaleBody}
        ctaPrimaria={{ label: "Scrivici", href: ctaHref }}
        variant="accent"
      />
    </>
  );
}
