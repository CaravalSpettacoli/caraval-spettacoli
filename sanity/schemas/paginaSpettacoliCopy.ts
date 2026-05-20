import { defineType, defineField } from "sanity";

export default defineType({
  name: "paginaSpettacoliCopy",
  title: "Pagina Spettacoli — Copy",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "indice", title: "Indice /spettacoli" },
    { name: "archivio", title: "Archivio /spettacoli/archivio" },
  ],
  fields: [
    defineField({
      name: "heroFotoSfondo",
      title: "Hero — Foto sfondo",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "indice",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "indice",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "indice",
    }),
    defineField({
      name: "ctaArchivioDallIndice",
      title: "Testo CTA verso archivio (in fondo all'indice)",
      type: "string",
      group: "indice",
    }),

    defineField({
      name: "archivioEyebrow",
      title: "Eyebrow archivio",
      type: "string",
      group: "archivio",
    }),
    defineField({
      name: "archivioHeading",
      title: "Heading archivio",
      type: "string",
      group: "archivio",
    }),
    defineField({
      name: "archivioIntro",
      title: "Intro archivio",
      type: "text",
      rows: 3,
      group: "archivio",
    }),
  ],
  preview: { prepare: () => ({ title: "Pagina Spettacoli — Copy" }) },
});
