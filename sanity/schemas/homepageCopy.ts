import { defineType, defineField } from "sanity";
import { seoOverrideFields, SEO_GROUP } from "./objects/seoFields";

export default defineType({
  name: "homepageCopy",
  title: "Pagina Home — Testi delle sezioni",
  type: "document",
  description:
    "Qui modifichi i testi di tutte le sezioni della pagina principale (Premi, Numeri, Imaginarium, Repertorio, Caraval Academy, ecc.). Usa le linguette in alto per spostarti tra le sezioni. Ricordati di premere Publish per salvare.",
  groups: [
    { name: "premi", title: "🏆 Striscia premi" },
    { name: "numeri", title: "🔢 I numeri della compagnia" },
    { name: "imaginarium", title: "✨ Sezione Imaginarium" },
    { name: "repertorio", title: "🎭 Sezione Repertorio" },
    { name: "officina", title: "📚 Sezione Caraval Academy" },
    { name: "ospita", title: "🤝 Sezione Ospita Caraval" },
    { name: "contatti", title: "✉️ Sezione Contatti" },
    { name: "calendario", title: "🗓️ Sezione Calendario" },
    { name: "formazione", title: "📚 Sezione Formazione" },
    SEO_GROUP,
  ],
  fields: [
    // Strip Premi
    defineField({
      name: "premiHeading",
      title: "Titolo della striscia premi",
      type: "string",
      group: "premi",
      description: 'Es. "Tre premi in quattro anni."',
    }),

    // I numeri (counter homepage)
    defineField({
      name: "numeriEyebrow",
      title: "Sopratitolo piccolo",
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
      title: "Testo della preview Imaginarium",
      type: "text",
      rows: 3,
      group: "imaginarium",
    }),
    defineField({
      name: "imaginariumPreviewCtaTesto",
      title: "Pulsante — Testo",
      type: "string",
      group: "imaginarium",
    }),
    defineField({
      name: "patrociniHomepage",
      title: "Strip patrocini & partner (homepage)",
      type: "array",
      group: "imaginarium",
      description:
        "Loghi patrocini/sponsor/partner mostrati sotto la preview Imaginarium in homepage. Se logo manca, viene mostrato un placeholder col nome.",
      of: [
        {
          type: "object",
          name: "patrocinioItem",
          fields: [
            {
              name: "categoria",
              title: "Categoria",
              type: "string",
              options: {
                list: [
                  { title: "Con il patrocinio di", value: "patrocinio" },
                  { title: "Sponsor", value: "sponsor" },
                  { title: "Partner", value: "partner" },
                ],
                layout: "radio",
              },
              initialValue: "partner",
              validation: (R) => R.required(),
            },
            {
              name: "nome",
              title: "Nome",
              type: "string",
              validation: (R) => R.required(),
            },
            { name: "logo", title: "Logo", type: "image", options: { hotspot: true } },
            { name: "url", title: "URL (opzionale)", type: "url" },
          ],
          preview: {
            select: { title: "nome", subtitle: "categoria", media: "logo" },
          },
        },
      ],
      initialValue: [
        { categoria: "patrocinio", nome: "Comune di Soncino", url: "https://www.comune.soncino.cr.it" },
        { categoria: "sponsor", nome: "Danesi" },
        { categoria: "partner", nome: "Bacco da Seta" },
        { categoria: "partner", nome: "Pro Loco Soncino" },
        { categoria: "partner", nome: "I Viaggiastorie" },
      ],
      validation: (R) => R.max(20),
    }),

    // Repertorio
    defineField({
      name: "repertorioEyebrow",
      title: "Sopratitolo piccolo",
      type: "string",
      group: "repertorio",
    }),
    defineField({
      name: "repertorioHeading",
      title: "Titolo della sezione",
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
      title: "Pulsante — Testo",
      type: "string",
      group: "repertorio",
    }),
    defineField({
      name: "repertorioCtaLink",
      title: "Pulsante — Dove porta",
      type: "string",
      group: "repertorio",
    }),

    // Caraval Academy (campo tecnico "officina" mantenuto per backcompat)
    defineField({
      name: "officinaEyebrow",
      title: "Sopratitolo piccolo",
      type: "string",
      group: "officina",
    }),
    defineField({
      name: "officinaHeading",
      title: "Titolo della sezione",
      type: "string",
      group: "officina",
    }),
    defineField({
      name: "officinaBody",
      title: "Testo della sezione",
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
      title: "Pulsante — Testo",
      type: "string",
      group: "officina",
    }),
    defineField({
      name: "officinaCtaLink",
      title: "Pulsante — Dove porta",
      type: "string",
      group: "officina",
    }),

    // Ospita
    defineField({
      name: "ospitaHeading",
      title: "Titolo della sezione",
      type: "string",
      group: "ospita",
    }),
    defineField({
      name: "ospitaBody",
      title: "Testo della sezione",
      type: "text",
      rows: 4,
      group: "ospita",
    }),
    defineField({
      name: "ospitaCtaTesto",
      title: "Pulsante — Testo",
      type: "string",
      group: "ospita",
    }),
    defineField({
      name: "ospitaCtaLink",
      title: "Pulsante — Dove porta",
      type: "string",
      group: "ospita",
    }),

    // Contatti
    defineField({
      name: "contattiHeading",
      title: "Titolo della sezione",
      type: "string",
      group: "contatti",
    }),
    defineField({
      name: "contattiBody",
      title: "Testo della sezione",
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
    defineField({
      name: "calendarioHeroFotoSfondo",
      title: "Hero — Foto sfondo",
      type: "image",
      options: { hotspot: true },
      group: "calendario",
      fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
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
      name: "formazioneHeroFotoSfondo",
      title: "Hero — Foto sfondo",
      type: "image",
      options: { hotspot: true },
      group: "formazione",
      fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
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
      name: "corsoCardCtaLabel",
      title: "Corso — Label CTA Contatti",
      type: "string",
      group: "formazione",
      description: 'Label CTA "Contattaci per informazioni" in fondo a ogni card corso.',
      initialValue: "Contattaci per informazioni",
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
    ...seoOverrideFields(),
  ],
  preview: { prepare: () => ({ title: "Homepage — Copy sezioni" }) },
});
