import { defineType, defineField } from "sanity";

export default defineType({
  name: "corso",
  title: "Corso (formazione)",
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
    }),
    defineField({
      name: "target",
      title: "Target",
      type: "string",
      options: {
        list: [
          { title: "Adulti", value: "adulti" },
          { title: "Bambini", value: "bambini" },
          { title: "Adolescenti", value: "adolescenti" },
          { title: "Professionisti", value: "professionisti" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descrizione",
      title: "Descrizione",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "immagineCover",
      title: "Immagine cover",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
    }),
    defineField({ name: "dataInizio", title: "Data inizio", type: "date" }),
    defineField({ name: "dataFine", title: "Data fine", type: "date" }),
    defineField({
      name: "frequenza",
      title: "Frequenza (es. \"una sera a settimana\")",
      type: "string",
    }),
    defineField({ name: "sede", title: "Sede", type: "string" }),
    defineField({
      name: "costoVisibile",
      title: "Mostra costo pubblicamente",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "costo",
      title: "Costo",
      type: "string",
      hidden: ({ document }) => !document?.costoVisibile,
    }),
    defineField({
      name: "attivo",
      title: "Attivo",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "spettacoloFinaleRif",
      title: "Spettacolo finale (riferimento)",
      type: "reference",
      to: [{ type: "spettacoloImaginarium" }],
    }),
  ],
  preview: {
    select: { title: "titolo", subtitle: "target", media: "immagineCover" },
  },
});
