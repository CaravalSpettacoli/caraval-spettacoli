import { defineType, defineField } from "sanity";

export default defineType({
  name: "homepageCopy",
  title: "Homepage — Copy sezioni",
  type: "document",
  groups: [
    { name: "premi", title: "Strip Premi" },
    { name: "numeri", title: "I numeri" },
    { name: "imaginarium", title: "Imaginarium preview" },
    { name: "repertorio", title: "Repertorio" },
    { name: "officina", title: "Officina Teatrale" },
    { name: "ospita", title: "Ospita Caraval" },
    { name: "contatti", title: "Contatti prelude" },
    { name: "calendario", title: "Calendario (pagina)" },
    { name: "formazione", title: "Formazione (pagina)" },
  ],
  fields: [
    // Strip Premi
    defineField({
      name: "premiHeading",
      title: "Heading strip premi",
      type: "string",
      group: "premi",
      description: 'Es. "Tre premi in quattro anni."',
    }),

    // I numeri (counter homepage)
    defineField({
      name: "numeriEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "numeri",
      initialValue: "I NUMERI",
    }),
    defineField({
      name: "numeriElenco",
      title: "Elenco numeri",
      type: "array",
      group: "numeri",
      of: [
        {
          type: "object",
          name: "numeroItem",
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
        { valore: "9", etichetta: "spettacoli" },
        { valore: "3", etichetta: "anime" },
        { valore: "6", etichetta: "anni" },
        { valore: "1", etichetta: "festival" },
      ],
      validation: (R) => R.max(6),
    }),

    // Imaginarium preview
    defineField({
      name: "imaginariumPreviewBody",
      title: "Body preview Imaginarium",
      type: "text",
      rows: 3,
      group: "imaginarium",
    }),
    defineField({
      name: "imaginariumPreviewCtaTesto",
      title: "CTA — Testo",
      type: "string",
      group: "imaginarium",
    }),

    // Repertorio
    defineField({
      name: "repertorioEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "repertorio",
    }),
    defineField({
      name: "repertorioHeading",
      title: "Heading",
      type: "string",
      group: "repertorio",
    }),
    defineField({
      name: "repertorioIntro",
      title: "Intro (1 riga)",
      type: "text",
      rows: 2,
      group: "repertorio",
    }),
    defineField({
      name: "repertorioCtaTesto",
      title: "CTA — Testo",
      type: "string",
      group: "repertorio",
    }),
    defineField({
      name: "repertorioCtaLink",
      title: "CTA — Link",
      type: "string",
      group: "repertorio",
    }),

    // Officina
    defineField({
      name: "officinaEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "officina",
    }),
    defineField({
      name: "officinaHeading",
      title: "Heading",
      type: "string",
      group: "officina",
    }),
    defineField({
      name: "officinaBody",
      title: "Body",
      type: "text",
      rows: 3,
      group: "officina",
    }),
    defineField({
      name: "officinaTagline",
      title: "Tagline",
      type: "string",
      group: "officina",
    }),
    defineField({
      name: "officinaCtaTesto",
      title: "CTA — Testo",
      type: "string",
      group: "officina",
    }),
    defineField({
      name: "officinaCtaLink",
      title: "CTA — Link",
      type: "string",
      group: "officina",
    }),

    // Ospita
    defineField({
      name: "ospitaHeading",
      title: "Heading",
      type: "string",
      group: "ospita",
    }),
    defineField({
      name: "ospitaBody",
      title: "Body",
      type: "text",
      rows: 4,
      group: "ospita",
    }),
    defineField({
      name: "ospitaCtaTesto",
      title: "CTA — Testo",
      type: "string",
      group: "ospita",
    }),
    defineField({
      name: "ospitaCtaLink",
      title: "CTA — Link",
      type: "string",
      group: "ospita",
    }),

    // Contatti
    defineField({
      name: "contattiHeading",
      title: "Heading",
      type: "string",
      group: "contatti",
    }),
    defineField({
      name: "contattiBody",
      title: "Body",
      type: "text",
      rows: 2,
      group: "contatti",
    }),

    // Calendario (pagina)
    defineField({
      name: "calendarioHeroEyebrow",
      title: "Hero — Eyebrow",
      type: "string",
      group: "calendario",
    }),
    defineField({
      name: "calendarioHeroHeading",
      title: "Hero — Heading",
      type: "string",
      group: "calendario",
    }),
    defineField({
      name: "calendarioHeroIntro",
      title: "Hero — Intro",
      type: "text",
      rows: 2,
      group: "calendario",
    }),

    // Formazione (pagina)
    defineField({
      name: "formazioneHeroEyebrow",
      title: "Hero — Eyebrow",
      type: "string",
      group: "formazione",
    }),
    defineField({
      name: "formazioneHeroHeading",
      title: "Hero — Heading",
      type: "string",
      group: "formazione",
    }),
    defineField({
      name: "formazioneHeroSubheading",
      title: "Hero — Subheading (tagline)",
      type: "string",
      group: "formazione",
    }),
    defineField({
      name: "formazioneHeroIntro",
      title: "Hero — Intro",
      type: "text",
      rows: 3,
      group: "formazione",
    }),
    defineField({
      name: "corsiSezioneEyebrow",
      title: "Sezione corsi — Eyebrow",
      type: "string",
      group: "formazione",
    }),
    defineField({
      name: "corsiSezioneHeading",
      title: "Sezione corsi — Heading",
      type: "string",
      group: "formazione",
    }),
    defineField({
      name: "corsiStatoVuotoTesto",
      title: "Sezione corsi — Stato vuoto",
      type: "text",
      rows: 3,
      group: "formazione",
      description: "Mostrato quando non ci sono corsi attivi.",
    }),
    defineField({
      name: "laboratoriEyebrow",
      title: "Laboratori — Eyebrow",
      type: "string",
      group: "formazione",
    }),
    defineField({
      name: "laboratoriHeading",
      title: "Laboratori — Heading",
      type: "string",
      group: "formazione",
    }),
    defineField({
      name: "laboratoriBody",
      title: "Laboratori — Body",
      type: "text",
      rows: 5,
      group: "formazione",
    }),
    defineField({
      name: "laboratoriCtaTesto",
      title: "Laboratori — CTA testo",
      type: "string",
      group: "formazione",
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage — Copy sezioni" }) },
});
