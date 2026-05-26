import { defineType, defineField } from "sanity";
import { seoOverrideFields, SEO_GROUP } from "./objects/seoFields";

export default defineType({
  name: "paginaImaginariumCopy",
  title: "Pagina Imaginarium",
  type: "document",
  description:
    "Qui modifichi i testi della pagina dedicata al festival Imaginarium. Ricordati di premere Publish per salvare.",
  groups: [
    { name: "hero", title: "🖼️ Parte alta della pagina" },
    { name: "counter", title: "🔢 Numeri del festival" },
    { name: "video", title: "🎬 Video di presentazione" },
    { name: "faq", title: "❓ Domande frequenti" },
    SEO_GROUP,
  ],
  fields: [
    defineField({
      name: "heroFotoSfondo",
      title: "Foto in cima alla pagina",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      description: "Foto orizzontale grande che fa da sfondo alla parte alta della pagina Imaginarium.",
      fields: [
        defineField({
          name: "alt",
          title: "Descrizione foto (per accessibilità)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "videoEyebrow",
      title: "Video — Eyebrow",
      type: "string",
      group: "video",
      initialValue: "GUARDA",
    }),
    defineField({
      name: "videoHeading",
      title: "Video — Heading",
      type: "string",
      group: "video",
      initialValue: "Imaginarium in due minuti",
    }),
    defineField({
      name: "videoYoutubeUrl",
      title: "Video — URL YouTube",
      type: "url",
      group: "video",
      description:
        "URL completo (youtube.com/watch?v=… o youtu.be/…). Se vuoto la sezione non viene mostrata.",
    }),
    defineField({
      name: "counterEyebrow",
      title: "Counter — Eyebrow",
      type: "string",
      group: "counter",
      initialValue: "IMAGINARIUM IN NUMERI",
    }),
    defineField({
      name: "counterElenco",
      title: "Counter — Elenco numeri",
      type: "array",
      group: "counter",
      description:
        "Totali cumulativi di tutte le edizioni del festival, non per singola edizione.",
      of: [
        {
          type: "object",
          name: "counterItem",
          fields: [
            { name: "valore", title: "Valore", type: "string", validation: (R) => R.required() },
            { name: "etichetta", title: "Etichetta", type: "string", validation: (R) => R.required() },
          ],
          preview: {
            select: { v: "valore", e: "etichetta" },
            prepare: ({ v, e }) => ({ title: `${v} — ${e}` }),
          },
        },
      ],
      initialValue: [
        { valore: "3", etichetta: "edizioni" },
        { valore: "18", etichetta: "spettacoli ospitati" },
        { valore: "12", etichetta: "compagnie" },
        { valore: "2.500+", etichetta: "spettatori" },
      ],
      validation: (R) => R.max(6),
    }),
    defineField({
      name: "faq",
      title: "Domande frequenti (FAQ)",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "faq",
      description:
        "Domande e risposte mostrate in fondo alla pagina. Aiutano anche la visibilità su Google.",
    }),
    ...seoOverrideFields(),
  ],
  preview: { prepare: () => ({ title: "Imaginarium — Copy pagina" }) },
});
