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
      initialValue: "Compagnia teatrale di Soncino, dal 2016.",
    }),

    // Storia
    defineField({ name: "storiaEyebrow", title: "Storia — Eyebrow", type: "string", group: "storia", initialValue: "LA NOSTRA STORIA" }),
    defineField({ name: "storiaHeading", title: "Storia — Heading", type: "string", group: "storia", initialValue: "Una compagnia, tre anime, un festival" }),
    defineField({
      name: "storiaBody",
      title: "Storia — Body",
      type: "text",
      rows: 12,
      group: "storia",
      initialValue:
        "Caraval Spettacoli è una compagnia teatrale che vanta tra le sue fila attori esperti, giocolieri e scenografi in grado di realizzare spettacoli di successo. Dal 2016 portiamo sul palco diverse storie e personaggi, passando dalla commedia dell'arte al teatro di prosa fino a quello più sperimentale, senza mai dimenticare l'arte di strada che è dove affondano le nostre radici.\n\nMettiamo in scena sia i testi di grandi autori teatrali che copioni nuovi scritti da noi, per il teatro ma non solo. Infatti, abbiamo partecipato a festival e feste locali in cui i committenti ci hanno chiesto di scrivere uno spettacolo ad hoc, che parlasse di una tematica particolare o rappresentasse un evento storico importante per il luogo.\n\nIl teatro non è quindi l'unico spazio in cui operiamo: piazze, dimore storiche e castelli sono spesso cornici delle nostre performance. Curiamo ogni dettaglio occupandoci anche della scenografia e dei costumi, creati su misura per ogni spettacolo, così da rendere qualsiasi location il palcoscenico perfetto.\n\nDa diversi anni partecipiamo al Carnevale di Venezia, portando per le calle della città costumi realizzati interamente da noi e figure fantastiche frutto della nostra creatività.\n\n#inviaggioconcaraval è il nostro hashtag ufficiale, perché amiamo viaggiare sia sulla strada che sulle ali della fantasia.",
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
