import { defineType, defineField } from "sanity";

export default defineType({
  name: "evento",
  title: "Evento (calendario)",
  type: "document",
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
      name: "tipoEvento",
      title: "Tipo evento",
      type: "string",
      options: {
        list: [
          { title: "Spettacolo da repertorio", value: "spettacolo-repertorio" },
          { title: "Imaginarium", value: "imaginarium" },
          { title: "Officina", value: "officina" },
          { title: "Evento speciale", value: "evento-speciale" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "spettacoloRif",
      title: "Spettacolo (riferimento)",
      type: "reference",
      to: [{ type: "spettacolo" }],
      hidden: ({ document }) => document?.tipoEvento !== "spettacolo-repertorio",
      validation: (r) =>
        r.custom((value, ctx) => {
          const doc = ctx.document as { tipoEvento?: string } | undefined;
          if (doc?.tipoEvento === "spettacolo-repertorio" && !value) {
            return "Obbligatorio per spettacoli da repertorio";
          }
          return true;
        }),
    }),
    defineField({
      name: "spettacoloImaginariumRif",
      title: "Spettacolo Imaginarium (riferimento)",
      type: "reference",
      to: [{ type: "spettacoloImaginarium" }],
      hidden: ({ document }) => document?.tipoEvento !== "imaginarium",
      validation: (r) =>
        r.custom((value, ctx) => {
          const doc = ctx.document as { tipoEvento?: string } | undefined;
          if (doc?.tipoEvento === "imaginarium" && !value) {
            return "Obbligatorio per eventi Imaginarium";
          }
          return true;
        }),
    }),
    defineField({
      name: "titoloLibero",
      title: "Titolo libero (per eventi speciali)",
      type: "string",
    }),
    defineField({
      name: "dataInizio",
      title: "Data inizio",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({ name: "dataFine", title: "Data fine", type: "datetime" }),
    defineField({ name: "luogo", title: "Luogo", type: "luogo" }),
    defineField({
      name: "comeParteciapare",
      title: "Come partecipare",
      type: "comeParteciapare",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descrizioneEvento",
      title: "Descrizione evento (note specifiche)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "immagineCover",
      title: "Immagine cover (override)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Testo alternativo", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "titolo", date: "dataInizio", media: "immagineCover" },
    prepare({ title, date }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleString("it-IT") : "",
      };
    },
  },
});
