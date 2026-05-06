import { defineType, defineField } from "sanity";

const paginaInfoFields = [
  defineField({
    name: "titolo",
    title: "Titolo",
    type: "string",
    validation: (r) => r.required(),
  }),
  defineField({
    name: "heroImmagine",
    title: "Immagine hero",
    type: "image",
    options: { hotspot: true },
    fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
  }),
  defineField({
    name: "corpoTesto",
    title: "Corpo testo",
    type: "array",
    of: [{ type: "block" }],
    validation: (r) => r.required(),
  }),
  defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
  defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
];

export const paginaChiSiamo = defineType({
  name: "paginaChiSiamo",
  title: "Pagina — Chi siamo",
  type: "document",
  fields: paginaInfoFields,
});

export const paginaOspita = defineType({
  name: "paginaOspita",
  title: "Pagina — Ospita Caraval",
  type: "document",
  fields: paginaInfoFields,
});
