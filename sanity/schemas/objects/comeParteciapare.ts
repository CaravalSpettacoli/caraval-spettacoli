import { defineType, defineField } from "sanity";

export default defineType({
  name: "comeParteciapare",
  title: "Come partecipare",
  type: "object",
  fields: [
    defineField({
      name: "tipo",
      title: "Tipo accesso",
      type: "string",
      options: {
        list: [
          { title: "Biglietto a pagamento", value: "biglietto-pagamento" },
          { title: "Prenotazione gratuita", value: "prenotazione-gratuita" },
          { title: "Ingresso libero", value: "ingresso-libero" },
          { title: "Botteghino del teatro", value: "botteghino-teatro" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "urlBiglietti", title: "URL biglietti", type: "url" }),
    defineField({
      name: "prezzoLibero",
      title: "Prezzo (testo libero, es. \"8-15€\")",
      type: "string",
    }),
    defineField({ name: "noteAccesso", title: "Note accesso", type: "text", rows: 2 }),
  ],
});
