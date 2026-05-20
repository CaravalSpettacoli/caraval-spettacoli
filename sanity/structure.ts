import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Caraval Spettacoli")
    .items([
      // ⚙️ Impostazioni sito (singleton, primo per coming-soon toggle)
      S.listItem()
        .title("⚙️ Impostazioni sito")
        .id("impostazioniSito")
        .child(
          S.document()
            .schemaType("impostazioniSito")
            .documentId("impostazioniSito")
            .title("Impostazioni sito")
        ),
      S.divider(),

      // ➕ Contenuti creabili — clicca su una voce e poi sul "+" in alto a destra per aggiungere
      S.documentTypeListItem("spettacolo").title("🎭 Spettacoli"),
      S.documentTypeListItem("membro").title("👤 Membri compagnia"),
      S.documentTypeListItem("evento").title("🗓️ Eventi (calendario)"),
      S.documentTypeListItem("premio").title("🏆 Premi"),
      S.documentTypeListItem("corso").title("📚 Corsi (formazione)"),
      S.divider(),

      // ✨ Imaginarium
      S.documentTypeListItem("edizioneImaginarium").title("✨ Edizioni Imaginarium"),
      S.documentTypeListItem("spettacoloImaginarium").title("🎪 Spettacoli Imaginarium"),
      S.divider(),

      // 📄 Copy pagine (singleton — modifica testi statici)
      S.listItem()
        .title("🏠 Homepage — Hero")
        .id("homepageHero")
        .child(
          S.document().schemaType("homepageHero").documentId("homepageHero")
        ),
      S.listItem()
        .title("🏠 Homepage — Copy sezioni")
        .id("homepageCopy")
        .child(
          S.document().schemaType("homepageCopy").documentId("homepageCopy")
        ),
      S.listItem()
        .title("📄 Pagina Spettacoli — Copy")
        .id("paginaSpettacoliCopy")
        .child(
          S.document()
            .schemaType("paginaSpettacoliCopy")
            .documentId("paginaSpettacoliCopy")
        ),
      S.listItem()
        .title("📄 Pagina Imaginarium — Copy")
        .id("paginaImaginariumCopy")
        .child(
          S.document()
            .schemaType("paginaImaginariumCopy")
            .documentId("paginaImaginariumCopy")
        ),
      S.listItem()
        .title("📄 Pagina Chi siamo — Copy")
        .id("paginaChiSiamoCopy")
        .child(
          S.document()
            .schemaType("paginaChiSiamoCopy")
            .documentId("paginaChiSiamoCopy")
        ),
      S.listItem()
        .title("📄 Pagina Contatti — Copy")
        .id("paginaContattiCopy")
        .child(
          S.document()
            .schemaType("paginaContattiCopy")
            .documentId("paginaContattiCopy")
        ),
      S.listItem()
        .title("📄 Pagina Ospita — Copy")
        .id("paginaOspitaCopy")
        .child(
          S.document()
            .schemaType("paginaOspitaCopy")
            .documentId("paginaOspitaCopy")
        ),
      S.divider(),

      // Legacy pagina docs (singleton)
      S.listItem()
        .title("Pagina — Chi siamo (legacy)")
        .id("paginaChiSiamo")
        .child(
          S.document()
            .schemaType("paginaChiSiamo")
            .documentId("paginaChiSiamo")
        ),
      S.listItem()
        .title("Pagina — Ospita (legacy)")
        .id("paginaOspita")
        .child(
          S.document()
            .schemaType("paginaOspita")
            .documentId("paginaOspita")
        ),
    ]);
