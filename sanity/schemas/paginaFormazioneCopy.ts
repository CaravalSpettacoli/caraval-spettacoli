import { defineType, defineField } from "sanity";
import { seoOverrideFields, SEO_GROUP } from "./objects/seoFields";

export default defineType({
  name: "paginaFormazioneCopy",
  title: "Pagina Formazione",
  type: "document",
  groups: [
    { name: "faq", title: "❓ Domande frequenti" },
    SEO_GROUP,
  ],
  fields: [
    defineField({
      name: "faq",
      title: "Domande frequenti (FAQ)",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "faq",
      description:
        "Domande e risposte mostrate in fondo alla pagina. Aiutano anche la visibilità su Google. Puoi modificarle, aggiungerne o rimuoverle.",
    }),
    ...seoOverrideFields(),
  ],
  preview: { prepare: () => ({ title: "Pagina Formazione — FAQ" }) },
});
