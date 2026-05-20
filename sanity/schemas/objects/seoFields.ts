import { defineField } from "sanity";

/** Campi SEO override condivisi tra singleton di pagina e document type
 *  (spettacolo, spettacoloImaginarium). Tutti vuoti → si usano i default
 *  globali da `impostazioniSito.seoDefault`. Tutti opzionali. Si applica
 *  a un `group: "seo"` definito nello schema padre. */
export function seoOverrideFields() {
  return [
    defineField({
      name: "seoTitle",
      title: "Titolo SEO (override)",
      type: "string",
      description:
        "Se vuoto, usa il default globale o il titolo della pagina. Max 70 caratteri ottimali.",
      validation: (r) => r.max(70),
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "Meta description (override)",
      type: "text",
      rows: 3,
      description:
        "Se vuota, usa la descrizione breve o il default globale. Max 170 caratteri ottimali.",
      validation: (r) => r.max(170),
      group: "seo",
    }),
    defineField({
      name: "seoOgImage",
      title: "Immagine Open Graph (override)",
      type: "image",
      description:
        "1200x630px raccomandato. Se vuota, usa fotoHero/immagineCover o il default globale.",
      options: { hotspot: true },
      group: "seo",
    }),
    defineField({
      name: "seoKeywords",
      title: "Keywords aggiuntive (override)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Si sommano alle keywords globali. Esempi: 'spettacolo teatro fuoco Soncino', 'Imaginarium 2026'.",
      group: "seo",
    }),
  ];
}

export const SEO_GROUP = { name: "seo", title: "SEO (override)" } as const;
