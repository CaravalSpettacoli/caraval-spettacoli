import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "edizioneImaginarium",
  title: "Edizione Imaginarium",
  type: "document",
  fields: [
    defineField({
      name: "anno",
      title: "Anno",
      type: "number",
      validation: (r) => r.required().min(2000).max(2100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: (doc) => String(doc.anno ?? "") },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "corrente",
      title: "Edizione corrente",
      type: "boolean",
      initialValue: false,
      description: "Solo una edizione può essere corrente",
      validation: (r) =>
        r.custom(async (value, ctx) => {
          if (!value) return true;
          const client = ctx.getClient({ apiVersion: "2024-01-01" });
          const id = ctx.document?._id?.replace(/^drafts\./, "");
          const others = await client.fetch(
            `*[_type == "edizioneImaginarium" && corrente == true && !(_id in [$id, "drafts." + $id])][0]`,
            { id }
          );
          return others ? "Esiste già un'edizione corrente" : true;
        }),
    }),
    defineField({
      name: "mostraInHomepage",
      title: "Mostra in homepage (preview Imaginarium)",
      type: "boolean",
      initialValue: false,
      description:
        "Tipicamente sincronizzato con `corrente`. Se più edizioni hanno questo flag attivo, viene scelta quella con anno più recente.",
    }),
    defineField({ name: "titoloEdizione", title: "Titolo edizione", type: "string" }),
    defineField({ name: "tema", title: "Tema", type: "string" }),
    defineField({
      name: "dataInizio",
      title: "Data inizio",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "dataFine",
      title: "Data fine",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "locationPrincipale",
      title: "Location principale",
      type: "string",
      description: 'Es. "Rocca Sforzesca, Soncino"',
    }),
    defineField({
      name: "descrizione",
      title: "Descrizione",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "descrizioneBreve",
      title: "Descrizione breve (1 riga)",
      type: "text",
      rows: 2,
      description:
        "Per i box edizioni passate. Se vuoto, viene mostrato \"Programma in caricamento\".",
    }),
    defineField({
      name: "immagineCover",
      title: "Immagine cover",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Testo alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "locandina",
      title: "Locandina",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "programmaPdf",
      title: "Programma (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "patrocinio",
      title: "Patrocinio (lista)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "sponsor",
      title: "Sponsor (lista)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "partnerLista",
      title: "Partner (lista)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "partner",
      title: "Partner / sponsor / patrocini (legacy con loghi)",
      type: "array",
      description:
        "CAMPO DEPRECATO — usa patrocinio/sponsor/partnerLista. Mantenuto per quando arriveranno i loghi.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "nome", title: "Nome", type: "string" }),
            defineField({
              name: "tipo",
              title: "Tipo",
              type: "string",
              options: {
                list: [
                  { title: "Patrocinio", value: "patrocinio" },
                  { title: "Sponsor", value: "sponsor" },
                  { title: "Partner", value: "partner" },
                ],
              },
            }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "anno", subtitle: "titoloEdizione", media: "immagineCover" },
    prepare({ title, subtitle }) {
      return { title: `Imaginarium ${title}`, subtitle };
    },
  },
  orderings: [
    {
      title: "Anno (decrescente)",
      name: "annoDesc",
      by: [{ field: "anno", direction: "desc" }],
    },
  ],
});
