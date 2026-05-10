import { defineType, defineField } from "sanity";

export default defineType({
  name: "paginaChiSiamoCopy",
  title: "Chi siamo — Copy pagina",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "storia", title: "Storia" },
    { name: "membri", title: "Membri" },
    { name: "premi", title: "Premi" },
    { name: "magia", title: "Scuola di Magia" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroEyebrow", title: "Hero — Eyebrow", type: "string", group: "hero", initialValue: "CHI SIAMO" }),
    defineField({ name: "heroHeading", title: "Hero — Heading", type: "string", group: "hero", initialValue: "Caraval Spettacoli" }),
    defineField({
      name: "heroSottotitolo",
      title: "Hero — Sottotitolo",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue: "Compagnia teatrale di Soncino, dal 2020.",
    }),

    // Storia
    defineField({ name: "storiaEyebrow", title: "Storia — Eyebrow", type: "string", group: "storia", initialValue: "LA NOSTRA STORIA" }),
    defineField({ name: "storiaHeading", title: "Storia — Heading", type: "string", group: "storia", initialValue: "Da una piazza vuota a un festival" }),
    defineField({
      name: "storiaBody",
      title: "Storia — Body",
      type: "text",
      rows: 8,
      group: "storia",
      initialValue:
        "Caraval nasce nel 2020 a Soncino, da un gruppo di amici che voleva fare teatro nei luoghi della propria infanzia. Le prime prove in un cortile, i primi spettacoli in piazza. Poi la prosa, il fuoco, la strada — tre lingue diverse per parlare allo stesso pubblico, fatto di vicini di casa e turisti, bambini e nonni.\n\nIn sei anni siamo passati da una piazza vuota a un festival che ogni estate trasforma i borghi della media pianura in palcoscenico: Imaginarium. Cinque edizioni, decine di compagnie ospitate, migliaia di spettatori. Un'idea semplice — fare teatro dove la comunità vive — che ogni anno trova nuove forme.",
    }),
    defineField({
      name: "storiaFotoSezione",
      title: "Storia — Foto sezione",
      type: "image",
      options: { hotspot: true },
      group: "storia",
      fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
    }),

    // Membri
    defineField({ name: "membriEyebrow", title: "Membri — Eyebrow", type: "string", group: "membri", initialValue: "LA COMPAGNIA" }),
    defineField({ name: "membriHeading", title: "Membri — Heading", type: "string", group: "membri", initialValue: "Le persone di Caraval" }),
    defineField({
      name: "membriIntro",
      title: "Membri — Intro",
      type: "text",
      rows: 2,
      group: "membri",
      initialValue: "Sei artisti che fanno teatro insieme.",
    }),

    // Premi
    defineField({ name: "premiEyebrow", title: "Premi — Eyebrow", type: "string", group: "premi", initialValue: "RICONOSCIMENTI" }),
    defineField({ name: "premiHeading", title: "Premi — Heading", type: "string", group: "premi", initialValue: "I premi che abbiamo ricevuto" }),

    // Scuola di Magia
    defineField({ name: "scuolaMagiaEyebrow", title: "Scuola Magia — Eyebrow", type: "string", group: "magia", initialValue: "ALTRI PROGETTI" }),
    defineField({ name: "scuolaMagiaHeading", title: "Scuola Magia — Heading", type: "string", group: "magia", initialValue: "Scuola di Magia Italiana" }),
    defineField({
      name: "scuolaMagiaBody",
      title: "Scuola Magia — Body",
      type: "text",
      rows: 4,
      group: "magia",
      initialValue:
        "Vera è anche fondatrice della Scuola di Magia Italiana, percorso formativo dedicato all'arte magica e alla prestidigitazione. Una realtà parallela a Caraval, con un suo percorso e una sua identità.",
    }),
    defineField({
      name: "scuolaMagiaUrl",
      title: "Scuola Magia — URL",
      type: "url",
      group: "magia",
      initialValue: "https://scuoladimagiaitaliana.it",
    }),
    defineField({
      name: "scuolaMagiaFoto",
      title: "Scuola Magia — Foto",
      type: "image",
      options: { hotspot: true },
      group: "magia",
      fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Chi siamo — Copy pagina" }) },
});
