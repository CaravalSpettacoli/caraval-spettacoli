import { defineType, defineField } from "sanity";

export default defineType({
  name: "homepageHero",
  title: "Pagina Home — Immagine principale",
  type: "document",
  description:
    "Qui modifichi l'immagine grande in cima alla home, il titolo, il sottotitolo e i due pulsanti d'azione. Ricordati di premere Publish per salvare le modifiche.",
  fields: [
    defineField({
      name: "fotoSfondo",
      title: "Foto di sfondo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descrizione foto (per accessibilità)",
          type: "string",
          description:
            "Breve descrizione di cosa si vede nella foto. Serve per chi non può vedere l'immagine (es. lettori di schermo).",
        }),
      ],
      description:
        "Foto orizzontale grande che fa da sfondo alla parte alta della home. Formato consigliato: 1920x1080 pixel. Se lasci vuoto, lo sfondo resta nero.",
    }),
    defineField({
      name: "heading",
      title: "Titolo principale",
      type: "string",
      description: "Titolo grande visibile in cima alla home.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subheading",
      title: "Sottotitolo",
      type: "text",
      rows: 3,
      description: "Frase sotto al titolo (massimo 2 righe).",
    }),
    defineField({
      name: "ctaPrimariaTesto",
      title: "Primo pulsante — Testo",
      type: "string",
      description: 'Es. "Scopri gli spettacoli".',
    }),
    defineField({
      name: "ctaPrimariaLink",
      title: "Primo pulsante — Dove porta",
      type: "string",
      description: 'Indirizzo a cui rimanda. Es. "/spettacoli".',
    }),
    defineField({
      name: "ctaSecondariaTesto",
      title: "Secondo pulsante — Testo",
      type: "string",
      description: 'Es. "Festival Imaginarium".',
    }),
    defineField({
      name: "ctaSecondariaLink",
      title: "Secondo pulsante — Dove porta",
      type: "string",
      description: 'Indirizzo a cui rimanda. Es. "/imaginarium".',
    }),
  ],
  preview: { prepare: () => ({ title: "Pagina Home — Immagine principale" }) },
});
