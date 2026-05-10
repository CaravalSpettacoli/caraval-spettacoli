import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "paginaOspitaCopy",
  title: "Ospita Caraval — Copy pagina",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "valore", title: "Valore proposto" },
    { name: "processo", title: "Come funziona" },
    { name: "testimonianze", title: "Testimonianze" },
    { name: "ingaggiato", title: "Hanno ingaggiato" },
    { name: "ctafinale", title: "CTA finale" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero — Eyebrow", type: "string", group: "hero", initialValue: "OSPITA CARAVAL" }),
    defineField({ name: "heroHeading", title: "Hero — Heading", type: "string", group: "hero", initialValue: "Porta il teatro nella tua piazza" }),
    defineField({
      name: "heroSottotitolo",
      title: "Hero — Sottotitolo",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue:
        "Un Comune, una Pro Loco, una dimora storica, un'associazione culturale. Caraval può portare uno spettacolo da te.",
    }),

    defineField({ name: "valorePropostoEyebrow", title: "Valore — Eyebrow", type: "string", group: "valore", initialValue: "PERCHÉ CARAVAL" }),
    defineField({ name: "valorePropostoHeading", title: "Valore — Heading", type: "string", group: "valore", initialValue: "Teatro che funziona, dove serve" }),
    defineField({
      name: "valorePropostoBody",
      title: "Valore — Body",
      type: "text",
      rows: 5,
      group: "valore",
      initialValue:
        "Lavoriamo da 6 anni con piazze, sagrati, cortili e teatri della Lombardia e oltre. Prosa contemporanea, teatro di fuoco, narrazione di strada. Il pubblico non si annoia mai. I committenti tornano l'anno dopo.",
    }),

    defineField({ name: "processoIngaggioEyebrow", title: "Processo — Eyebrow", type: "string", group: "processo", initialValue: "COME FUNZIONA" }),
    defineField({ name: "processoIngaggioHeading", title: "Processo — Heading", type: "string", group: "processo", initialValue: "Tre passi per averci da te" }),
    defineField({
      name: "processoIngaggioStep",
      title: "Processo — Step",
      type: "array",
      group: "processo",
      of: [
        defineArrayMember({
          type: "object",
          name: "stepIngaggio",
          fields: [
            defineField({ name: "numero", title: "Numero", type: "string", validation: (r) => r.required() }),
            defineField({ name: "titolo", title: "Titolo", type: "string", validation: (r) => r.required() }),
            defineField({ name: "descrizione", title: "Descrizione", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "titolo", subtitle: "numero" } },
        }),
      ],
      initialValue: [
        { _key: "step1", numero: "1", titolo: "Scrivici", descrizione: "Mandaci una mail con data, luogo e idea dell'evento. Anche solo un'intuizione, ti aiutiamo noi a strutturarla." },
        { _key: "step2", numero: "2", titolo: "Scegliamo lo spettacolo giusto", descrizione: "Ti proponiamo 1-2 spettacoli del nostro repertorio compatibili con il tuo spazio e il tuo pubblico. Valutiamo insieme." },
        { _key: "step3", numero: "3", titolo: "Veniamo a fare il sopralluogo", descrizione: "Tecnica, logistica, accoglienza. Ci occupiamo di tutto. Tu pensi solo alla piazza piena." },
      ],
    }),

    defineField({ name: "testimonianzeEyebrow", title: "Testimonianze — Eyebrow", type: "string", group: "testimonianze", initialValue: "DICONO DI NOI" }),
    defineField({ name: "testimonianzeHeading", title: "Testimonianze — Heading", type: "string", group: "testimonianze", initialValue: "Chi ci ha ospitato, lo racconta" }),
    defineField({
      name: "testimonianze",
      title: "Testimonianze (placeholder)",
      type: "array",
      group: "testimonianze",
      of: [
        defineArrayMember({
          type: "object",
          name: "testimonianza",
          fields: [
            defineField({ name: "citazione", title: "Citazione", type: "text", rows: 4, validation: (r) => r.required() }),
            defineField({ name: "autore", title: "Autore", type: "string" }),
            defineField({ name: "ente", title: "Ente / ruolo", type: "string" }),
          ],
          preview: { select: { title: "autore", subtitle: "ente" } },
        }),
      ],
      initialValue: [
        { _key: "t1", citazione: "Caraval è una compagnia che lavora con cura e professionalità. Lo spettacolo ha riempito la piazza di pubblico.", autore: "Mario Rossi", ente: "Sindaco, Comune di [Esempio]" },
        { _key: "t2", citazione: "Lavorare con Caraval è stato semplice e umano. Sono tornati l'anno successivo.", autore: "Anna Bianchi", ente: "Presidente, Pro Loco di [Esempio]" },
        { _key: "t3", citazione: "Hanno trasformato il nostro cortile in un teatro. Spettatori entusiasti.", autore: "Giorgio Verdi", ente: "Direttore, Dimora storica [Esempio]" },
      ],
    }),

    defineField({ name: "hannoIngaggiatoEyebrow", title: "Hanno ingaggiato — Eyebrow", type: "string", group: "ingaggiato", initialValue: "HANNO INGAGGIATO CARAVAL" }),
    defineField({
      name: "hannoIngaggiatoElenco",
      title: "Hanno ingaggiato — Elenco",
      type: "array",
      of: [{ type: "string" }],
      group: "ingaggiato",
      initialValue: [
        "Comune di Soncino",
        "Comune di Crema",
        "Pro Loco Soncino",
        "Festival X",
        "Festival Y",
        "Comune di Z",
      ],
    }),

    defineField({ name: "ctaFinaleHeading", title: "CTA finale — Heading", type: "string", group: "ctafinale", initialValue: "Pronto a portare Caraval da te?" }),
    defineField({
      name: "ctaFinaleBody",
      title: "CTA finale — Body",
      type: "text",
      rows: 3,
      group: "ctafinale",
      initialValue:
        "Scrivici. Ti rispondiamo entro 24 ore con una proposta su misura.",
    }),
  ],
  preview: { prepare: () => ({ title: "Ospita — Copy pagina" }) },
});
