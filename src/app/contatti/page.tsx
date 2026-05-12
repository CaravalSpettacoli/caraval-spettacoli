import { Instagram, Facebook, Youtube, Music2, type LucideIcon } from "lucide-react";
import { client } from "@/../sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import {
  ContattiSezione,
  type AreaContatto,
} from "@/components/caraval/ContattiSezione";
import { CtaFinale } from "@/components/caraval/CtaFinale";
import { Reveal } from "@/components/effects/Reveal";

type ContattiCopy = {
  heroEyebrow?: string;
  heroHeading?: string;
  heroSottotitolo?: string;
  heroFotoSfondo?: { asset?: { _ref?: string }; alt?: string };
  aree?: AreaContatto[];
};

type Impostazioni = {
  contattiPubblici?: { email?: string; telefono?: string };
  datiAssociazione?: {
    indirizzo?: string;
    citta?: string;
    cap?: string;
    provincia?: string;
    partitaIva?: string;
    ragioneSociale?: string;
  };
  socialLinks?: Array<{
    piattaforma: "instagram" | "facebook" | "youtube" | "tiktok";
    url?: string;
    mostraInFooter?: boolean;
  }>;
};

const SOCIAL_ICON: Record<
  "instagram" | "facebook" | "youtube" | "tiktok",
  LucideIcon
> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music2,
};

const SOCIAL_LABEL: Record<
  "instagram" | "facebook" | "youtube" | "tiktok",
  string
> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export const revalidate = 60;

export const metadata = {
  title: "Contatti · Caraval Spettacoli",
  description:
    "Per spettacoli, formazione, collaborazioni o richieste tecniche. Tutti i contatti di Caraval Spettacoli.",
};

async function getData() {
  const [copy, impostazioni] = await Promise.all([
    client.fetch<ContattiCopy | null>(
      `*[_type == "paginaContattiCopy"][0]{
        heroEyebrow, heroHeading, heroSottotitolo,
        heroFotoSfondo,
        aree[]{
          icona, eyebrow, titolo, descrizione,
          telefonoOverride, emailOverride,
          referente->{ nome, telefonoPubblico, emailPubblica }
        }
      }`
    ),
    client.fetch<Impostazioni | null>(
      `*[_type == "impostazioniSito"][0]{
        contattiPubblici, datiAssociazione,
        socialLinks[]{piattaforma, url, mostraInFooter}
      }`
    ),
  ]);
  return { copy: copy ?? {}, impostazioni: impostazioni ?? {} };
}

/** Fallback social ufficiali. Stesso pattern del Footer per garantire render
 *  decente anche se Sanity non ha socialLinks configurati. */
const SOCIAL_FALLBACK: Array<{
  piattaforma: "instagram" | "facebook" | "youtube" | "tiktok";
  url: string;
  mostraInFooter?: boolean;
}> = [
  {
    piattaforma: "facebook",
    url: "https://www.facebook.com/Caraval-Spettacoli-101656231430635/",
  },
  {
    piattaforma: "instagram",
    url: "https://www.instagram.com/caravalspettacoli/",
  },
  {
    piattaforma: "youtube",
    url: "https://www.youtube.com/channel/UC-9aDMm5MfweZP7Weq881EA",
  },
];

export default async function ContattiPage() {
  const { copy, impostazioni } = await getData();
  const dati = impostazioni.datiAssociazione ?? {};
  const fallbackContatti = impostazioni.contattiPubblici ?? {};
  const aree = copy.aree ?? [];
  const socialLive = (impostazioni.socialLinks ?? []).filter(
    (s) => s.url && s.mostraInFooter !== false
  );
  const social = socialLive.length > 0 ? socialLive : SOCIAL_FALLBACK;

  const indirizzo = [
    dati.indirizzo,
    [dati.cap, dati.citta, dati.provincia].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <HeroPagina
        eyebrow={copy.heroEyebrow ?? "CONTATTI"}
        heading={copy.heroHeading ?? "Restiamo in contatto"}
        sottotitolo={
          copy.heroSottotitolo ??
          "Per spettacoli, formazione, collaborazioni o solo per dirci ciao."
        }
        fotoSfondo={copy.heroFotoSfondo}
        palette="default"
        altezza="compatto"
      />

      {/* Dove siamo + Contatti diretti — 2 colonne paritarie desktop, stack mobile */}
      <Reveal as="section">
      <Section background="nero">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
                DOVE SIAMO
              </p>
              <h2 className="font-display text-h2 text-crema-base leading-tight">
                {dati.ragioneSociale ?? "Caraval Spettacoli"}
              </h2>
              {indirizzo && (
                <address className="not-italic mt-4 text-body-l text-crema-muted leading-relaxed">
                  {indirizzo}
                </address>
              )}
            </div>
            <div>
              <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
                CONTATTI
              </p>
              <h2 className="font-display text-h2 text-crema-base leading-tight">
                Scrivici o chiamaci
              </h2>
              <ul className="mt-4 flex flex-col gap-2 text-body-l">
                {fallbackContatti.telefono && (
                  <li>
                    <a
                      href={`tel:${fallbackContatti.telefono.replace(/\s+/g, "")}`}
                      className="text-crema-base hover:text-rosso-hover transition-colors underline underline-offset-4 decoration-rosso-base/50"
                    >
                      {fallbackContatti.telefono}
                    </a>
                  </li>
                )}
                {fallbackContatti.email && (
                  <li>
                    <a
                      href={`mailto:${fallbackContatti.email}`}
                      className="text-crema-base hover:text-rosso-hover transition-colors underline underline-offset-4 decoration-rosso-base/50 break-all"
                    >
                      {fallbackContatti.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      </Reveal>

      {/* Aree contatto */}
      {aree.length > 0 && (
        <Reveal as="section">
          <Section background="nero-soft">
            <Container>
              <ul
                role="list"
                className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                {aree.map((a, i) => (
                  <li key={`${a.icona}-${i}`}>
                    <ContattiSezione area={a} fallback={fallbackContatti} />
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        </Reveal>
      )}

      {/* Social */}
      {social.length > 0 && (
        <Reveal as="section">
        <Section background="nero">
          <Container>
            <div className="text-center max-w-xl mx-auto">
              <p className="uppercase-tracked text-caption text-rosso-base/90 mb-3">
                SUI SOCIAL
              </p>
              <h2 className="font-display text-h1 text-crema-base leading-tight">
                Seguici
              </h2>
              <ul
                role="list"
                className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6"
              >
                {social.map((s) => {
                  const Icon = SOCIAL_ICON[s.piattaforma];
                  if (!Icon || !s.url) return null;
                  return (
                    <li key={s.piattaforma}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-5 py-3 border border-crema-faint hover:border-rosso-base hover:text-rosso-hover transition-colors text-body-s uppercase-tracked"
                      >
                        <Icon size={20} />
                        {SOCIAL_LABEL[s.piattaforma]}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Container>
        </Section>
        </Reveal>
      )}

      <CtaFinale
        variant="accent"
        heading="Pronto a iniziare?"
        sottotitolo="Scrivici. Ti rispondiamo entro 24 ore."
        ctaPrimaria={{
          label: "Manda una mail",
          href: `mailto:${fallbackContatti.email ?? "caravalspettacoli@gmail.com"}`,
        }}
        ctaSecondaria={
          fallbackContatti.telefono
            ? {
                label: "Chiama",
                href: `tel:${fallbackContatti.telefono.replace(/\s+/g, "")}`,
              }
            : undefined
        }
      />
    </>
  );
}
