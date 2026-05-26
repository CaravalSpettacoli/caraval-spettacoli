import { defineType, defineField, defineArrayMember } from "sanity";
import { seoOverrideFields, SEO_GROUP } from "./objects/seoFields";

export default defineType({
  name: "paginaContattiCopy",
  title: "Pagina Contatti",
  type: "document",
  description:
    "Qui modifichi i testi della pagina Contatti e le aree di contatto (spettacoli, formazione, ecc.). Ricordati di premere Publish per salvare.",
  groups: [
    { name: "hero", title: "🖼️ Parte alta della pagina" },
    { name: "aree", title: "📇 Aree di contatto" },
    SEO_GROUP,
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Sopratitolo piccolo",
      type: "string",
      group: "hero",
      description: 'Testo piccolo in alto, sopra al titolo (es. "CONTATTI").',
      initialValue: "CONTATTI",
    }),
    defineField({
      name: "heroHeading",
      title: "Titolo grande",
      type: "string",
      group: "hero",
      initialValue: "Restiamo in contatto",
    }),
    defineField({
      name: "heroSottotitolo",
      title: "Sottotitolo",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue: "Per spettacoli, formazione, collaborazioni o solo per dirci ciao.",
    }),
    defineField({
      name: "heroFotoSfondo",
      title: "Foto in cima alla pagina",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      description: "Foto orizzontale grande che fa da sfondo alla parte alta della pagina Contatti.",
      fields: [
        defineField({
          name: "alt",
          title: "Descrizione foto (per accessibilità)",
          type: "string",
        }),
      ],
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
              title: "Sopratitolo piccolo",
              type: "string",
              description: 'Testo piccolo sopra al titolo (es. "PER I TEATRI").',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "titolo",
              title: "Titolo dell'area",
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
              title: "Persona di riferimento",
              type: "reference",
              to: [{ type: "membro" }],
              description:
                "Opzionale. Se selezionata, telefono ed email vengono presi automaticamente dalla scheda della persona. Puoi sovrascriverli con i campi qui sotto.",
            }),
            defineField({
              name: "telefonoOverride",
              title: "Telefono (personalizzato)",
              type: "string",
              description:
                "Solo se vuoi mostrare un telefono diverso da quello della persona di riferimento.",
            }),
            defineField({
              name: "emailOverride",
              title: "Email (personalizzata)",
              type: "string",
              description:
                "Solo se vuoi mostrare un'email diversa da quella della persona di riferimento.",
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
    ...seoOverrideFields(),
  ],
  preview: { prepare: () => ({ title: "Pagina Contatti" }) },
});
