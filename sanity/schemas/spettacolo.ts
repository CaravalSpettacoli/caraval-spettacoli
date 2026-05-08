import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "spettacolo",
  title: "Spettacolo",
  type: "document",
  fieldsets: [
    {
      name: "homepage",
      title: "Visibilità in homepage",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "contenutiConsigliati",
      title: "Contenuti consigliati",
      description:
        "Campi non bloccanti per la demo, ma necessari per avere una scheda spettacolo completa. Vera, popolali quando hai tempo.",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "prenotazioniFs",
      title: "Prenotazione / biglietti",
      description:
        "Come il pubblico prenota questo spettacolo. Determina la CTA del ticket nella scheda spettacolo.",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "titolo",
      title: "Titolo",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titolo", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Prosa", value: "prosa" },
          { title: "Strada", value: "strada" },
          { title: "Fuoco", value: "fuoco" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "inRepertorio",
      title: "In repertorio attivo",
      type: "boolean",
      initialValue: true,
      description: "Se disattivato, lo spettacolo va in archivio",
    }),
    defineField({
      name: "mostraInHomepage",
      title: "Mostra in homepage (sezione Repertorio)",
      type: "boolean",
      initialValue: false,
      fieldset: "homepage",
    }),
    defineField({
      name: "ordineHomepage",
      title: "Ordine in homepage",
      type: "number",
      description: "Numero crescente: 1 = primo della colonna",
      fieldset: "homepage",
    }),
    defineField({ name: "sottotitolo", title: "Sottotitolo", type: "string" }),
    defineField({
      name: "annoCreazione",
      title: "Anno di creazione",
      type: "number",
      validation: (r) => r.min(1900).max(new Date().getFullYear() + 1),
      fieldset: "contenutiConsigliati",
    }),
    defineField({
      name: "immagineCover",
      title: "Immagine di copertina",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Testo alternativo",
          type: "string",
        }),
      ],
      fieldset: "contenutiConsigliati",
    }),
    defineField({
      name: "gallery",
      title: "Galleria",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Testo alternativo",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "videoUrl", title: "Video URL (YouTube/Vimeo) — legacy", type: "url" }),
    defineField({
      name: "trailerYoutube",
      title: "Trailer YouTube",
      type: "url",
      description:
        "URL del trailer YouTube (formato youtube.com/watch?v=… oppure youtu.be/…). Se vuoto, la sezione trailer non viene mostrata.",
      fieldset: "contenutiConsigliati",
      validation: (r) =>
        r.uri({ scheme: ["https"] }).custom((v) => {
          if (!v) return true;
          if (
            typeof v === "string" &&
            (v.includes("youtube.com/watch?v=") || v.includes("youtu.be/"))
          ) {
            return true;
          }
          return "Deve essere un URL YouTube (youtube.com/watch?v=… o youtu.be/…)";
        }),
    }),
    defineField({
      name: "descrizioneBreve",
      title: "Descrizione breve (max 200 caratteri, per SEO)",
      type: "text",
      rows: 3,
      validation: (r) => r.max(200),
      fieldset: "contenutiConsigliati",
    }),
    defineField({
      name: "descrizioneNarrativa",
      title: "Descrizione narrativa",
      type: "array",
      of: [{ type: "block" }],
      fieldset: "contenutiConsigliati",
    }),
    defineField({
      name: "schedaTecnica",
      title: "Scheda tecnica",
      type: "object",
      fields: [
        defineField({ name: "durataMinuti", title: "Durata (minuti)", type: "number" }),
        defineField({ name: "numeroAttori", title: "Numero attori", type: "string" }),
        defineField({ name: "spazioScenico", title: "Spazio scenico", type: "string" }),
        defineField({ name: "audio", title: "Audio", type: "string" }),
        defineField({ name: "pubblicoTarget", title: "Pubblico target", type: "string" }),
        defineField({ name: "noteTecniche", title: "Note tecniche", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "cast",
      title: "Cast",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "nome", title: "Nome", type: "string" }),
            defineField({ name: "ruolo", title: "Ruolo", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "regia",
      title: "Regia",
      type: "string",
    }),
    defineField({
      name: "produzione",
      title: "Produzione",
      type: "string",
      initialValue: "Caraval Spettacoli",
    }),
    defineField({
      name: "premiAssociati",
      title: "Premi associati",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "premio" }] })],
    }),
    defineField({
      name: "referenteContatto",
      title: "Referente contatto",
      type: "reference",
      to: [{ type: "membro" }],
      description:
        "Per spettacoli di fuoco usa Nicola. Per il resto, default Vera o non specificato.",
    }),
    defineField({
      name: "premi",
      title: "Premi (legacy)",
      type: "array",
      description:
        "CAMPO DEPRECATO — usa premiAssociati. Mantenuto per retrocompatibilità.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "nomePremio", title: "Nome premio", type: "string" }),
            defineField({ name: "anno", title: "Anno", type: "number" }),
            defineField({ name: "categoria", title: "Categoria", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "citazioniStampa",
      title: "Citazioni stampa",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "testo", title: "Testo", type: "text", rows: 3 }),
            defineField({ name: "fonte", title: "Fonte", type: "string" }),
            defineField({ name: "data", title: "Data", type: "date" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Con fuoco", value: "con-fuoco" },
          { title: "Adatto bambini", value: "adatto-bambini" },
          { title: "All'aperto", value: "all-aperto" },
          { title: "In tour", value: "in-tour" },
        ],
      },
    }),
    defineField({
      name: "prenotazione",
      title: "Prenotazione / biglietti",
      type: "object",
      fieldset: "prenotazioniFs",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "modalita",
          title: "Modalità",
          type: "string",
          options: {
            list: [
              { title: "Richiesta contatto (default)", value: "richiestaContatto" },
              { title: "Link esterno (biglietteria online)", value: "linkEsterno" },
              { title: "Email / telefono diretto", value: "emailTelefono" },
              { title: "Ingresso libero", value: "ingressoLibero" },
              { title: "Botteghino al teatro", value: "botteghino" },
            ],
            layout: "radio",
          },
          initialValue: "richiestaContatto",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "urlBiglietti",
          title: "URL biglietteria",
          type: "url",
          description: 'Solo se modalità = "Link esterno"',
          hidden: ({ parent }) => parent?.modalita !== "linkEsterno",
        }),
        defineField({
          name: "etichettaCustom",
          title: "Etichetta CTA personalizzata (opzionale)",
          type: "string",
          description:
            'Override del testo del bottone (es. "Prenota su Vivaticket"). Se vuoto, viene usato il testo di default per la modalità.',
        }),
        defineField({
          name: "noteAggiuntive",
          title: "Note aggiuntive",
          type: "text",
          rows: 2,
          description: 'Es. "Ridotto under 26: 8€"',
        }),
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO title (override)", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "titolo", subtitle: "categoria", media: "immagineCover" },
  },
  orderings: [
    {
      title: "Ordine homepage",
      name: "ordineHomepage",
      by: [{ field: "ordineHomepage", direction: "asc" }],
    },
  ],
});
