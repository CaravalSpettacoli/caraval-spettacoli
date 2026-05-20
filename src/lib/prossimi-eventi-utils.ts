/** Helpers per la sezione "Prossimi eventi" homepage.
 *
 *  Unifica due fonti dati Sanity:
 *  - `evento` (date manuali del repertorio Caraval, con CTA flessibili)
 *  - `spettacoloImaginarium` (date Festival, CTA default → /imaginarium)
 *
 *  Decisione architetturale: niente raggruppamento per giornata (a differenza
 *  di /calendario) — la feed homepage mostra 1 riga per evento per massimo
 *  rilievo visivo nei prossimi 5 slot. */

type SanityImage = { asset?: { _ref?: string }; alt?: string } | null | undefined;

export type CtaTipo = "default" | "link" | "telefono" | "email";

export type EventoFromSanity = {
  _id: string;
  dataOra: string;
  descrizioneBreve?: string;
  mostraInHomepage?: boolean;
  ordinePriorita?: number;
  ctaTipo?: CtaTipo;
  ctaValore?: string;
  ctaLabel?: string;
  luogo?: { nome?: string; citta?: string };
  spettacolo?: {
    titolo?: string;
    slug?: string;
    immagineCover?: SanityImage;
    fotoHero?: SanityImage;
  };
};

export type SpettacoloImaginariumFromSanity = {
  _id: string;
  titolo: string;
  data: string;
  descrizioneBreve?: string;
  immagineCover?: SanityImage;
  locationSpecifica?: string;
  edizioneAnno?: number;
  edizioneSlug?: string;
  edizioneLocation?: string;
};

export type ProssimoEvento = {
  id: string;
  fonte: "evento" | "imaginarium";
  data: Date;
  titolo: string;
  location?: string;
  descrizioneBreve?: string;
  foto?: SanityImage;
  ctaHref: string;
  ctaLabel: string;
  ctaExternal: boolean;
  ordinePriorita?: number;
};

const CTA_LABEL_DEFAULT: Record<CtaTipo, string> = {
  default: "Contattaci →",
  link: "Prenota →",
  telefono: "Chiama →",
  email: "Scrivi →",
};

function buildCtaForEvento(e: EventoFromSanity): {
  href: string;
  label: string;
  external: boolean;
} {
  const tipo: CtaTipo = e.ctaTipo ?? "default";
  const label = e.ctaLabel ? `${e.ctaLabel} →` : CTA_LABEL_DEFAULT[tipo];

  if (tipo === "link" && e.ctaValore) {
    return { href: e.ctaValore, label, external: true };
  }
  if (tipo === "telefono" && e.ctaValore) {
    return { href: `tel:${e.ctaValore.replace(/\s+/g, "")}`, label, external: false };
  }
  if (tipo === "email" && e.ctaValore) {
    return { href: `mailto:${e.ctaValore}`, label, external: false };
  }
  return { href: "/contatti", label, external: false };
}

export function buildProssimiEventi(
  eventi: EventoFromSanity[],
  spettacoliImaginarium: SpettacoloImaginariumFromSanity[],
  cutoffISO: string,
  limit = 5
): ProssimoEvento[] {
  const cutoff = new Date(cutoffISO).getTime();

  const fromEventi: ProssimoEvento[] = eventi
    .filter(
      (e) =>
        e.spettacolo?.titolo &&
        e.mostraInHomepage !== false &&
        new Date(e.dataOra).getTime() >= cutoff
    )
    .map((e) => {
      const cta = buildCtaForEvento(e);
      const luogoStr = [e.luogo?.nome, e.luogo?.citta]
        .filter(Boolean)
        .join(", ");
      return {
        id: e._id,
        fonte: "evento" as const,
        data: new Date(e.dataOra),
        titolo: e.spettacolo!.titolo!,
        location: luogoStr || undefined,
        descrizioneBreve: e.descrizioneBreve,
        foto: e.spettacolo?.fotoHero ?? e.spettacolo?.immagineCover,
        ctaHref: cta.href,
        ctaLabel: cta.label,
        ctaExternal: cta.external,
        ordinePriorita: e.ordinePriorita,
      };
    });

  const fromImaginarium: ProssimoEvento[] = spettacoliImaginarium
    .filter((s) => s.titolo && s.data && new Date(s.data).getTime() >= cutoff)
    .map((s) => {
      const location =
        s.locationSpecifica ?? s.edizioneLocation ?? undefined;
      const anno = s.edizioneAnno ?? new Date(s.data).getFullYear();
      return {
        id: s._id,
        fonte: "imaginarium" as const,
        data: new Date(s.data),
        titolo: s.titolo,
        location,
        descrizioneBreve: s.descrizioneBreve,
        foto: s.immagineCover,
        ctaHref: s.edizioneSlug
          ? `/imaginarium/${s.edizioneSlug}`
          : `/imaginarium/${anno}`,
        ctaLabel: "Scopri →",
        ctaExternal: false,
      };
    });

  return [...fromEventi, ...fromImaginarium]
    .sort((a, b) => {
      const pa = a.ordinePriorita ?? 999;
      const pb = b.ordinePriorita ?? 999;
      if (pa !== pb) return pa - pb;
      return a.data.getTime() - b.data.getTime();
    })
    .slice(0, limit);
}

export function cutoffOggiISO(): string {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  return oggi.toISOString();
}
