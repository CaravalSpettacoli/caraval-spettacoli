import type { Categoria } from "@/components/caraval/CategoriaBadge";

type SanityImage = { asset?: { _ref?: string }; alt?: string } | null | undefined;

export type EventoFromSanity = {
  _id: string;
  dataOra: string;
  modalitaAccesso: "linkEsterno" | "prenotazione" | "ingressoLibero" | "botteghino";
  urlBiglietti?: string;
  note?: string;
  luogo?: { nome?: string; citta?: string; indirizzo?: string };
  spettacolo?: {
    titolo?: string;
    slug?: string;
    categoria?: Categoria;
    fotoCover?: SanityImage;
  };
};

export type SpettacoloImaginariumFromSanity = {
  _id: string;
  titolo: string;
  data: string;
  compagnia?: string;
  foto?: SanityImage;
  linkCompagniaEsterna?: string;
  locationSpecifica?: string;
  edizione?: { anno: number; locationPrincipale?: string; slug?: string };
};

export type ItemEvento = {
  id: string;
  tipo: "evento";
  data: Date;
  titolo: string;
  slug: string;
  categoria?: Categoria;
  luogo?: { nome?: string; citta?: string; indirizzo?: string };
  modalitaAccesso: EventoFromSanity["modalitaAccesso"];
  urlBiglietti?: string;
  note?: string;
  fotoCover?: SanityImage;
};

export type ItemImaginarium = {
  id: string;
  tipo: "imaginarium";
  data: Date;
  edizioneAnno: number;
  edizioneSlug?: string;
  locationGiornata?: string;
  spettacoli: Array<{
    id: string;
    titolo: string;
    compagnia?: string;
    foto?: SanityImage;
    linkCompagniaEsterna?: string;
  }>;
};

export type CalendarioItem = ItemEvento | ItemImaginarium;

export function buildCalendario(
  eventi: EventoFromSanity[],
  spettacoliImaginarium: SpettacoloImaginariumFromSanity[]
): CalendarioItem[] {
  const itemsEventi: ItemEvento[] = eventi
    .filter((e) => e.spettacolo?.titolo && e.spettacolo?.slug)
    .map((e) => ({
      id: e._id,
      tipo: "evento" as const,
      data: new Date(e.dataOra),
      titolo: e.spettacolo!.titolo!,
      slug: e.spettacolo!.slug!,
      categoria: e.spettacolo?.categoria,
      luogo: e.luogo,
      modalitaAccesso: e.modalitaAccesso,
      urlBiglietti: e.urlBiglietti,
      note: e.note,
      fotoCover: e.spettacolo?.fotoCover,
    }));

  // Raggruppa spettacoli Imaginarium per giornata (YYYY-MM-DD locale)
  const grouped = new Map<string, SpettacoloImaginariumFromSanity[]>();
  for (const s of spettacoliImaginarium) {
    if (!s.data) continue;
    const d = new Date(s.data);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(s);
  }

  const itemsImaginarium: ItemImaginarium[] = Array.from(grouped.entries()).map(
    ([key, spettacoli]) => {
      const primo = spettacoli[0];
      const anno = primo.edizione?.anno ?? new Date(primo.data).getFullYear();
      return {
        id: `imaginarium-${key}`,
        tipo: "imaginarium" as const,
        data: new Date(primo.data),
        edizioneAnno: anno,
        edizioneSlug: primo.edizione?.slug ?? String(anno),
        locationGiornata:
          primo.locationSpecifica ?? primo.edizione?.locationPrincipale,
        spettacoli: spettacoli.map((s) => ({
          id: s._id,
          titolo: s.titolo,
          compagnia: s.compagnia,
          foto: s.foto,
          linkCompagniaEsterna: s.linkCompagniaEsterna,
        })),
      };
    }
  );

  return [...itemsEventi, ...itemsImaginarium].sort(
    (a, b) => a.data.getTime() - b.data.getTime()
  );
}

const MESI_LUNGHI = [
  "GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO",
  "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE",
];

export function meseLabel(date: Date): string {
  return `${MESI_LUNGHI[date.getMonth()]} ${date.getFullYear()}`;
}

export function groupByMese(items: CalendarioItem[]): Map<string, CalendarioItem[]> {
  const groups = new Map<string, CalendarioItem[]>();
  for (const item of items) {
    const key = meseLabel(item.data);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return groups;
}
