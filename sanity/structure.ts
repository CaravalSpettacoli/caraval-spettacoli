import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Caraval Spettacoli")
    .items([
      // ===== 1. PUBBLICAZIONE & IMPOSTAZIONI =====
      S.listItem()
        .title("🚀 Pubblicazione sito")
        .id("impostazioniSito")
        .child(
          S.document()
            .schemaType("impostazioniSito")
            .documentId("impostazioniSito")
            .title("Pubblicazione e impostazioni")
        ),
      S.divider(),

      // ===== 2. CONTENUTI CREABILI =====
      // Clicca una voce e poi il pulsante "+" in alto a destra per aggiungere
      // un nuovo elemento.
      S.documentTypeListItem("spettacolo").title("🎭 Spettacoli"),
      S.documentTypeListItem("membro").title("👥 Membri della compagnia"),
      S.documentTypeListItem("spettacoloImaginarium").title("🎪 Spettacoli Imaginarium"),
      S.documentTypeListItem("edizioneImaginarium").title("✨ Edizioni Imaginarium"),
      S.documentTypeListItem("premio").title("🏆 Premi e riconoscimenti"),
      S.documentTypeListItem("corso").title("📚 Corsi (formazione)"),
      S.documentTypeListItem("evento").title("📅 Eventi e date"),
      S.divider(),

      // ===== 3. TESTI DELLE PAGINE =====
      // Ogni voce raccoglie tutti i testi e le immagini di una pagina del sito.
      S.listItem()
        .title("🏠 Pagina Home")
        .id("paginaHomeGroup")
        .child(
          S.list()
            .title("Pagina Home")
            .items([
              S.listItem()
                .title("🖼️ Immagine principale (in cima alla pagina)")
                .child(
                  S.document()
                    .schemaType("homepageHero")
                    .documentId("homepageHero")
                    .title("Immagine principale")
                ),
              S.listItem()
                .title("📝 Testi delle sezioni della home")
                .child(
                  S.document()
                    .schemaType("homepageCopy")
                    .documentId("homepageCopy")
                    .title("Testi della home")
                ),
            ])
        ),
      S.listItem()
        .title("📄 Pagina Spettacoli")
        .id("paginaSpettacoliCopy")
        .child(
          S.document()
            .schemaType("paginaSpettacoliCopy")
            .documentId("paginaSpettacoliCopy")
            .title("Pagina Spettacoli")
        ),
      S.listItem()
        .title("📄 Pagina Imaginarium")
        .id("paginaImaginariumCopy")
        .child(
          S.document()
            .schemaType("paginaImaginariumCopy")
            .documentId("paginaImaginariumCopy")
            .title("Pagina Imaginarium")
        ),
      S.listItem()
        .title("📄 Pagina Chi siamo")
        .id("paginaChiSiamoCopy")
        .child(
          S.document()
            .schemaType("paginaChiSiamoCopy")
            .documentId("paginaChiSiamoCopy")
            .title("Pagina Chi siamo")
        ),
      S.listItem()
        .title("📄 Pagina Contatti")
        .id("paginaContattiCopy")
        .child(
          S.document()
            .schemaType("paginaContattiCopy")
            .documentId("paginaContattiCopy")
            .title("Pagina Contatti")
        ),
      S.listItem()
        .title("📄 Pagina Ospita Caraval")
        .id("paginaOspitaCopy")
        .child(
          S.document()
            .schemaType("paginaOspitaCopy")
            .documentId("paginaOspitaCopy")
            .title("Pagina Ospita Caraval")
        ),
    ]);
