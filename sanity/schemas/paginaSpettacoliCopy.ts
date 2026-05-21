import { defineType, defineField } from "sanity";
import { seoOverrideFields, SEO_GROUP } from "./objects/seoFields";

export default defineType({
  name: "paginaSpettacoliCopy",
  title: "Pagina Spettacoli",
  type: "document",
  description:
    "Qui modifichi i testi della pagina che elenca tutti gli spettacoli. La sezione Archivio mostra i lavori passati. Ricordati di premere Publish per salvare.",
  groups: [
    { name: "hero", title: "🖼️ Parte alta della pagina" },
    { name: "indice", title: "📋 Indice spettacoli" },
    { name: "archivio", title: "🗄️ Archivio spettacoli" },
    SEO_GROUP,
  ],
  fields: [
    defineField({
      name: "heroFotoSfondo",
      title: "Foto in cima alla pagina",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      description:
        "Foto orizzontale grande che fa da sfondo alla parte alta della pagina Spettacoli.",
      fields: [
        defineField({
          name: "alt",
          title: "Descrizione foto (per accessibilità)",
          type: "string",
        }),
      ],
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
    ...seoOverrideFields(),
  ],
  preview: { prepare: () => ({ title: "Pagina Spettacoli — Copy" }) },
});
