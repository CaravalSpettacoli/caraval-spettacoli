import { defineField } from "sanity";

/** Campi per personalizzare come la pagina appare su Google e quando viene
 *  condivisa sui social. Tutti i campi sono opzionali: se lasciati vuoti il
 *  sito usa i testi predefiniti delle impostazioni generali. */
export function seoOverrideFields() {
  return [
    defineField({
      name: "seoTitle",
      title: "Titolo per Google",
      type: "string",
      description:
        "Titolo che appare nei risultati di ricerca su Google (massimo 70 caratteri). Se lasci vuoto, viene usato il titolo della pagina.",
      validation: (r) => r.max(70),
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "Descrizione per Google",
      type: "text",
      rows: 3,
      description:
        "Testo che appare sotto il titolo nei risultati di Google (massimo 170 caratteri). Se lasci vuoto, viene usato il testo predefinito.",
      validation: (r) => r.max(170),
      group: "seo",
    }),
    defineField({
      name: "seoOgImage",
      title: "Immagine di anteprima sui social",
      type: "image",
      description:
        "Immagine che appare quando il link viene condiviso su WhatsApp, Facebook, Telegram. Formato consigliato: 1200x630 pixel. Se lasci vuota, viene usata automaticamente la foto principale della pagina.",
      options: { hotspot: true },
      group: "seo",
    }),
    defineField({
      name: "seoKeywords",
      title: "Parole chiave aggiuntive",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Parole chiave specifiche di questa pagina, in aggiunta a quelle generali del sito. Esempi: 'spettacolo teatro fuoco Soncino', 'Imaginarium 2026'.",
      group: "seo",
    }),
  ];
}

export const SEO_GROUP = {
  name: "seo",
  title: "🔍 Visibilità su Google",
} as const;
