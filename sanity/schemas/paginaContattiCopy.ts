import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "paginaContattiCopy",
  title: "Contatti — Copy pagina",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "aree", title: "Aree di contatto" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero — Eyebrow", type: "string", group: "hero", initialValue: "CONTATTI" }),
    defineField({ name: "heroHeading", title: "Hero — Heading", type: "string", group: "hero", initialValue: "Restiamo in contatto" }),
    defineField({
      name: "heroSottotitolo",
      title: "Hero — Sottotitolo",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue: "Per spettacoli, formazione, collaborazioni o solo per dirci ciao.",
    }),
    defineField({
      name: "heroFotoSfondo",
      title: "Hero — Foto sfondo",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
    }),
    defineField({
      name: "aree",
      title: "Aree di contatto",
      type: "array",
      group: "aree",
      of: [
        defineArrayMember({
          type: "object",
          name: "areaContatto",
          fields: [
            defineField({
              name: "icona",
              title: "Icona",
              type: "string",
              options: {
                list: [
                  { title: "Spettacolo (B2B)", value: "spettacolo" },
                  { title: "Formazione", value: "formazione" },
                  { title: "Fuoco", value: "fuoco" },
                  { title: "Generale", value: "generale" },
                ],
                layout: "radio",
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "titolo",
              title: "Titolo",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "descrizione",
              title: "Descrizione",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "referente",
              title: "Referente",
              type: "reference",
              to: [{ type: "membro" }],
              description: "Opzionale. Tel/email vengono presi dal referente se non fornisci override.",
            }),
            defineField({
              name: "telefonoOverride",
              title: "Telefono (override)",
              type: "string",
            }),
            defineField({
              name: "emailOverride",
              title: "Email (override)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "titolo", subtitle: "eyebrow", icon: "icona" },
            prepare: ({ title, subtitle, icon }) => ({
              title,
              subtitle: `[${icon}] ${subtitle ?? ""}`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Contatti — Copy pagina" }) },
});
