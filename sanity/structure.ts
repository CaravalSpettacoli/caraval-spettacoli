import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Caraval Spettacoli")
    .items([
      S.listItem()
        .title("Impostazioni sito")
        .id("impostazioniSito")
        .child(
          S.document()
            .schemaType("impostazioniSito")
            .documentId("impostazioniSito")
        ),
      S.divider(),
      S.documentTypeListItem("spettacolo").title("Spettacoli"),
      S.documentTypeListItem("evento").title("Eventi (calendario)"),
      S.divider(),
      S.documentTypeListItem("edizioneImaginarium").title("Edizioni Imaginarium"),
      S.documentTypeListItem("spettacoloImaginarium").title("Spettacoli Imaginarium"),
      S.divider(),
      S.documentTypeListItem("corso").title("Corsi (formazione)"),
      S.documentTypeListItem("membro").title("Membri compagnia"),
      S.divider(),
      S.listItem()
        .title("Pagina — Chi siamo")
        .id("paginaChiSiamo")
        .child(
          S.document()
            .schemaType("paginaChiSiamo")
            .documentId("paginaChiSiamo")
        ),
      S.listItem()
        .title("Pagina — Ospita")
        .id("paginaOspita")
        .child(
          S.document()
            .schemaType("paginaOspita")
            .documentId("paginaOspita")
        ),
    ]);
