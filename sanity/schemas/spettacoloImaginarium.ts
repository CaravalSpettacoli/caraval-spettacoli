import { defineType, defineField, defineArrayMember } from "sanity";
import { seoOverrideFields, SEO_GROUP } from "./objects/seoFields";

export default defineType({
  name: "spettacoloImaginarium",
  title: "Spettacolo Imaginarium",
  type: "document",
  groups: [SEO_GROUP],
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
      name: "edizioneRif",
      title: "Edizione di riferimento",
      type: "reference",
      to: [{ type: "edizioneImaginarium" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "compagnia",
      title: "Compagnia",
      type: "object",
      fields: [
        defineField({
          name: "nome",
          title: "Nome",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "eCaraval",
          title: "È Caraval",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "eOfficina",
          title: "È Officina",
          type: "boolean",
          initialValue: false,
        }),
        defineField({ name: "urlSitoCompagnia", title: "URL sito compagnia", type: "url" }),
        defineField({
          name: "descrizioneCompagniaBreve",
          title: "Descrizione compagnia breve",
          type: "text",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "linkCompagniaEsterna",
      title: "Link compagnia (esterno)",
      type: "url",
      description:
        "Alias di compagnia.urlSitoCompagnia, popolato per linkare il nome della compagnia nella card programma.",
    }),
    defineField({
      name: "dataInizio",
      title: "Data e ora inizio",
      type: "datetime",
      description:
        "Data e ora di inizio spettacolo. Es. 04/06/2026 21:30. Default orario consigliato Imaginarium: 21:30.",
      options: { dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm" },
      initialValue: undefined,
      validation: (r) => r.required(),
    }),
    defineField({ name: "luogo", title: "Luogo", type: "luogo" }),
    defineField({
      name: "locationSpecifica",
      title: "Location specifica (testo libero)",
      type: "string",
      description:
        'Nome del luogo per il programma. Es. "Rocca Sforzesca", "Teatro Aldo Moro — Orzinuovi", "Castel Giardino Il Fagiolo — Soncino", "Coop L\'Inchiostro — Soncino".',
    }),
    defineField({
      name: "descrizioneBreve",
      title: "Descrizione breve (max 200 caratteri, 1-2 righe per card programma)",
      type: "text",
      rows: 2,
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "descrizione",
      title: "Descrizione lunga",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "immagineCover",
      title: "Immagine cover",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Testo alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Galleria",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
        }),
      ],
    }),
    defineField({ name: "cast", title: "Cast (testo libero)", type: "text", rows: 3 }),
    defineField({
      name: "comeParteciapare",
      title: "Come partecipare",
      type: "comeParteciapare",
    }),
    defineField({ name: "noteSpeciali", title: "Note speciali", type: "text", rows: 3 }),
    ...seoOverrideFields(),
  ],
  preview: {
    select: {
      title: "titolo",
      compagnia: "compagnia.nome",
      media: "immagineCover",
    },
    prepare({ title, compagnia }) {
      return { title, subtitle: compagnia };
    },
  },
});
