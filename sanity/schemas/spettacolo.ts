import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "spettacolo",
  title: "Spettacolo",
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
    defineField({ name: "sottotitolo", title: "Sottotitolo", type: "string" }),
    defineField({
      name: "annoCreazione",
      title: "Anno di creazione",
      type: "number",
      validation: (r) => r.required().min(1900).max(new Date().getFullYear() + 1),
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
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
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
    defineField({ name: "videoUrl", title: "Video URL (YouTube/Vimeo)", type: "url" }),
    defineField({
      name: "descrizioneBreve",
      title: "Descrizione breve (max 200 caratteri, per SEO)",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "descrizioneNarrativa",
      title: "Descrizione narrativa",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) =>
        r.custom((value, ctx) => {
          const doc = ctx.document as { inRepertorio?: boolean } | undefined;
          if (doc?.inRepertorio !== false && (!value || value.length === 0)) {
            return "Obbligatoria per spettacoli in repertorio";
          }
          return true;
        }),
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
      name: "premi",
      title: "Premi",
      type: "array",
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
    defineField({ name: "seoTitle", title: "SEO title (override)", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "titolo", subtitle: "categoria", media: "immagineCover" },
  },
});
