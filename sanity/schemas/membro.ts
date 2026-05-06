import { defineType, defineField } from "sanity";

export default defineType({
  name: "membro",
  title: "Membro compagnia",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nome", maxLength: 96 },
    }),
    defineField({
      name: "ruoli",
      title: "Ruoli",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "bio", title: "Bio (opzionale)", type: "text", rows: 4 }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ordinamento",
      title: "Ordinamento",
      type: "number",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      title: "Ordinamento",
      name: "ordinamentoAsc",
      by: [{ field: "ordinamento", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "nome", subtitle: "ruoli", media: "foto" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: Array.isArray(subtitle) ? subtitle.join(", ") : subtitle,
        media,
      };
    },
  },
});
