import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "impostazioniSito",
  title: "Impostazioni sito",
  type: "document",
  fields: [
    defineField({
      name: "notaInformativa",
      title: "ℹ️ Come usare questa pagina",
      type: "string",
      readOnly: true,
      initialValue:
        "Qui gestisci la pubblicazione del sito e le impostazioni generali (contatti, dati associazione, social). Per mettere online il sito a tutti, disattiva la modalità Coming Soon qui sotto.",
    }),
    defineField({
      name: "comingSoon",
      title: "🚀 Coming Soon (pubblicazione sito)",
      type: "object",
      description:
        "⚠️ Quando ATTIVO (verde), tutti i visitatori vedono solo la pagina 'Stiamo arrivando'. DISATTIVA questo interruttore quando vuoi pubblicare il sito completo e renderlo visibile a tutti. Lo Studio (/studio) resta sempre accessibile.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "attivo",
          title: "Sito in modalità Coming Soon",
          type: "boolean",
          initialValue: true,
          description:
            "ON (verde) = i visitatori vedono solo la pagina 'Stiamo arrivando'. OFF = sito pubblico e visibile a tutti.",
        }),
        defineField({
          name: "titolo",
          title: "Titolo pagina coming-soon",
          type: "string",
          initialValue: "Stiamo arrivando",
          description: "Titolo grande visibile in cima alla pagina coming-soon.",
        }),
        defineField({
          name: "sottotitolo",
          title: "Sottotitolo / messaggio",
          type: "text",
          rows: 2,
          initialValue:
            "Il nuovo sito di Caraval Spettacoli sarà online a breve. Restate sintonizzati.",
          description: "Frase sotto al titolo. Tieni breve (max 2 righe).",
        }),
        defineField({
          name: "dataLancio",
          title: "Data lancio prevista (opzionale)",
          type: "datetime",
          description:
            "Se valorizzata, sotto il sottotitolo appare un countdown automatico.",
        }),
        defineField({
          name: "fotoSfondo",
          title: "Foto sfondo coming-soon",
          type: "image",
          options: { hotspot: true },
          description: "Foto di sfondo della pagina coming-soon. Formato orizzontale 16:9 consigliato.",
        }),
      ],
    }),
    defineField({
      name: "homepageHero",
      title: "Pagina Home — Impostazioni rapide",
      type: "object",
      description:
        "Impostazioni rapide della parte alta della home. Per modifiche più approfondite usa la voce \"Pagina Home → Immagine principale\" nel menu laterale.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "titoloPrincipale", title: "Titolo principale", type: "string" }),
        defineField({ name: "sottotitolo", title: "Sottotitolo", type: "text", rows: 3 }),
        defineField({
          name: "immagineHero",
          title: "Immagine in cima alla pagina",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "videoHero",
          title: "Video in cima alla pagina",
          type: "file",
          options: { accept: "video/*" },
        }),
        defineField({
          name: "ctaPrincipale",
          title: "Pulsante principale",
          type: "object",
          fields: [
            defineField({ name: "testo", title: "Testo del pulsante", type: "string" }),
            defineField({
              name: "link",
              title: "Dove porta il pulsante",
              type: "string",
              description: 'Indirizzo interno (es. "/spettacoli") o URL completo.',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "homepageBlocchi",
      title: "Sezioni visibili in home",
      type: "object",
      description:
        "Quali blocchi mostrare/nascondere nella pagina principale e i loro parametri.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "mostraProssimiEventi",
          title: 'Mostra la sezione "Prossimi eventi"',
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "numeroProssimiEventi",
          title: "Quanti eventi mostrare",
          type: "number",
          initialValue: 4,
          description: "Numero massimo di eventi visibili nella sezione 'Prossimi eventi'.",
        }),
        defineField({
          name: "spettacoliInEvidenza",
          title: "Spettacoli in evidenza (massimo 3)",
          type: "array",
          of: [defineArrayMember({ type: "reference", to: [{ type: "spettacolo" }] })],
          validation: (r) => r.max(3),
        }),
        defineField({
          name: "mostraTeaserImaginarium",
          title: 'Mostra il blocco "Imaginarium" in home',
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "mostraTeaserOspita",
          title: 'Mostra il blocco "Ospita Caraval" in home',
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "contattiPubblici",
      title: "Contatti pubblici (visibili sul sito)",
      type: "object",
      description: "Email e telefono mostrati sul sito (footer, pagina contatti, ecc.).",
      fields: [
        defineField({
          name: "email",
          title: "Email pubblica",
          type: "string",
          description: "Email principale visibile sul sito.",
        }),
        defineField({
          name: "telefono",
          title: "Telefono dell'associazione",
          type: "string",
          description: "Telefono generico mostrato nei contatti.",
        }),
        defineField({
          name: "telefonoVeraDiretto",
          title: "Telefono diretto (sezione Formazione)",
          type: "string",
          description: "Telefono diretto del referente della formazione.",
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Profili social",
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
            defineField({
              name: "url",
              title: "Indirizzo (URL completo)",
              type: "url",
              description: "Es. https://www.instagram.com/caravalspettacoli/",
            }),
            defineField({
              name: "mostraInHeader",
              title: "Mostra nel menu in alto",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "mostraInFooter",
              title: "Mostra in fondo al sito (footer)",
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
      title: "Sezioni del sito attivabili/disattivabili",
      type: "object",
      description:
        "Interruttori per accendere o spegnere alcune sezioni del sito senza cancellarne i contenuti.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "mostraCalendario",
          title: "Mostra la pagina Calendario",
          type: "boolean",
          initialValue: false,
          description:
            "Se attivo, la pagina Calendario è accessibile dal menu. Se spento (impostazione predefinita), la pagina è nascosta e non appare nel menu. La sezione 'Prossimi eventi' della home resta sempre visibile a parte.",
        }),
      ],
    }),
    defineField({
      name: "seoDefault",
      title: "🔍 Visibilità su Google — Testi predefiniti",
      type: "object",
      description:
        "Titolo, descrizione e immagine usati su Google e sui social quando una pagina non ha testi specifici suoi.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "defaultTitle",
          title: "Titolo predefinito per Google (max 70 caratteri)",
          type: "string",
          initialValue:
            "Caraval Spettacoli — Compagnia teatrale di Soncino, Cremona",
          validation: (r) => r.max(70),
        }),
        defineField({
          name: "defaultDescription",
          title: "Descrizione predefinita per Google (max 170 caratteri)",
          type: "text",
          rows: 3,
          description:
            "Testo mostrato sotto al titolo nei risultati di Google quando una pagina non ha una descrizione propria.",
          initialValue:
            "Caraval Spettacoli è la compagnia teatrale di Soncino (Cremona). Prosa, teatro di fuoco, performance di strada. Festival Imaginarium ogni anno.",
          validation: (r) => r.max(170),
        }),
        defineField({
          name: "defaultOgImage",
          title: "Immagine di anteprima social predefinita (1200x630 pixel)",
          type: "image",
          description:
            "Immagine usata quando un link del sito viene condiviso su WhatsApp, Facebook, Telegram, ecc., se la singola pagina non ha un'immagine propria.",
          options: { hotspot: true },
        }),
        defineField({
          name: "keywords",
          title: "Parole chiave del sito (Lombardia, Soncino, Cremona)",
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
          title: "Latitudine della sede (Soncino)",
          type: "number",
          description: "Coordinata geografica per Google Maps e SEO locale.",
          initialValue: 45.4017,
        }),
        defineField({
          name: "geoLon",
          title: "Longitudine della sede",
          type: "number",
          description: "Coordinata geografica per Google Maps e SEO locale.",
          initialValue: 9.8693,
        }),
        defineField({
          name: "canonicalBaseUrl",
          title: "Indirizzo principale del sito",
          type: "url",
          description: 'Es. "https://caraval.it". Lascia così se non cambia il dominio.',
          initialValue: "https://caraval.it",
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Impostazioni sito" }) },
});
