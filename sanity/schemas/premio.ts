import { defineType, defineField } from "sanity";

export default defineType({
  name: "premio",
  title: "Premio",
  type: "document",
  fields: [
    defineField({
      name: "anno",
      title: "Anno",
      type: "number",
      validation: (r) => r.required().min(1900).max(2100),
    }),
    defineField({
      name: "nomePremio",
      title: "Nome del premio",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rassegna",
      title: "Rassegna / contesto",
      type: "string",
      description: 'Es. "CremainScena", "Atelier Leà Milano"',
    }),
    defineField({
      name: "spettacoloAssociato",
      title: "Spettacolo associato",
      type: "reference",
      to: [{ type: "spettacolo" }],
    }),
    defineField({
      name: "motivazione",
      title: "Motivazione (estratto, max 15 parole consigliate)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ordineHomepage",
      title: "Ordine in homepage",
      type: "number",
      description: "Numero crescente: 1 = primo a sinistra",
    }),
    defineField({
      name: "mostraInHomepage",
      title: "Mostra in homepage",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Ordine homepage",
      name: "ordineHomepage",
      by: [{ field: "ordineHomepage", direction: "asc" }],
    },
    {
      title: "Anno (decrescente)",
      name: "annoDesc",
      by: [{ field: "anno", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      anno: "anno",
      nomePremio: "nomePremio",
      spettacolo: "spettacoloAssociato.titolo",
    },
    prepare({ anno, nomePremio, spettacolo }) {
      return {
        title: `${anno ?? "—"} · ${nomePremio ?? "Premio"}`,
        subtitle: spettacolo ?? undefined,
      };
    },
  },
});
