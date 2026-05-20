import { defineType, defineField } from "sanity";

export default defineType({
  name: "evento",
  title: "Eventi (date manuali)",
  type: "document",
  description:
    "Date specifiche degli spettacoli del repertorio. NON usare per Imaginarium — quello è gestito da spettacoloImaginarium.",
  groups: [
    { name: "principale", title: "Principale", default: true },
    { name: "homepage", title: "Homepage (Prossimi eventi)" },
  ],
  fields: [
    defineField({
      name: "spettacolo",
      title: "Spettacolo",
      type: "reference",
      to: [{ type: "spettacolo" }],
      validation: (r) => r.required(),
      group: "principale",
    }),
    defineField({
      name: "dataOra",
      title: "Data e ora",
      type: "datetime",
      validation: (r) => r.required(),
      group: "principale",
    }),
    defineField({
      name: "luogo",
      title: "Luogo",
      type: "luogo",
      validation: (r) => r.required(),
      group: "principale",
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
      group: "principale",
    }),
    defineField({
      name: "urlBiglietti",
      title: "URL biglietteria",
      type: "url",
      hidden: ({ parent }) => parent?.modalitaAccesso !== "linkEsterno",
      group: "principale",
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 2,
      description: 'Es. "Ridotto under 26: 8€"',
      group: "principale",
    }),
    defineField({
      name: "mostraInCalendario",
      title: "Mostra in calendario",
      type: "boolean",
      initialValue: true,
      group: "principale",
    }),

    // ----------------- Homepage (Prossimi eventi) -----------------
    defineField({
      name: "descrizioneBreve",
      title: "Descrizione breve (per card homepage)",
      type: "text",
      rows: 2,
      description: "Max 150 caratteri consigliati per la card homepage.",
      validation: (r) =>
        r
          .max(200)
          .warning(
            "Meglio sotto 150 caratteri per leggibilità nella card homepage"
          ),
      group: "homepage",
    }),
    defineField({
      name: "mostraInHomepage",
      title: 'Mostra nella sezione "Prossimi eventi" della homepage',
      type: "boolean",
      initialValue: true,
      description:
        "Se attivo, l'evento appare nella sezione homepage finché la data è futura.",
      group: "homepage",
    }),
    defineField({
      name: "ordinePriorita",
      title: "Ordine priorità (opzionale)",
      type: "number",
      description:
        "Se compilato, sovrascrive l'ordine cronologico. Numero più basso = visualizzato prima.",
      validation: (r) => r.min(0).max(999),
      group: "homepage",
    }),
    defineField({
      name: "ctaTipo",
      title: "Tipo CTA (sezione homepage)",
      type: "string",
      options: {
        list: [
          { title: "Default — link a /contatti", value: "default" },
          { title: "Link esterno (URL)", value: "link" },
          { title: "Numero di telefono", value: "telefono" },
          { title: "Email", value: "email" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      group: "homepage",
    }),
    defineField({
      name: "ctaValore",
      title: "Valore CTA",
      type: "string",
      description:
        'URL completo, numero telefono, o email. Lascia vuoto se tipo "default" (porta a /contatti).',
      hidden: ({ parent }) =>
        !parent?.ctaTipo || parent.ctaTipo === "default",
      group: "homepage",
    }),
    defineField({
      name: "ctaLabel",
      title: "Etichetta CTA (opzionale)",
      type: "string",
      description:
        'Testo del bottone. Default: "Prenota" (link), "Chiama" (telefono), "Scrivi" (email), "Contattaci" (default).',
      validation: (r) => r.max(30),
      group: "homepage",
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
