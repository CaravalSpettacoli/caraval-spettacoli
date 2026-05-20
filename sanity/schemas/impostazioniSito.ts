import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "impostazioniSito",
  title: "Impostazioni sito",
  type: "document",
  fields: [
    defineField({
      name: "homepageHero",
      title: "Hero homepage",
      type: "object",
      fields: [
        defineField({ name: "titoloPrincipale", title: "Titolo principale", type: "string" }),
        defineField({ name: "sottotitolo", title: "Sottotitolo", type: "text", rows: 3 }),
        defineField({
          name: "immagineHero",
          title: "Immagine hero",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "videoHero",
          title: "Video hero",
          type: "file",
          options: { accept: "video/*" },
        }),
        defineField({
          name: "ctaPrincipale",
          title: "CTA principale",
          type: "object",
          fields: [
            defineField({ name: "testo", title: "Testo", type: "string" }),
            defineField({ name: "link", title: "Link", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "homepageBlocchi",
      title: "Blocchi homepage",
      type: "object",
      fields: [
        defineField({
          name: "mostraProssimiEventi",
          title: "Mostra prossimi eventi",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "numeroProssimiEventi",
          title: "Numero prossimi eventi",
          type: "number",
          initialValue: 4,
        }),
        defineField({
          name: "spettacoliInEvidenza",
          title: "Spettacoli in evidenza (max 3)",
          type: "array",
          of: [defineArrayMember({ type: "reference", to: [{ type: "spettacolo" }] })],
          validation: (r) => r.max(3),
        }),
        defineField({
          name: "mostraTeaserImaginarium",
          title: "Mostra teaser Imaginarium",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "mostraTeaserOspita",
          title: "Mostra teaser Ospita",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "contattiPubblici",
      title: "Contatti pubblici",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "telefono", title: "Telefono associativo", type: "string" }),
        defineField({
          name: "telefonoVeraDiretto",
          title: "Telefono Vera (formazione)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "piattaforma",
              title: "Piattaforma",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
                ],
              },
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
            defineField({
              name: "mostraInHeader",
              title: "Mostra in header",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "mostraInFooter",
              title: "Mostra in footer",
              type: "boolean",
              initialValue: true,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "datiAssociazione",
      title: "Dati associazione",
      type: "object",
      fields: [
        defineField({ name: "ragioneSociale", title: "Ragione sociale", type: "string" }),
        defineField({ name: "partitaIva", title: "Partita IVA", type: "string" }),
        defineField({ name: "codiceFiscale", title: "Codice fiscale", type: "string" }),
        defineField({ name: "indirizzo", title: "Indirizzo", type: "string" }),
        defineField({ name: "citta", title: "Città", type: "string" }),
        defineField({ name: "cap", title: "CAP", type: "string" }),
        defineField({ name: "provincia", title: "Provincia", type: "string" }),
        defineField({ name: "pec", title: "PEC", type: "string" }),
        defineField({ name: "sdi", title: "SDI", type: "string" }),
      ],
    }),
    defineField({
      name: "featureFlags",
      title: "Visibilità sezioni sito",
      type: "object",
      description:
        "Toggle on/off per sezioni che possono essere attivate o disattivate in modo non distruttivo.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "mostraCalendario",
          title: "Mostra pagina Calendario",
          type: "boolean",
          initialValue: false,
          description:
            "Se attivo, /calendario è accessibile e appare nel menu header/footer. Se disattivato (default), la pagina restituisce 404 e la voce è nascosta. La sezione 'Prossimi eventi' della homepage rimane sempre visibile a parte.",
        }),
      ],
    }),
    defineField({
      name: "seoDefault",
      title: "SEO default",
      type: "object",
      description:
        "Titolo, description e immagine usati come default su tutte le pagine. Keywords + geo + canonical configurabili sotto.",
      fields: [
        defineField({
          name: "defaultTitle",
          title: "Default title (max 70 char)",
          type: "string",
          initialValue:
            "Caraval Spettacoli — Compagnia teatrale di Soncino, Cremona",
          validation: (r) => r.max(70),
        }),
        defineField({
          name: "defaultDescription",
          title: "Default description (max 170 char)",
          type: "text",
          rows: 3,
          initialValue:
            "Caraval Spettacoli è la compagnia teatrale di Soncino (Cremona). Prosa, teatro di fuoco, performance di strada. Festival Imaginarium ogni anno.",
          validation: (r) => r.max(170),
        }),
        defineField({
          name: "defaultOgImage",
          title: "Default OG image (1200x630)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "keywords",
          title: "Keywords (focus geografico Lombardia)",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          initialValue: [
            "compagnia teatrale Soncino",
            "compagnia teatrale Cremona",
            "compagnia teatrale Brescia",
            "compagnia teatrale Lombardia",
            "teatro di fuoco Soncino",
            "spettacoli teatro fuoco Cremona",
            "spettacoli prosa Soncino",
            "spettacoli teatrali Lombardia",
            "festival teatro Soncino",
            "Imaginarium Soncino festival",
            "corsi recitazione Soncino",
            "corsi recitazione Cremona",
            "laboratori teatro scuole Cremona",
            "spettacoli teatro strada Brescia",
            "compagnia ingaggio teatro Cremona",
          ],
        }),
        defineField({
          name: "geoLat",
          title: "Latitudine sede (Soncino default)",
          type: "number",
          initialValue: 45.4017,
        }),
        defineField({
          name: "geoLon",
          title: "Longitudine sede",
          type: "number",
          initialValue: 9.8693,
        }),
        defineField({
          name: "canonicalBaseUrl",
          title: "Base URL canonical (es. https://caraval.it)",
          type: "url",
          initialValue: "https://caraval.it",
        }),
      ],
    }),
    defineField({
      name: "comingSoon",
      title: "Coming Soon (modalità pre-lancio)",
      type: "object",
      description:
        "Se attivo, tutto il sito reindirizza a /coming-soon. Lo Studio /studio resta sempre accessibile. Disattivalo quando il sito è pronto per il go-live.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "attivo",
          title: "Coming Soon attivo",
          type: "boolean",
          initialValue: true,
          description:
            "Switch master. ON = sito chiuso al pubblico, OFF = sito live.",
        }),
        defineField({
          name: "titolo",
          title: "Titolo coming-soon",
          type: "string",
          initialValue: "Stiamo arrivando",
        }),
        defineField({
          name: "sottotitolo",
          title: "Sottotitolo",
          type: "text",
          rows: 2,
          initialValue:
            "Il nuovo sito di Caraval Spettacoli sarà online a breve. Restate sintonizzati.",
        }),
        defineField({
          name: "dataLancio",
          title: "Data lancio prevista (opzionale)",
          type: "datetime",
          description:
            "Se valorizzata, sotto il sottotitolo appare un countdown.",
        }),
        defineField({
          name: "fotoSfondo",
          title: "Foto sfondo coming-soon",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "iubenda",
      title: "Iubenda (cookie banner + privacy)",
      type: "object",
      description:
        "Codici Iubenda. Lascia vuoto finché non hai gli ID reali — il banner non viene caricato se siteId vuoto.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "cookieBannerSiteId",
          title: "Iubenda Cookie Banner Site ID",
          type: "string",
          description: "Numerico, generato da Iubenda (es. 1234567).",
        }),
        defineField({
          name: "cookiePolicyId",
          title: "Iubenda Cookie Policy ID",
          type: "string",
        }),
        defineField({
          name: "privacyPolicyUrl",
          title: "URL Privacy Policy Iubenda",
          type: "url",
        }),
        defineField({
          name: "cookiePolicyUrl",
          title: "URL Cookie Policy Iubenda",
          type: "url",
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Impostazioni sito" }) },
});
