import { defineType, defineField } from "sanity";

export default defineType({
  name: "luogo",
  title: "Luogo",
  type: "object",
  fields: [
    defineField({
      name: "nomeStruttura",
      title: "Nome struttura",
      type: "string",
      description: 'Es. "Rocca Sforzesca", "Teatro Aldo Moro", "Castel Giardino Il Fagiolo".',
    }),
    defineField({
      name: "indirizzo",
      title: "Indirizzo",
      type: "string",
      description: "Via e numero civico, se disponibili.",
    }),
    defineField({
      name: "citta",
      title: "Città",
      type: "string",
      description: 'Es. "Soncino", "Orzinuovi".',
    }),
    defineField({
      name: "provincia",
      title: "Provincia (sigla 2 lettere)",
      type: "string",
      validation: (r) => r.max(2).uppercase(),
    }),
    defineField({ name: "coordinate", title: "Coordinate (geopoint)", type: "geopoint" }),
  ],
});
