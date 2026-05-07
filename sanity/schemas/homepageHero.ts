import { defineType, defineField } from "sanity";

export default defineType({
  name: "homepageHero",
  title: "Homepage — Hero",
  type: "document",
  fields: [
    defineField({
      name: "fotoSfondo",
      title: "Foto di sfondo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Testo alternativo", type: "string" }),
      ],
      description:
        "Foto cinematografica wide. Se vuota, la hero usa lo sfondo nero del sito.",
    }),
    defineField({
      name: "heading",
      title: "Heading principale",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subheading",
      title: "Sottotitolo (2 righe max)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ctaPrimariaTesto",
      title: "CTA primaria — Testo",
      type: "string",
    }),
    defineField({
      name: "ctaPrimariaLink",
      title: "CTA primaria — Link",
      type: "string",
      description: "Es. /spettacoli",
    }),
    defineField({
      name: "ctaSecondariaTesto",
      title: "CTA secondaria — Testo",
      type: "string",
    }),
    defineField({
      name: "ctaSecondariaLink",
      title: "CTA secondaria — Link",
      type: "string",
      description: "Es. /imaginarium",
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage — Hero" }) },
});
