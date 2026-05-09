/**
 * Pre-popola Sanity con il demo content della Sessione 3.
 * Idempotente: usa createIfNotExists con _id deterministici, quindi
 * eseguendo lo script più volte non duplica i document.
 *
 * Run: npm run sanity:seed
 *
 * Richiede SANITY_API_WRITE_TOKEN in .env.local.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!token)
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN — crea un token con write access da sanity.io/manage"
  );

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

type AnyDoc = Record<string, unknown> & { _id: string; _type: string };

async function upsert(doc: AnyDoc) {
  await client.createIfNotExists(doc);
}

function ref(_ref: string) {
  return { _type: "reference" as const, _ref };
}

function block(text: string) {
  return [
    {
      _type: "block",
      _key: Math.random().toString(36).slice(2, 10),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text,
          marks: [],
        },
      ],
    },
  ];
}

// ---------- Singletons ----------

const homepageHero: AnyDoc = {
  _id: "homepageHero",
  _type: "homepageHero",
  heading: "Caraval Spettacoli",
  subheading:
    "Compagnia teatrale di Soncino. Facciamo prosa, teatro di strada e spettacoli di fuoco. Ogni estate, nei borghi della media pianura, c'è Imaginarium.",
  ctaPrimariaTesto: "I nostri spettacoli",
  ctaPrimariaLink: "/spettacoli",
  ctaSecondariaTesto: "Imaginarium 2026 · 4–18 giugno",
  ctaSecondariaLink: "/imaginarium",
};

const homepageCopy: AnyDoc = {
  _id: "homepageCopy",
  _type: "homepageCopy",
  premiHeading: "Tre premi in quattro anni.",
  imaginariumPreviewBody:
    "Sei serate, sei spettacoli, ingresso gratuito. Compagnie da tutta Italia. Il teatro torna dove la comunità vive.",
  imaginariumPreviewCtaTesto: "Scopri il festival",
  repertorioEyebrow: "IL REPERTORIO",
  repertorioHeading: "I nostri spettacoli",
  repertorioIntro:
    "Prosa contemporanea, teatro di fuoco e di strada. Per teatri, piazze, borghi, rievocazioni storiche.",
  repertorioCtaTesto: "Vedi tutto il repertorio",
  repertorioCtaLink: "/spettacoli",
  officinaEyebrow: "FORMAZIONE",
  officinaHeading: "Officina Teatrale",
  officinaBody:
    "Corsi serali per adulti da ottobre a maggio. Spettacolo finale a Imaginarium. Laboratori nelle scuole primarie del territorio.",
  officinaTagline: "Non serve esperienza. Serve curiosità.",
  officinaCtaTesto: "Scopri i corsi",
  officinaCtaLink: "/formazione",
  ospitaHeading: "Sei un Comune, una Pro Loco, una dimora storica?",
  ospitaBody:
    "Caraval può portare uno spettacolo da te. Prosa per teatri, fuoco per rievocazioni storiche, strada per piazze e borghi. Lavoriamo con Comuni, Pro Loco, dimore storiche e associazioni in tutta la Lombardia e oltre.",
  ospitaCtaTesto: "Scopri come ingaggiarci",
  ospitaCtaLink: "/ospita",
  contattiHeading: "Restiamo in contatto",
  contattiBody:
    "Per spettacoli, collaborazioni, formazione o solo per dirci ciao.",
  // Calendario (pagina)
  calendarioHeroEyebrow: "CALENDARIO",
  calendarioHeroHeading: "I prossimi appuntamenti",
  calendarioHeroIntro:
    "Tutte le date di Caraval Spettacoli e del festival Imaginarium.",
  // Formazione (pagina)
  formazioneHeroEyebrow: "FORMAZIONE",
  formazioneHeroHeading: "Officina Teatrale",
  formazioneHeroSubheading: "Non serve esperienza. Serve curiosità.",
  formazioneHeroIntro:
    "Corsi serali per adulti da ottobre a maggio. Spettacolo finale a Imaginarium.",
  corsiSezioneEyebrow: "I CORSI ATTIVI",
  corsiSezioneHeading: "Stagione corrente",
  corsiStatoVuotoTesto:
    "Le iscrizioni per la prossima stagione apriranno a settembre. Resta in contatto per essere aggiornato →",
  laboratoriEyebrow: "LABORATORI SCOLASTICI",
  laboratoriHeading: "Nelle scuole del territorio",
  laboratoriBody:
    "Caraval collabora con le scuole primarie del territorio attraverso laboratori teatrali pensati per i bambini. Un percorso di gioco, espressione e racconto, dentro l'orario scolastico. Per le scuole interessate, scriviamo un progetto su misura.",
  laboratoriCtaTesto: "Contatta Vera per i laboratori scolastici",
  // I numeri (counter homepage)
  numeriEyebrow: "I NUMERI",
  numeriElenco: [
    { valore: "9", etichetta: "spettacoli" },
    { valore: "3", etichetta: "anime" },
    { valore: "6", etichetta: "anni" },
    { valore: "1", etichetta: "festival" },
  ],
};

// ---------- Pagina Imaginarium — Copy ----------

const paginaImaginariumCopy: AnyDoc = {
  _id: "paginaImaginariumCopy",
  _type: "paginaImaginariumCopy",
  counterEyebrow: "IMAGINARIUM IN NUMERI",
  counterElenco: [
    { valore: "3", etichetta: "edizioni" },
    { valore: "18", etichetta: "spettacoli ospitati" },
    { valore: "12", etichetta: "compagnie" },
    { valore: "2.500+", etichetta: "spettatori" },
  ],
};

// ---------- Membri ----------

const membri: AnyDoc[] = [
  {
    _id: "membro-vera-rossini",
    _type: "membro",
    nome: "Vera Rossini",
    slug: { _type: "slug", current: "vera-rossini" },
    ruoli: ["Regista", "Attrice", "Formatrice"],
    bio: "Fondatrice di Caraval Spettacoli. Cura regia, formazione e direzione artistica del festival Imaginarium.",
    ordinamento: 1,
    referenteAreaTesto: "Formazione, regia, generale",
    telefonoPubblico: "+39 348 9143189",
    emailPubblica: "caravalspettacoli@gmail.com",
  },
  {
    _id: "membro-nicola-pignoli",
    _type: "membro",
    nome: "Nicola Pignoli",
    slug: { _type: "slug", current: "nicola-pignoli" },
    ruoli: ["Performer", "Tecnico fuoco"],
    bio: "Referente per gli spettacoli di fuoco e le rievocazioni storiche di Caraval.",
    ordinamento: 2,
    referenteAreaTesto: "Spettacoli di fuoco e rievocazioni",
    telefonoPubblico: "+39 348 3399431",
    emailPubblica: "nicolapignoli8@gmail.com",
  },
];

// ---------- Spettacoli ----------

type SpettacoloSeed = {
  _id: string;
  titolo: string;
  sottotitolo?: string;
  categoria: "prosa" | "fuoco" | "strada";
  inRepertorio: boolean;
  mostraInHomepage: boolean;
  ordineHomepage?: number;
  descrizioneBreve?: string;
  descrizioneNarrativa?: string;
  annoCreazione?: number;
  regia?: string;
  referenteContatto?: string;
};

const spettacoliSeeds: SpettacoloSeed[] = [
  {
    _id: "spettacolo-romeo-giulietta",
    titolo: "Romeo + Giulietta — L'inferno dell'amore",
    sottotitolo: "L'inferno dell'amore",
    categoria: "prosa",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 1,
    descrizioneBreve:
      "Una rilettura cruda della tragedia shakespeariana: due adolescenti dentro la macchina dell'amore impossibile.",
    descrizioneNarrativa:
      "Verona è un quartiere come un altro, le faide sono famiglie che non si parlano da sempre, l'amore è un'urgenza che non sa misurarsi. Romeo e Giulietta tornano a quattordici anni, con la lingua di oggi e la stessa fine antica. Lo spettacolo lavora sul tempo: ogni gesto è già accaduto, ogni battuta è già stata detta — e proprio per questo brucia.",
    annoCreazione: 2024,
    regia: "Vera Rossini",
  },
  {
    _id: "spettacolo-fine-del-mondo",
    titolo: "La Fine del Mondo",
    categoria: "prosa",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 2,
  },
  {
    _id: "spettacolo-arlecchino",
    titolo: "Arlecchino servo per amore",
    categoria: "prosa",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 3,
  },
  {
    _id: "spettacolo-banalita-del-male",
    titolo: "La Banalità del Male",
    categoria: "prosa",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 4,
  },
  {
    _id: "spettacolo-cubiculum-diaboli",
    titolo: "Cubiculum Diaboli",
    categoria: "fuoco",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 5,
    referenteContatto: "membro-nicola-pignoli",
  },
  {
    _id: "spettacolo-macbeth",
    titolo: "Macbeth",
    categoria: "fuoco",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 6,
    referenteContatto: "membro-nicola-pignoli",
  },
  {
    _id: "spettacolo-skog",
    titolo: "Skog e la Regina delle creature selvagge",
    categoria: "fuoco",
    inRepertorio: true,
    mostraInHomepage: false,
    referenteContatto: "membro-nicola-pignoli",
  },
  {
    _id: "spettacolo-legend",
    titolo: "Legend",
    categoria: "fuoco",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 7,
    referenteContatto: "membro-nicola-pignoli",
  },
  {
    _id: "spettacolo-christmas-carol",
    titolo: "A Christmas Carol",
    categoria: "fuoco",
    inRepertorio: true,
    mostraInHomepage: false,
    referenteContatto: "membro-nicola-pignoli",
  },
  {
    _id: "spettacolo-viaggiastorie",
    titolo: "I Viaggiastorie",
    categoria: "strada",
    inRepertorio: true,
    mostraInHomepage: true,
    ordineHomepage: 8,
  },
  {
    _id: "spettacolo-miseria-nobilta",
    titolo: "Miseria e Nobiltà",
    categoria: "prosa",
    inRepertorio: false,
    mostraInHomepage: false,
    descrizioneBreve:
      "La commedia di Eduardo Scarpetta nella messa in scena premiata Edallo CremainScena 2022.",
    descrizioneNarrativa:
      "Lo spettacolo che ha aperto il percorso di riconoscimenti per Caraval: la scrittura di Scarpetta riportata sulla scena con il ritmo di una compagnia giovane, premiata per la migliore messa in scena al CremainScena 2022.",
    annoCreazione: 2022,
    regia: "Vera Rossini",
  },
];

function spettacoloDoc(s: SpettacoloSeed): AnyDoc {
  const slug = s._id.replace(/^spettacolo-/, "");
  const doc: AnyDoc = {
    _id: s._id,
    _type: "spettacolo",
    titolo: s.titolo,
    slug: { _type: "slug", current: slug },
    categoria: s.categoria,
    inRepertorio: s.inRepertorio,
    mostraInHomepage: s.mostraInHomepage,
    produzione: "Caraval Spettacoli",
  };
  if (s.sottotitolo) doc.sottotitolo = s.sottotitolo;
  if (s.ordineHomepage !== undefined) doc.ordineHomepage = s.ordineHomepage;
  if (s.descrizioneBreve) doc.descrizioneBreve = s.descrizioneBreve;
  if (s.descrizioneNarrativa)
    doc.descrizioneNarrativa = block(s.descrizioneNarrativa);
  if (s.annoCreazione) doc.annoCreazione = s.annoCreazione;
  if (s.regia) doc.regia = s.regia;
  if (s.referenteContatto)
    doc.referenteContatto = ref(s.referenteContatto);
  return doc;
}

// ---------- Premi ----------
// I premi linkano a spettacoli, quindi creiamo prima gli spettacoli, poi i premi,
// e infine aggiorniamo gli spettacoli con premiAssociati via patch.

const premi: AnyDoc[] = [
  {
    _id: "premio-edallo-2022",
    _type: "premio",
    anno: 2022,
    nomePremio: "Premio Edallo",
    rassegna: "CremainScena",
    spettacoloAssociato: ref("spettacolo-miseria-nobilta"),
    motivazione: "Migliore messa in scena.",
    ordineHomepage: 1,
    mostraInHomepage: true,
  },
  {
    _id: "premio-edallo-2023",
    _type: "premio",
    anno: 2023,
    nomePremio: "Premio Edallo",
    rassegna: "CremainScena",
    spettacoloAssociato: ref("spettacolo-fine-del-mondo"),
    motivazione:
      "Profondità del testo e interpretazione dei due attori.",
    ordineHomepage: 2,
    mostraInHomepage: true,
  },
  {
    _id: "premio-atelier-lea-2025",
    _type: "premio",
    anno: 2025,
    nomePremio: "Miglior Drammaturgia Originale",
    rassegna: "Atelier Leà Milano",
    spettacoloAssociato: ref("spettacolo-fine-del-mondo"),
    ordineHomepage: 3,
    mostraInHomepage: true,
  },
];

// ---------- Edizioni Imaginarium ----------

const edizioni: AnyDoc[] = [
  {
    _id: "edizione-imaginarium-2026",
    _type: "edizioneImaginarium",
    anno: 2026,
    slug: { _type: "slug", current: "2026" },
    corrente: true,
    mostraInHomepage: true,
    titoloEdizione: "Imaginarium 2026 — III Edizione",
    dataInizio: "2026-06-04",
    dataFine: "2026-06-18",
    locationPrincipale: "Rocca Sforzesca, Soncino",
    descrizione: block(
      "Sei serate, sei spettacoli, ingresso gratuito. Compagnie da tutta Italia tra le mura della Rocca Sforzesca e nei borghi della media pianura. Il teatro torna dove la comunità vive."
    ),
    descrizioneBreve:
      "Sei serate, sei spettacoli, ingresso gratuito tra Rocca Sforzesca e borghi della media pianura.",
    patrocinio: ["Comune di Soncino"],
    sponsor: ["Danesi"],
    partnerLista: ["I Viaggiastorie", "Bacco da Seta", "Pro Loco Soncino"],
  },
  {
    _id: "edizione-imaginarium-2025",
    _type: "edizioneImaginarium",
    anno: 2025,
    slug: { _type: "slug", current: "2025" },
    corrente: false,
    mostraInHomepage: false,
    titoloEdizione: "Imaginarium 2025 — II Edizione",
    dataInizio: "2025-06-05",
    dataFine: "2025-06-22",
    locationPrincipale: "Rocca Sforzesca, Soncino",
    descrizioneBreve:
      "Programma in caricamento. Le date e i titoli saranno pubblicati a breve.",
  },
  {
    _id: "edizione-imaginarium-2024",
    _type: "edizioneImaginarium",
    anno: 2024,
    slug: { _type: "slug", current: "2024" },
    corrente: false,
    mostraInHomepage: false,
    titoloEdizione: "Imaginarium 2024 — I Edizione",
    dataInizio: "2024-06-07",
    dataFine: "2024-06-23",
    locationPrincipale: "Rocca Sforzesca, Soncino",
    descrizioneBreve:
      "Programma in caricamento. La prima edizione di Imaginarium.",
  },
];

// ---------- Spettacoli Imaginarium 2026 ----------

type SpettacoloImagSeed = {
  _id: string;
  data: string; // ISO datetime
  titolo: string;
  compagnia: string;
  eCaraval?: boolean;
  eOfficina?: boolean;
};

const spettacoliImag2026: SpettacoloImagSeed[] = [
  {
    _id: "imag-2026-letizia",
    data: "2026-06-04T21:00:00",
    titolo: "Letizia va alla guerra",
    compagnia: "Teatro degli Incamminati",
  },
  {
    _id: "imag-2026-romeo",
    data: "2026-06-05T21:00:00",
    titolo: "Romeo + Giulietta",
    compagnia: "Caraval Spettacoli",
    eCaraval: true,
  },
  {
    _id: "imag-2026-james-brown",
    data: "2026-06-07T21:00:00",
    titolo: "James Brown si metteva i bigodini",
    compagnia: "Officina Caraval",
    eOfficina: true,
  },
  {
    _id: "imag-2026-mandragola",
    data: "2026-06-12T21:00:00",
    titolo: "La Mandragola",
    compagnia: "Stivalaccio Teatro",
  },
  {
    _id: "imag-2026-matti",
    data: "2026-06-14T21:00:00",
    titolo: "Matti da slegare",
    compagnia: "Officina Caraval",
    eOfficina: true,
  },
  {
    _id: "imag-2026-modi",
    data: "2026-06-18T21:00:00",
    titolo: "Modì",
    compagnia: "Cantibhakta",
  },
];

function spettacoloImagDoc(s: SpettacoloImagSeed): AnyDoc {
  const slug = s._id.replace(/^imag-2026-/, "");
  return {
    _id: s._id,
    _type: "spettacoloImaginarium",
    titolo: s.titolo,
    slug: { _type: "slug", current: slug },
    edizioneRif: ref("edizione-imaginarium-2026"),
    compagnia: {
      nome: s.compagnia,
      eCaraval: !!s.eCaraval,
      eOfficina: !!s.eOfficina,
    },
    dataInizio: s.data,
  };
}

// ---------- Corsi ----------

const corsi: AnyDoc[] = [
  {
    _id: "corso-james-brown-2025-26",
    _type: "corso",
    titolo: "Officina adulti — James Brown si metteva i bigodini",
    slug: { _type: "slug", current: "officina-james-brown-2025-26" },
    target: "adulti",
    statoCorso: "in_corso",
    dataInizio: "2025-10-06",
    dataFine: "2026-05-25",
    frequenza: "Una sera a settimana",
    sede: "Soncino",
    attivo: true,
    spettacoloFinaleLinked: ref("imag-2026-james-brown"),
    referenteIscrizioni: ref("membro-vera-rossini"),
  },
  {
    _id: "corso-matti-2025-26",
    _type: "corso",
    titolo: "Officina adulti — Matti da slegare",
    slug: { _type: "slug", current: "officina-matti-2025-26" },
    target: "adulti",
    statoCorso: "in_corso",
    dataInizio: "2025-10-08",
    dataFine: "2026-05-27",
    frequenza: "Una sera a settimana",
    sede: "Soncino",
    attivo: true,
    spettacoloFinaleLinked: ref("imag-2026-matti"),
    referenteIscrizioni: ref("membro-vera-rossini"),
  },
];

// ---------- Sessione 4 — Pagina Spettacoli (singleton) ----------

const paginaSpettacoliCopy: AnyDoc = {
  _id: "paginaSpettacoliCopy",
  _type: "paginaSpettacoliCopy",
  eyebrow: "IL REPERTORIO",
  heading: "I nostri spettacoli",
  intro:
    "Prosa contemporanea, teatro di fuoco e di strada. Per teatri, piazze, borghi, rievocazioni storiche.",
  ctaArchivioDallIndice:
    "Vuoi vedere il nostro storico? Esplora le produzioni passate",
  archivioEyebrow: "ARCHIVIO",
  archivioHeading: "Produzioni passate",
  archivioIntro:
    "Spettacoli che hanno fatto parte del nostro percorso. Per scoprire da dove veniamo.",
};

// ---------- Sessione 4 — Archivio (7 nuovi document) ----------

type ArchivioSeed = {
  _id: string;
  titolo: string;
  categoria: "prosa" | "fuoco" | "strada";
  annoCreazione: number;
};

const archivioSeeds: ArchivioSeed[] = [
  { _id: "spettacolo-giovanna-darco", titolo: "Giovanna D'Arco", categoria: "prosa", annoCreazione: 2021 },
  { _id: "spettacolo-inferno-dante", titolo: "L'Inferno di Dante", categoria: "prosa", annoCreazione: 2021 },
  { _id: "spettacolo-folli-notre-dame", titolo: "I Folli di Notre Dame", categoria: "fuoco", annoCreazione: 2021 },
  { _id: "spettacolo-servitore-due-padroni", titolo: "Servitore di due padroni", categoria: "prosa", annoCreazione: 2019 },
  { _id: "spettacolo-sogno-mezza-estate", titolo: "Sogno di una notte di mezza estate", categoria: "prosa", annoCreazione: 2019 },
  { _id: "spettacolo-ezzelino", titolo: "Ezzelino da Romano", categoria: "prosa", annoCreazione: 2018 },
  { _id: "spettacolo-battute-fuori-scena", titolo: "Battute fuori scena", categoria: "prosa", annoCreazione: 2018 },
];

function spettacoloArchivioDoc(s: ArchivioSeed): AnyDoc {
  const slug = s._id.replace(/^spettacolo-/, "");
  return {
    _id: s._id,
    _type: "spettacolo",
    titolo: s.titolo,
    slug: { _type: "slug", current: slug },
    categoria: s.categoria,
    inRepertorio: false,
    mostraInHomepage: false,
    annoCreazione: s.annoCreazione,
    produzione: "Caraval Spettacoli",
  };
}

// ---------- Run ----------

async function main() {
  console.log(`Seeding demo content → project ${projectId}/${dataset}`);

  // 1. Singletons (createOrReplace per garantire stato fresco dei copy)
  await client.createOrReplace(homepageHero);
  console.log("✓ homepageHero");
  await client.createOrReplace(homepageCopy);
  console.log("✓ homepageCopy");

  // 2. Membri
  for (const m of membri) {
    await upsert(m);
    console.log(`✓ membro: ${m.nome}`);
  }

  // 3. Spettacoli (senza premiAssociati ancora)
  for (const s of spettacoliSeeds) {
    await upsert(spettacoloDoc(s));
    console.log(`✓ spettacolo: ${s.titolo}`);
  }

  // 4. Premi (riferiscono spettacoli, ora esistenti)
  for (const p of premi) {
    await upsert(p);
    console.log(`✓ premio: ${p.nomePremio} ${p.anno}`);
  }

  // 5. Patch spettacoli con premiAssociati
  await client
    .patch("spettacolo-fine-del-mondo")
    .setIfMissing({ premiAssociati: [] })
    .set({
      premiAssociati: [
        { _key: "p-edallo-2023", ...ref("premio-edallo-2023") },
        { _key: "p-atelier-2025", ...ref("premio-atelier-lea-2025") },
      ],
    })
    .commit({ autoGenerateArrayKeys: true });
  console.log("✓ patch: spettacolo-fine-del-mondo.premiAssociati");

  await client
    .patch("spettacolo-miseria-nobilta")
    .setIfMissing({ premiAssociati: [] })
    .set({
      premiAssociati: [{ _key: "p-edallo-2022", ...ref("premio-edallo-2022") }],
    })
    .commit({ autoGenerateArrayKeys: true });
  console.log("✓ patch: spettacolo-miseria-nobilta.premiAssociati");

  // 6. Edizioni Imaginarium
  for (const e of edizioni) {
    await upsert(e);
    console.log(`✓ edizione Imaginarium: ${e.anno}`);
  }

  // 7. Spettacoli Imaginarium 2026
  for (const s of spettacoliImag2026) {
    await upsert(spettacoloImagDoc(s));
    console.log(`✓ spettacolo Imaginarium 2026: ${s.titolo}`);
  }

  // 8. Corsi
  for (const c of corsi) {
    await upsert(c);
    console.log(`✓ corso: ${c.titolo}`);
  }

  // ===== Sessione 4 — additions =====

  // 9. Singleton paginaSpettacoliCopy
  await client.createOrReplace(paginaSpettacoliCopy);
  console.log("✓ paginaSpettacoliCopy");

  // 9b. Singleton paginaImaginariumCopy (Blocco 1)
  await client.createOrReplace(paginaImaginariumCopy);
  console.log("✓ paginaImaginariumCopy");

  // 10. Archivio: 7 nuovi document spettacolo (idempotenti)
  for (const a of archivioSeeds) {
    await upsert(spettacoloArchivioDoc(a));
    console.log(`✓ archivio: ${a.titolo}`);
  }

  // 11. Patch Romeo+Giulietta — popolato 100% dal PDF brochure
  await client
    .patch("spettacolo-romeo-giulietta")
    .set({
      slug: { _type: "slug", current: "romeo-giulietta-inferno-amore" },
      annoCreazione: 2026,
      regia: "Vera Rossini",
      produzione: "Caraval Spettacoli",
      descrizioneBreve:
        "Una rilettura cruda di Shakespeare ambientata all'Inferno: due personaggi-diavoli trovano un baule e un copione. Il gioco diventa tragedia.",
      descrizioneNarrativa: [
        ...block(
          "In tempi segnati da divisioni, conflitti e rancori sempre più diffusi, Romeo e Giulietta ci parla con forza sorprendente. Viviamo in un mondo dove l'odio e l'indifferenza si insinuano nelle relazioni senza che ce ne rendiamo conto. Con questa rivisitazione vogliamo porre una domanda fondamentale: esiste davvero un'altra via, oltre il conflitto?"
        ),
        ...block(
          "Lo spettacolo è ambientato all'Inferno, dove due personaggi simili a diavoli trovano un vecchio baule colmo di oggetti di scena e un copione. Da quel momento, cominciano a giocare, interpretando i diversi ruoli della tragedia di Romeo e Giulietta."
        ),
        ...block(
          "Inizialmente, il loro gioco ha toni leggeri, quasi ironici, come se stessero divertendosi a prendersi gioco della storia. Ma, a poco a poco, la situazione si fa più seria, e quella che era iniziata come una parodia diventa una narrazione profonda, che trascina i personaggi (e il pubblico) in una riflessione oscura e inquietante sulla natura dell'odio e del rimorso."
        ),
        ...block(
          "L'alternanza costante tra ironia e tragedia, unita all'atmosfera gotica costruita con cura da luci, musiche e scenografie, accompagna il pubblico in un crescendo emotivo, amplificando l'impatto della rivelazione e lasciando alla fine un senso di inquietudine e di riflessione sulla natura dell'odio, dell'amore e della condanna eterna."
        ),
      ],
      cast: [
        {
          _key: "cast-vera",
          nome: "Vera Rossini",
          ruolo: "Adattamento, regia, attrice",
        },
        {
          _key: "cast-nicola",
          nome: "Nicola Pignoli",
          ruolo: "Attore, musiche",
        },
        { _key: "cast-andrico", nome: "Giacomo Andrico", ruolo: "Scene" },
        { _key: "cast-botti", nome: "Antonio Botti", ruolo: "Luci" },
        { _key: "cast-aurora", nome: "Aurora Rossini", ruolo: "Costumi" },
      ],
      schedaTecnica: {
        durataMinuti: 70,
        numeroAttori: "2",
        spazioScenico:
          "Palco ideale 8x6m H 5.50m, adattabile a 5x4m H 5.50m",
        audio: "Allaccio corrente elettrica 220V",
        noteTecniche:
          "Tempo montaggio 120 min, smontaggio 60 min. 1 camerino con acqua corrente.",
      },
      prenotazione: {
        modalita: "richiestaContatto",
      },
      referenteContatto: ref("membro-vera-rossini"),
    })
    .commit();
  console.log("✓ patch: spettacolo-romeo-giulietta (Sessione 4)");

  // 12. Patch Miseria e Nobiltà — regia + prenotazione
  await client
    .patch("spettacolo-miseria-nobilta")
    .set({
      regia: "Lorenzo Samanni",
      prenotazione: { modalita: "richiestaContatto" },
    })
    .commit();
  console.log("✓ patch: spettacolo-miseria-nobilta (Sessione 4)");

  // 13. Patch tutti gli altri spettacoli attivi: prenotazione default
  const altriSpettacoliPrenotazione = [
    "spettacolo-fine-del-mondo",
    "spettacolo-arlecchino",
    "spettacolo-banalita-del-male",
    "spettacolo-cubiculum-diaboli",
    "spettacolo-macbeth",
    "spettacolo-skog",
    "spettacolo-legend",
    "spettacolo-christmas-carol",
    "spettacolo-viaggiastorie",
  ];
  for (const id of altriSpettacoliPrenotazione) {
    await client
      .patch(id)
      .setIfMissing({ prenotazione: { modalita: "richiestaContatto" } })
      .commit();
  }
  console.log("✓ patch: prenotazione su 9 spettacoli attivi");

  // I Viaggiastorie: assicura referenteContatto = Vera (sessione 3 lo aveva vuoto)
  await client
    .patch("spettacolo-viaggiastorie")
    .setIfMissing({ referenteContatto: ref("membro-vera-rossini") })
    .commit();
  console.log("✓ patch: spettacolo-viaggiastorie.referenteContatto = Vera");

  console.log("\n✅ Seed completato.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
