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
      name: "seoDefault",
      title: "SEO default",
      type: "object",
      fields: [
        defineField({ name: "defaultTitle", title: "Default title", type: "string" }),
        defineField({ name: "defaultDescription", title: "Default description", type: "text" }),
        defineField({
          name: "defaultOgImage",
          title: "Default OG image",
          type: "image",
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Impostazioni sito" }) },
});
