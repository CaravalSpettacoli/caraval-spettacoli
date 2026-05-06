import { defineType, defineField } from "sanity";

export default defineType({
  name: "luogo",
  title: "Luogo",
  type: "object",
  fields: [
    defineField({ name: "nomeStruttura", title: "Nome struttura", type: "string" }),
    defineField({ name: "indirizzo", title: "Indirizzo", type: "string" }),
    defineField({ name: "citta", title: "Città", type: "string" }),
    defineField({
      name: "provincia",
      title: "Provincia (sigla 2 lettere)",
      type: "string",
      validation: (r) => r.max(2).uppercase(),
    }),
    defineField({ name: "coordinate", title: "Coordinate (geopoint)", type: "geopoint" }),
  ],
});
