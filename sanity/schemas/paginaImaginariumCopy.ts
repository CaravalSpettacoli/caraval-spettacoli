import { defineType, defineField } from "sanity";

export default defineType({
  name: "paginaImaginariumCopy",
  title: "Imaginarium — Copy pagina",
  type: "document",
  groups: [
    { name: "counter", title: "Counter (totali festival)" },
    { name: "video", title: "Video presentazione" },
  ],
  fields: [
    defineField({
      name: "videoEyebrow",
      title: "Video — Eyebrow",
      type: "string",
      group: "video",
      initialValue: "GUARDA",
    }),
    defineField({
      name: "videoHeading",
      title: "Video — Heading",
      type: "string",
      group: "video",
      initialValue: "Imaginarium in due minuti",
    }),
    defineField({
      name: "videoYoutubeUrl",
      title: "Video — URL YouTube",
      type: "url",
      group: "video",
      description:
        "URL completo (youtube.com/watch?v=… o youtu.be/…). Se vuoto la sezione non viene mostrata.",
    }),
    defineField({
      name: "counterEyebrow",
      title: "Counter — Eyebrow",
      type: "string",
      group: "counter",
      initialValue: "IMAGINARIUM IN NUMERI",
    }),
    defineField({
      name: "counterElenco",
      title: "Counter — Elenco numeri",
      type: "array",
      group: "counter",
      description:
        "Totali cumulativi di tutte le edizioni del festival, non per singola edizione.",
      of: [
        {
          type: "object",
          name: "counterItem",
          fields: [
            { name: "valore", title: "Valore", type: "string", validation: (R) => R.required() },
            { name: "etichetta", title: "Etichetta", type: "string", validation: (R) => R.required() },
          ],
          preview: {
            select: { v: "valore", e: "etichetta" },
            prepare: ({ v, e }) => ({ title: `${v} — ${e}` }),
          },
        },
      ],
      initialValue: [
        { valore: "3", etichetta: "edizioni" },
        { valore: "18", etichetta: "spettacoli ospitati" },
        { valore: "12", etichetta: "compagnie" },
        { valore: "2.500+", etichetta: "spettatori" },
      ],
      validation: (R) => R.max(6),
    }),
  ],
  preview: { prepare: () => ({ title: "Imaginarium — Copy pagina" }) },
});
