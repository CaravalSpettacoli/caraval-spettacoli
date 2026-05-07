import { defineType, defineField } from "sanity";

export default defineType({
  name: "homepageCopy",
  title: "Homepage — Copy sezioni",
  type: "document",
  groups: [
    { name: "premi", title: "Strip Premi" },
    { name: "imaginarium", title: "Imaginarium preview" },
    { name: "repertorio", title: "Repertorio" },
    { name: "officina", title: "Officina Teatrale" },
    { name: "ospita", title: "Ospita Caraval" },
    { name: "contatti", title: "Contatti prelude" },
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
  ],
  preview: { prepare: () => ({ title: "Homepage — Copy sezioni" }) },
});
