import { defineType, defineField } from "sanity";

export default defineType({
  name: "evento",
  title: "Eventi (date manuali)",
  type: "document",
  description:
    "Date specifiche degli spettacoli del repertorio. NON usare per Imaginarium — quello è gestito da spettacoloImaginarium.",
  fields: [
    defineField({
      name: "spettacolo",
      title: "Spettacolo",
      type: "reference",
      to: [{ type: "spettacolo" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "dataOra",
      title: "Data e ora",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "luogo",
      title: "Luogo",
      type: "luogo",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "modalitaAccesso",
      title: "Modalità accesso",
      type: "string",
      options: {
        list: [
          { title: "Link biglietteria esterna", value: "linkEsterno" },
          { title: "Prenotazione via mail/telefono", value: "prenotazione" },
          { title: "Ingresso libero", value: "ingressoLibero" },
          { title: "Botteghino al teatro", value: "botteghino" },
        ],
        layout: "radio",
      },
      initialValue: "prenotazione",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "urlBiglietti",
      title: "URL biglietteria",
      type: "url",
      hidden: ({ parent }) => parent?.modalitaAccesso !== "linkEsterno",
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 2,
      description: 'Es. "Ridotto under 26: 8€"',
    }),
    defineField({
      name: "mostraInCalendario",
      title: "Mostra in calendario",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      titolo: "spettacolo.titolo",
      data: "dataOra",
      citta: "luogo.citta",
    },
    prepare({ titolo, data, citta }) {
      const formattedDate = data
        ? new Date(data).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
          })
        : "?";
      return {
        title: titolo || "Evento senza spettacolo",
        subtitle: `${formattedDate} · ${citta || "?"}`,
      };
    },
  },
});
