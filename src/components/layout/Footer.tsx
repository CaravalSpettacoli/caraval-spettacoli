import Link from "next/link";
import { Instagram, Facebook, Youtube, Music2, type LucideIcon } from "lucide-react";
import { client } from "../../../sanity/lib/client";
import { Container } from "@/components/ui/Container";

type SocialLink = {
  piattaforma: "instagram" | "facebook" | "youtube" | "tiktok";
  url: string;
  mostraInFooter?: boolean;
};

type ImpostazioniFooter = {
  contattiPubblici?: { email?: string; telefono?: string };
  datiAssociazione?: {
    ragioneSociale?: string;
    indirizzo?: string;
    citta?: string;
    cap?: string;
    provincia?: string;
    partitaIva?: string;
    codiceFiscale?: string;
  };
  socialLinks?: SocialLink[];
};

const FALLBACK: ImpostazioniFooter = {
  contattiPubblici: {
    email: "info@caraval.it",
    telefono: "",
  },
  datiAssociazione: {
    ragioneSociale: "Caraval Associazione Culturale",
    indirizzo: "",
    citta: "Soncino",
    cap: "",
    provincia: "CR",
    partitaIva: "",
    codiceFiscale: "",
  },
  socialLinks: [
    {
      piattaforma: "instagram",
      url: "https://www.instagram.com/caravalspettacoli/",
      mostraInFooter: true,
    },
    {
      piattaforma: "facebook",
      url: "https://www.facebook.com/Caraval-Spettacoli-101656231430635/",
      mostraInFooter: true,
    },
    {
      piattaforma: "youtube",
      url: "https://www.youtube.com/channel/UC-9aDMm5MfweZP7Weq881EA",
      mostraInFooter: true,
    },
  ],
};

const SITO_LINKS_BASE = [
  { href: "/spettacoli", label: "Spettacoli" },
  { href: "/formazione", label: "Formazione" },
  { href: "/imaginarium", label: "Imaginarium" },
];

const ASSOCIAZIONE_LINKS = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatti", label: "Contatti" },
  { href: "/ospita", label: "Ospita Caraval" },
];

const SOCIAL_ICON: Record<SocialLink["piattaforma"], LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music2,
};

async function getImpostazioni(): Promise<ImpostazioniFooter> {
  try {
    const data = await client.fetch<ImpostazioniFooter | null>(
      `*[_type == "impostazioniSito"][0]{
        contattiPubblici,
        datiAssociazione,
        socialLinks[]{piattaforma, url, mostraInFooter}
      }`,
      {},
      { next: { revalidate: 300 } }
    );
    return data || FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export async function Footer({ mostraCalendario = false }: { mostraCalendario?: boolean }) {
  const impostazioni = await getImpostazioni();
  const SITO_LINKS = mostraCalendario
    ? [SITO_LINKS_BASE[0], { href: "/calendario", label: "Calendario" }, ...SITO_LINKS_BASE.slice(1)]
    : SITO_LINKS_BASE;
  const dati = impostazioni.datiAssociazione || {};
  const contatti = impostazioni.contattiPubblici || {};
  const socialLive = (impostazioni.socialLinks || []).filter(
    (s) => s.mostraInFooter !== false && s.url
  );
  // Se Sanity non ha social configurati, fallback ai canali ufficiali.
  const social =
    socialLive.length > 0 ? socialLive : (FALLBACK.socialLinks ?? []);

  const indirizzoCompleto = [
    dati.indirizzo,
    [dati.cap, dati.citta, dati.provincia].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <footer data-theme="dark" className="bg-nero-soft text-crema-base border-t border-crema-faint mt-16">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Colonna 1 — Caraval */}
          {(() => {
            const ragione = dati.ragioneSociale || "Caraval Associazione Culturale";
            const parts = ragione.split(" ");
            const main = parts[0];
            const sub = parts.slice(1).join(" ");
            return (
              <div>
                <h3 className="font-display leading-none mb-1" style={{ fontSize: "1.5rem" }}>
                  {main.toUpperCase()}
                </h3>
                {sub && (
                  <p className="text-body-s text-crema-muted mt-1 mb-4">{sub}</p>
                )}
                <address className="not-italic text-body-s text-crema-muted leading-relaxed">
                  {indirizzoCompleto && <div>{indirizzoCompleto}</div>}
                  {dati.partitaIva && <div>P.IVA {dati.partitaIva}</div>}
                  {dati.codiceFiscale && dati.codiceFiscale !== dati.partitaIva && (
                    <div>C.F. {dati.codiceFiscale}</div>
                  )}
                </address>
              </div>
            );
          })()}

          {/* Colonna 2 — Sito */}
          <nav aria-label="Mappa del sito">
            <h3 className="text-label uppercase-tracked mb-4 text-crema-muted">
              Sito
            </h3>
            <ul className="space-y-2 text-body-s">
              {SITO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-rosso-hover transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonna 3 — Associazione */}
          <nav aria-label="Associazione">
            <h3 className="text-label uppercase-tracked mb-4 text-crema-muted">
              Chi siamo
            </h3>
            <ul className="space-y-2 text-body-s">
              {ASSOCIAZIONE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-rosso-hover transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonna 4 — Contatti */}
          <div>
            <h3 className="text-label uppercase-tracked mb-4 text-crema-muted">
              Contatti
            </h3>
            <ul className="text-body-s space-y-2">
              {contatti.email && (
                <li>
                  <a
                    href={`mailto:${contatti.email}`}
                    className="hover:text-rosso-hover transition-colors"
                  >
                    {contatti.email}
                  </a>
                </li>
              )}
              {contatti.telefono && (
                <li>
                  <a
                    href={`tel:${contatti.telefono.replace(/\s+/g, "")}`}
                    className="hover:text-rosso-hover transition-colors"
                  >
                    {contatti.telefono}
                  </a>
                </li>
              )}
            </ul>
            {social.length > 0 && (
              <div className="flex gap-4 mt-6">
                {social.map((s) => {
                  const Icon = SOCIAL_ICON[s.piattaforma];
                  if (!Icon) return null;
                  return (
                    <a
                      key={s.piattaforma}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.piattaforma}
                      className="inline-flex h-11 w-11 items-center justify-center text-crema-base hover:text-rosso-hover transition-colors"
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-crema-faint flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-caption text-crema-muted">
          <div>
            © {new Date().getFullYear()} Caraval Spettacoli — Sito di Eddidesign
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-crema-base">
              Privacy
            </Link>
            <Link href="/cookie" className="hover:text-crema-base">
              Cookie
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
