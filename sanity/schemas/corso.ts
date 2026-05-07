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
          { title: "Scuole", value: "scuole" },
          { title: "Altro", value: "altro" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "statoCorso",
      title: "Stato del corso",
      type: "string",
      options: {
        list: [
          { title: "In corso", value: "in_corso" },
          { title: "Iscrizioni aperte", value: "iscrizioni_aperte" },
          { title: "Concluso", value: "concluso" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "descrizione",
      title: "Descrizione",
      type: "array",
      of: [{ type: "block" }],
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
      name: "dataChiusuraIscrizioni",
      title: "Data chiusura iscrizioni",
      type: "date",
    }),
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
      title: "Spettacolo finale (legacy)",
      type: "reference",
      to: [{ type: "spettacoloImaginarium" }],
      description:
        "CAMPO DEPRECATO — usa spettacoloFinaleLinked. Mantenuto per retrocompatibilità.",
    }),
    defineField({
      name: "spettacoloFinaleLinked",
      title: "Spettacolo finale linkato",
      type: "reference",
      to: [{ type: "spettacoloImaginarium" }],
    }),
    defineField({
      name: "referenteIscrizioni",
      title: "Referente iscrizioni",
      type: "reference",
      to: [{ type: "membro" }],
    }),
  ],
  preview: {
    select: { title: "titolo", subtitle: "target", media: "immagineCover" },
  },
});
