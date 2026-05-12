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

/** Lista campi immagine/file da preservare quando si fa createOrReplace
 *  su un singleton. Fix Hotfix 5: senza questo, il re-seed cancellava
 *  le foto caricate via Studio o import script. */
const PRESERVED_IMAGE_FIELDS = [
  "fotoSfondo",
  "heroFotoSfondo",
  "storiaFotoSezione",
  "scuolaMagiaFoto",
  "formazioneHeroFotoSfondo",
  "calendarioHeroFotoSfondo",
  "patrociniHomepage", // array di object con logo (preserva tutto l'array)
];

/** createOrReplace che PRESERVA i campi image esistenti del documento.
 *  Senza questo, ogni `npm run sanity:seed` cancella le foto caricate
 *  da Edo in Studio o dallo script import-images-to-sanity. */
async function createOrReplacePreservingImages(doc: AnyDoc): Promise<void> {
  const existing = await client.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    { id: doc._id }
  );
  if (existing) {
    const merged: AnyDoc = { ...doc };
    for (const field of PRESERVED_IMAGE_FIELDS) {
      // Preserva il campo esistente solo se il seed non lo specifica esplicitamente.
      // (es. patrociniHomepage del seed sarebbe `undefined` o array vuoto → preserva esistente)
      const seedHasField = field in doc && doc[field] != null;
      const existingHasField =
        existing[field] != null &&
        (Array.isArray(existing[field])
          ? (existing[field] as unknown[]).length > 0
          : true);
      if (!seedHasField && existingHasField) {
        merged[field] = existing[field];
      }
    }
    await client.createOrReplace(merged);
  } else {
    await client.createOrReplace(doc);
  }
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
  laboratoriCtaTesto: "Contattaci per i laboratori scolastici",
  // I numeri (counter homepage)
  numeriEyebrow: "I NUMERI",
  numeriElenco: [
    { valore: "9", etichetta: "spettacoli" },
    { valore: "3", etichetta: "anime" },
    { valore: "6", etichetta: "anni" },
    { valore: "1", etichetta: "festival" },
  ],
  // Hotfix 4: i patrocini sono stati spostati come RENDER da homepage a
  // /imaginarium (cambia solo dove vengono mostrati, non dove sono salvati).
  // Il campo resta in homepageCopy come fonte dati condivisa. NON lo azzeriamo
  // qui per non perdere i loghi caricati dall'import script in Hotfix 3.
  // Edo deve cancellare manualmente in Studio i duplicati testuali senza logo.
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
  videoEyebrow: "GUARDA",
  videoHeading: "Imaginarium in due minuti",
  videoYoutubeUrl: "https://www.youtube.com/watch?v=KNRC35KjVeA",
};

// ---------- Membri ----------

const membri: AnyDoc[] = [
  {
    _id: "membro-vera-rossini",
    _type: "membro",
    nome: "Vera Rossini",
    slug: { _type: "slug", current: "vera-rossini" },
    ruoli: ["Regista", "Formatrice"],
    bioBreve:
      "Fondatrice di Caraval. Cura la regia degli spettacoli di prosa e dirige l'Officina Teatrale.",
    bio: "Fondatrice di Caraval Spettacoli. Cura regia, formazione e direzione artistica del festival Imaginarium.",
    ordinamento: 1,
    referenteAreaTesto: "Formazione, regia, generale",
    telefonoPubblico: "+39 348 9143189",
    emailPubblica: "caravalspettacoli@gmail.com",
  },
  {
    _id: "membro-alessio-rosin",
    _type: "membro",
    nome: "Alessio Rosin",
    slug: { _type: "slug", current: "alessio-rosin" },
    ruoli: ["Attore", "Performer"],
    bioBreve:
      "Attore della compagnia, presente nelle produzioni di prosa e di strada.",
    ordinamento: 2,
  },
  {
    _id: "membro-nicola-pignoli",
    _type: "membro",
    nome: "Nicola Pignoli",
    slug: { _type: "slug", current: "nicola-pignoli" },
    ruoli: ["Tecnico", "Performer di fuoco"],
    bioBreve:
      "Cura la parte tecnica degli spettacoli e le performance di fuoco.",
    bio: "Referente per gli spettacoli di fuoco e le rievocazioni storiche di Caraval.",
    ordinamento: 3,
    referenteAreaTesto: "Spettacoli di fuoco e rievocazioni",
    telefonoPubblico: "+39 348 3399431",
    emailPubblica: "nicolapignoli8@gmail.com",
  },
  {
    _id: "membro-lorenzo-samanni",
    _type: "membro",
    nome: "Lorenzo Samanni",
    slug: { _type: "slug", current: "lorenzo-samanni" },
    ruoli: ["Attore"],
    bioBreve: "Attore della compagnia.",
    ordinamento: 4,
  },
  {
    _id: "membro-marco-ravelli",
    _type: "membro",
    nome: "Marco Ravelli",
    slug: { _type: "slug", current: "marco-ravelli" },
    ruoli: ["Attore"],
    bioBreve: "Attore della compagnia.",
    ordinamento: 5,
  },
  {
    _id: "membro-ilaria-cavalli",
    _type: "membro",
    nome: "Ilaria Cavalli",
    slug: { _type: "slug", current: "ilaria-cavalli" },
    ruoli: ["Attrice"],
    bioBreve: "Attrice della compagnia.",
    ordinamento: 6,
  },
];

// ---------- Pagina Chi Siamo — Copy ----------

const paginaChiSiamoCopy: AnyDoc = {
  _id: "paginaChiSiamoCopy",
  _type: "paginaChiSiamoCopy",
  heroEyebrow: "CHI SIAMO",
  heroHeading: "Caraval Spettacoli",
  heroSottotitolo: "Compagnia teatrale di Soncino, dal 2016.",
  storiaEyebrow: "LA NOSTRA STORIA",
  storiaHeading: "Una compagnia, tre anime, un festival",
  // Testo importato da caraval.it (versione approvata da Vera).
  // NB: "Dal 2016" come da sito attuale (la versione precedente diceva 2020).
  storiaBody:
    "Caraval Spettacoli è una compagnia teatrale che vanta tra le sue fila attori esperti, giocolieri e scenografi in grado di realizzare spettacoli di successo. Dal 2016 portiamo sul palco diverse storie e personaggi, passando dalla commedia dell'arte al teatro di prosa fino a quello più sperimentale, senza mai dimenticare l'arte di strada che è dove affondano le nostre radici.\n\nMettiamo in scena sia i testi di grandi autori teatrali che copioni nuovi scritti da noi, per il teatro ma non solo. Infatti, abbiamo partecipato a festival e feste locali in cui i committenti ci hanno chiesto di scrivere uno spettacolo ad hoc, che parlasse di una tematica particolare o rappresentasse un evento storico importante per il luogo.\n\nIl teatro non è quindi l'unico spazio in cui operiamo: piazze, dimore storiche e castelli sono spesso cornici delle nostre performance. Curiamo ogni dettaglio occupandoci anche della scenografia e dei costumi, creati su misura per ogni spettacolo, così da rendere qualsiasi location il palcoscenico perfetto.\n\nDa diversi anni partecipiamo al Carnevale di Venezia, portando per le calle della città costumi realizzati interamente da noi e figure fantastiche frutto della nostra creatività.\n\n#inviaggioconcaraval è il nostro hashtag ufficiale, perché amiamo viaggiare sia sulla strada che sulle ali della fantasia.",
  membriEyebrow: "LA COMPAGNIA",
  membriHeading: "Le persone di Caraval",
  membriIntro: "Sei artisti che fanno teatro insieme.",
  premiEyebrow: "RICONOSCIMENTI",
  premiHeading: "I premi che abbiamo ricevuto",
  scuolaMagiaEyebrow: "ALTRI PROGETTI",
  scuolaMagiaHeading: "Scuola di Magia Italiana",
  scuolaMagiaBody:
    "Vera è anche fondatrice della Scuola di Magia Italiana, percorso formativo dedicato all'arte magica e alla prestidigitazione. Una realtà parallela a Caraval, con un suo percorso e una sua identità.",
  scuolaMagiaUrl: "https://scuoladimagiaitaliana.it",
};

// ---------- Pagina Contatti — Copy ----------

const paginaContattiCopy: AnyDoc = {
  _id: "paginaContattiCopy",
  _type: "paginaContattiCopy",
  heroEyebrow: "CONTATTI",
  heroHeading: "Restiamo in contatto",
  heroSottotitolo:
    "Per spettacoli, formazione, collaborazioni o solo per dirci ciao.",
  aree: [
    {
      _key: "area-spettacolo",
      icona: "spettacolo",
      eyebrow: "PER PROGRAMMARE UNO SPETTACOLO",
      titolo: "Hai un evento? Vuoi ingaggiarci?",
      descrizione:
        "Comuni, Pro Loco, dimore storiche, associazioni: scrivici per ingaggiare uno spettacolo del nostro repertorio. Prosa, fuoco o strada.",
      referente: { _type: "reference", _ref: "membro-vera-rossini" },
    },
    {
      _key: "area-formazione",
      icona: "formazione",
      eyebrow: "CORSI E FORMAZIONE",
      titolo: "Officina Teatrale e laboratori",
      descrizione:
        "Officina Teatrale per adulti, laboratori nelle scuole. Per informazioni o iscrizioni.",
      referente: { _type: "reference", _ref: "membro-vera-rossini" },
    },
    {
      _key: "area-fuoco",
      icona: "fuoco",
      eyebrow: "SPETTACOLI DI FUOCO",
      titolo: "Richieste tecniche per fuoco e strada",
      descrizione:
        "Per richieste tecniche specifiche sugli spettacoli di fuoco e strada.",
      referente: { _type: "reference", _ref: "membro-nicola-pignoli" },
    },
    {
      _key: "area-generale",
      icona: "generale",
      eyebrow: "CONTATTI GENERALI",
      titolo: "Per qualsiasi altra richiesta",
      descrizione:
        "Per qualsiasi altra richiesta, scrivici o chiamaci.",
      telefonoOverride: "+39 379 1497805",
      emailOverride: "caravalspettacoli@gmail.com",
    },
  ],
};

// ---------- Pagina Ospita — Copy ----------

const paginaOspitaCopy: AnyDoc = {
  _id: "paginaOspitaCopy",
  _type: "paginaOspitaCopy",
  heroEyebrow: "OSPITA CARAVAL",
  heroHeading: "Porta il teatro nella tua piazza",
  heroSottotitolo:
    "Un Comune, una Pro Loco, una dimora storica, un'associazione culturale. Caraval può portare uno spettacolo da te.",
  valorePropostoEyebrow: "PERCHÉ CARAVAL",
  valorePropostoHeading: "Teatro che funziona, dove serve",
  valorePropostoBody:
    "Lavoriamo da 6 anni con piazze, sagrati, cortili e teatri della Lombardia e oltre. Prosa contemporanea, teatro di fuoco, narrazione di strada. Il pubblico non si annoia mai. I committenti tornano l'anno dopo.",
  processoIngaggioEyebrow: "COME FUNZIONA",
  processoIngaggioHeading: "Tre passi per averci da te",
  processoIngaggioStep: [
    { _key: "step1", numero: "1", titolo: "Scrivici", descrizione: "Mandaci una mail con data, luogo e idea dell'evento. Anche solo un'intuizione, ti aiutiamo noi a strutturarla." },
    { _key: "step2", numero: "2", titolo: "Scegliamo lo spettacolo giusto", descrizione: "Ti proponiamo 1-2 spettacoli del nostro repertorio compatibili con il tuo spazio e il tuo pubblico. Valutiamo insieme." },
    { _key: "step3", numero: "3", titolo: "Veniamo a fare il sopralluogo", descrizione: "Tecnica, logistica, accoglienza. Ci occupiamo di tutto. Tu pensi solo alla piazza piena." },
  ],
  testimonianzeEyebrow: "DICONO DI NOI",
  testimonianzeHeading: "Chi ci ha ospitato, lo racconta",
  testimonianze: [
    { _key: "t1", citazione: "Caraval è una compagnia che lavora con cura e professionalità. Lo spettacolo ha riempito la piazza di pubblico.", autore: "Mario Rossi", ente: "Sindaco, Comune di [Esempio]" },
    { _key: "t2", citazione: "Lavorare con Caraval è stato semplice e umano. Sono tornati l'anno successivo.", autore: "Anna Bianchi", ente: "Presidente, Pro Loco di [Esempio]" },
    { _key: "t3", citazione: "Hanno trasformato il nostro cortile in un teatro. Spettatori entusiasti.", autore: "Giorgio Verdi", ente: "Direttore, Dimora storica [Esempio]" },
  ],
  hannoIngaggiatoEyebrow: "HANNO INGAGGIATO CARAVAL",
  hannoIngaggiatoElenco: [
    "Comune di Soncino",
    "Comune di Crema",
    "Pro Loco Soncino",
    "Festival X",
    "Festival Y",
    "Comune di Z",
  ],
  ctaFinaleHeading: "Pronto a portare Caraval da te?",
  ctaFinaleBody: "Scrivici. Ti rispondiamo entro 24 ore con una proposta su misura.",
};

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
    dataInizio: "2025-06-07",
    dataFine: "2025-06-29",
    locationPrincipale: "Soncino — Rocca Sforzesca, Cortile Famiglia Caffi",
    descrizioneBreve:
      "Otto serate, sei compagnie ospiti, tre location. La seconda edizione di Imaginarium tra Rocca Sforzesca, Cortile Famiglia Caffi e Area Castel Giardino.",
    patrocinio: ["Comune di Soncino"],
    sponsor: ["Fondazione Cariplo", "Pro Loco Soncino", "Danesi", "Moro", "ITER", "Bacco da Seta", "Viaggia"],
    partnerLista: ["Stivalaccio Teatro", "Tournée Da Bar", "Les Moustaches", "Compagnia Burambò"],
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
  descrizioneBreve?: string;
};

const spettacoliImag2026: SpettacoloImagSeed[] = [
  {
    _id: "imag-2026-letizia",
    data: "2026-06-04T21:00:00",
    titolo: "Letizia va alla guerra",
    compagnia: "Teatro degli Incamminati",
    descrizioneBreve:
      "Storia di una giovane donna nel cuore di un conflitto. Drammaturgia originale per la scena.",
  },
  {
    _id: "imag-2026-romeo",
    data: "2026-06-05T21:00:00",
    titolo: "Romeo + Giulietta",
    compagnia: "Caraval Spettacoli",
    eCaraval: true,
    descrizioneBreve:
      "La rilettura cruda di Shakespeare ambientata all'Inferno: due personaggi-diavoli trovano un baule e un copione. Il gioco diventa tragedia.",
  },
  {
    _id: "imag-2026-james-brown",
    data: "2026-06-07T21:00:00",
    titolo: "James Brown si metteva i bigodini",
    compagnia: "Officina Caraval",
    eOfficina: true,
    descrizioneBreve:
      "Lo spettacolo finale degli allievi adulti dell'Officina Teatrale Caraval. Una commedia che gioca con identità e maschere.",
  },
  {
    _id: "imag-2026-mandragola",
    data: "2026-06-12T21:00:00",
    titolo: "La Mandragola",
    compagnia: "Stivalaccio Teatro",
    descrizioneBreve:
      "Il classico di Machiavelli rivisitato con la cifra stilistica del teatro di strada e le maschere della Commedia dell'Arte.",
  },
  {
    _id: "imag-2026-matti",
    data: "2026-06-14T21:00:00",
    titolo: "Matti da slegare",
    compagnia: "Officina Caraval",
    eOfficina: true,
    descrizioneBreve:
      "Spettacolo finale dell'Officina Teatrale Caraval. Una riflessione collettiva su normalità e libertà.",
  },
  {
    _id: "imag-2026-modi",
    data: "2026-06-18T21:00:00",
    titolo: "Modì",
    compagnia: "Cantibhakta",
    descrizioneBreve:
      "La vita di Amedeo Modigliani raccontata attraverso il teatro fisico e la danza. Un omaggio all'artista maledetto.",
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
    ...(s.descrizioneBreve ? { descrizioneBreve: s.descrizioneBreve } : {}),
  };
}

// ---------- Spettacoli Imaginarium 2025 (Hotfix 2) ----------
// Dati estratti da caraval.it/imaginarium (edizione passata).
type SpettacoloImag2025Seed = {
  _id: string;
  data: string;
  titolo: string;
  compagnia: string;
  locationSpecifica: string;
  descrizioneBreve: string;
  eCaraval?: boolean;
  eOfficina?: boolean;
  urlSitoCompagnia?: string;
  descrizioneCompagniaBreve?: string;
};

const spettacoliImag2025: SpettacoloImag2025Seed[] = [
  {
    _id: "imag-2025-party-inaugurazione",
    data: "2025-06-07T18:00:00",
    titolo: "Party di Inaugurazione",
    compagnia: "Caraval Spettacoli",
    eCaraval: true,
    locationSpecifica: "Piazzale Esterno Rocca, Soncino",
    descrizioneBreve:
      "Apertura ufficiale della seconda edizione di Imaginarium. Musica, brindisi, anteprime. Ingresso gratuito.",
  },
  {
    _id: "imag-2025-buffoni-inferno",
    data: "2025-06-12T21:30:00",
    titolo: "Buffoni All'Inferno",
    compagnia: "Stivalaccio Teatro",
    locationSpecifica: "Rocca Sforzesca, Soncino",
    descrizioneBreve:
      "Commedia dell'Arte e teatro fisico. Biglietto 9€.",
    descrizioneCompagniaBreve:
      "Compagnia veneta specializzata in Commedia dell'Arte e teatro popolare.",
  },
  {
    _id: "imag-2025-ciccio-speranza",
    data: "2025-06-13T21:30:00",
    titolo: "La Difficilissima Storia di Ciccio Speranza",
    compagnia: "Les Moustaches",
    locationSpecifica: "Rocca Sforzesca, Soncino",
    descrizioneBreve:
      "Narrazione comica e poetica. Biglietto 9€.",
    descrizioneCompagniaBreve:
      "Compagnia di teatro contemporaneo che intreccia narrazione e clownerie.",
  },
  {
    _id: "imag-2025-brancaglione",
    data: "2025-06-20T21:30:00",
    titolo: "Brancaglione Da Norcia",
    compagnia: "Mirko Signorelli, Renato Bertelli, Giacomo Andrico",
    locationSpecifica: "Cortile Famiglia Caffi, Soncino",
    descrizioneBreve:
      "Teatro di narrazione con musiche dal vivo. Ingresso gratuito.",
  },
  {
    _id: "imag-2025-elena",
    data: "2025-06-22T21:30:00",
    titolo: "Elena",
    compagnia: "Tournée Da Bar",
    locationSpecifica: "Cortile Famiglia Caffi, Soncino",
    descrizioneBreve:
      "Rilettura contemporanea del mito di Elena. Ingresso gratuito.",
    descrizioneCompagniaBreve:
      "Collettivo teatrale milanese noto per le riscritture irriverenti dei classici.",
  },
  {
    _id: "imag-2025-amore-psiche",
    data: "2025-06-27T21:30:00",
    titolo: "Amore & Psiche",
    compagnia: "Compagnia Burambò",
    locationSpecifica: "Rocca Sforzesca, Soncino",
    descrizioneBreve:
      "Teatro di figura e narrazione del mito. Biglietto 9€.",
    descrizioneCompagniaBreve:
      "Compagnia pugliese specializzata in teatro di figura, burattini e maschere.",
  },
  {
    _id: "imag-2025-due-partite",
    data: "2025-06-28T21:30:00",
    titolo: "Due Partite e Mezzo (Fuori Festival)",
    compagnia: "Officina Teatrale Caraval",
    eOfficina: true,
    locationSpecifica: "Cortile Famiglia Caffi, Soncino",
    descrizioneBreve:
      "Spettacolo finale degli allievi adulti dell'Officina Teatrale. Ingresso gratuito.",
  },
  {
    _id: "imag-2025-party-finale",
    data: "2025-06-29T21:00:00",
    titolo: "Party di Fine Festival",
    compagnia: "Caraval Spettacoli",
    eCaraval: true,
    locationSpecifica: "Area Castel Giardino, Soncino",
    descrizioneBreve:
      "Chiusura della seconda edizione. Musica, performance brevi, saluti. Ingresso gratuito.",
  },
];

function spettacoloImag2025Doc(s: SpettacoloImag2025Seed): AnyDoc {
  const slug = s._id.replace(/^imag-2025-/, "");
  return {
    _id: s._id,
    _type: "spettacoloImaginarium",
    titolo: s.titolo,
    slug: { _type: "slug", current: slug },
    edizioneRif: ref("edizione-imaginarium-2025"),
    compagnia: {
      nome: s.compagnia,
      eCaraval: !!s.eCaraval,
      eOfficina: !!s.eOfficina,
      ...(s.urlSitoCompagnia ? { urlSitoCompagnia: s.urlSitoCompagnia } : {}),
      ...(s.descrizioneCompagniaBreve
        ? { descrizioneCompagniaBreve: s.descrizioneCompagniaBreve }
        : {}),
    },
    dataInizio: s.data,
    locationSpecifica: s.locationSpecifica,
    descrizioneBreve: s.descrizioneBreve,
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
  //    Hotfix 5: preserva campi image (fotoSfondo, heroFotoSfondo, ...) per
  //    non cancellare foto caricate via Studio o import script.
  await createOrReplacePreservingImages(homepageHero);
  console.log("✓ homepageHero");
  await createOrReplacePreservingImages(homepageCopy);
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

  // 7b. Spettacoli Imaginarium 2025 (Hotfix 2 — popolazione edizione passata)
  for (const s of spettacoliImag2025) {
    await upsert(spettacoloImag2025Doc(s));
    console.log(`✓ spettacolo Imaginarium 2025: ${s.titolo}`);
  }

  // 8. Corsi
  for (const c of corsi) {
    await upsert(c);
    console.log(`✓ corso: ${c.titolo}`);
  }

  // ===== Sessione 4 — additions =====

  // 9. Singleton paginaSpettacoliCopy
  await createOrReplacePreservingImages(paginaSpettacoliCopy);
  console.log("✓ paginaSpettacoliCopy");

  // 9b. Singleton paginaImaginariumCopy (Blocco 1)
  await createOrReplacePreservingImages(paginaImaginariumCopy);
  console.log("✓ paginaImaginariumCopy");

  // 9c. Singleton chi-siamo / contatti / ospita (Blocco 2)
  await createOrReplacePreservingImages(paginaChiSiamoCopy);
  console.log("✓ paginaChiSiamoCopy");
  await createOrReplacePreservingImages(paginaContattiCopy);
  console.log("✓ paginaContattiCopy");
  await createOrReplacePreservingImages(paginaOspitaCopy);
  console.log("✓ paginaOspitaCopy");

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

  // 14. Patch descrizioniNarrativa importate da caraval.it (Polish Definitivo).
  //     setIfMissing → non sovrascrive se Vera ha già editato in Studio.
  //     Romeo+Giulietta escluso: già popolato dal PDF brochure (step 11).
  const descrizioniDaSitoAttuale: Array<{ id: string; paragrafi: string[] }> = [
    {
      id: "spettacolo-sogno-mezza-estate",
      paragrafi: [
        "\"Sogno di una notte di mezza estate\" è la messa in scena dell'opera di Shakespeare. Una spensierata commedia in cui due coppie di giovani innamorati ed una compagnia di attori saranno vittima degli scherzi di alcune creature fatate.",
        "La celebre opera viene rappresentata fedelmente, ma alleggerita e confezionata per poter essere goduta appieno dal pubblico contemporaneo senza però tradire i contenuti, il senso e sopratutto la magica e romantica atmosfera.",
        "Lo spettacolo teatrale vede in scena undici attori, a stretto contatto con il pubblico, che si sentirà coinvolto nelle scaramucce amorose dei protagonisti e sarà testimone di tutti i dispetti orditi alle loro spalle da Oberon re degli elfi, Titania regina delle fate e Puck il folletto.",
        "Un'esperienza coinvolgente e spassosa in cui una tecnica di recitazione spontanea e diretta accompagnerà gli spettatori nel cuore di una storia senza tempo.",
      ],
    },
    {
      id: "spettacolo-servitore-due-padroni",
      paragrafi: [
        "Servitore di Due Padroni è il tributo della compagnia a Goldoni e alla Commedia dell'arte. Al centro della trama si trova Arlecchino, servo di due padroni, che \"per non svelare il suo inganno e per perseguire il suo unico intento, ovvero mangiare a sazietà, intreccia la storia all'inverosimile, creando solo equivoci e guai\".",
        "Lo spettacolo rappresenta in modo metaforico e divertente situazioni della vita quotidiana, ispirandosi ai celebri personaggi della Commedia dell'Arte. Questi personaggi, da secoli, trasmettono messaggi sempre rilevanti attraverso il linguaggio della maschera.",
        "La Commedia dell'arte, nata in Italia con le sue maschere e il suo repertorio teatrale, si è diffusa in tutta Europa e continua a rappresentare un patrimonio immateriale della tradizione italiana. Servitore di Due Padroni è un'opera di intrattenimento caratterizzata da un tono comico e divertente.",
      ],
    },
    {
      id: "spettacolo-christmas-carol",
      paragrafi: [
        "Tra atmosfere noir e giochi di luci e ombre la magia del Natale prende vita davanti ai nostri occhi.",
        "Una suggestiva performance di fuoco e teatro tratta dall'omonima novella di Charles Dickens, ambientata in un piccolo paesino inglese alla vigilia di Natale.",
        "Ebenezer Scrooge, vecchio avaro ed egoista, vede il fantasma del suo defunto socio Jacob Marley che gli annuncia la visita di tre spiriti del Natale: passato, presente e futuro. Questi gli fanno ripercorrere la sua esistenza e gli mostrano anche ciò che accadrà in futuro: l'essere spettatore della sua vita gli fa capire che il suo egoismo e la sua indifferenza hanno causato solo tristezza e odio.",
        "Il miracolo del Natale si materializza con la sua conversione, dopo la visita dei fantasmi nella sua anima entra l'amore e la felicità. Secondo Dickens, il miglior modo per affrontare e superare i mali sociali è proprio la rinascita morale dell'individuo.",
        "Una favola tradizionale e commovente sull'importanza della famiglia dove la magia e l'incontro con i tre Spiriti del Natale fanno da sfondo a uno spettacolo unico ed esplosivo che proietterà gli spettatori in un'epoca senza tempo, in cui il fuoco è il protagonista.",
        "L'atmosfera incanta grazie anche alle melodie scelte presentando ogni volta nuovi effetti e particolari suggestioni.",
      ],
    },
    {
      id: "spettacolo-inferno-dante",
      paragrafi: [
        "\"L'Inferno di Dante\" è la trasposizione teatrale della prima cantica della Divina Commedia di Dante Alighieri.",
        "Uno spettacolo che guida il pubblico attraverso i nove cerchi dell'inferno, accompagnato da Dante e Virgilio, incontrando i personaggi più celebri citati dal poeta e le figure terrificanti che popolano l'abisso eterno.",
        "Gli attori recitano i versi originali dell'opera, usando il movimento fisico e l'espressività per dare forma ai luoghi e alle creature infernali. Una prova di grande perizia e dedizione al lavoro dell'attore che non mancherà di stupire e coinvolgere gli spettatori.",
        "Lo spettacolo rappresenta un'opera fedele al testo originale, senza reinterpretazioni o modifiche. Combina paesaggio, arte scenica e rappresentazione in una forma inedita, pensata sia per gli appassionati della Divina Commedia che per gli amanti del teatro.",
      ],
    },
    {
      id: "spettacolo-miseria-nobilta",
      paragrafi: [
        "La celebre commedia di Eduardo Scarpetta del 1887 viene riproposta dagli artisti di Caraval con le tecniche e i personaggi della commedia dell'arte.",
        "Felice Sciosciammocca e Pasquale o'Salassatore verranno sostituiti da Arlecchino e Pulcinella e tutta la rappresentazione assumerà i colori e i toni del carnevale.",
        "Il regista Lorenzo Samanni si è premurato in questo riadattamento di non tradire lo spirito dell'opera originale e soprattutto di non intervenire sulla trama ma di esaltarne gli aspetti comici e temi.",
        "Sul palco 9 attori in una danza di equivoci, situazioni paradossali e divertenti in grado di intrattenere ogni genere di pubblico.",
        "La lotta tra i \"poveri\", i \"nobili\" e gli \"arricchiti\" verrà combattuta tra zanni, padroni e innamorati: in questo allestimento la comicità sarà esplosiva, il coinvolgimento del pubblico inevitabile e il lieto fine garantito.",
        "Una messinscena per dimostrare come spesso le differenze sociali sono solo una banalissima maschera sotto la quale siamo tutti uguali.",
      ],
    },
  ];

  for (const { id, paragrafi } of descrizioniDaSitoAttuale) {
    const blocks = paragrafi.flatMap((p) => block(p));
    await client
      .patch(id)
      .setIfMissing({ descrizioneNarrativa: blocks })
      .commit();
    console.log(`✓ patch: ${id}.descrizioneNarrativa (da caraval.it)`);
  }

  // 14b. Patch descrizioneBreve sugli 8 spettacoli homepage accordion (Hotfix 4).
  //      setIfMissing → non sovrascrive se Vera ha editato. Excerpt 1-2 righe
  //      per ogni voce accordion del repertorio homepage.
  const descrizioniHomepage: Array<{ id: string; testo: string }> = [
    {
      id: "spettacolo-romeo-giulietta",
      testo:
        "Una rilettura cruda di Shakespeare ambientata all'Inferno. Due personaggi-diavoli trovano un baule e un copione: il gioco diventa tragedia.",
    },
    {
      id: "spettacolo-fine-del-mondo",
      testo:
        "Drammaturgia originale premiata Atelier Leà 2025. Una riflessione sul confine tra realtà e proiezione.",
    },
    {
      id: "spettacolo-arlecchino",
      testo:
        "La maschera classica della Commedia dell'Arte rivista in chiave contemporanea, tra zanni e padroni innamorati.",
    },
    {
      id: "spettacolo-banalita-del-male",
      testo:
        "Una rilettura teatrale ispirata all'opera di Hannah Arendt sul tema del male ordinario.",
    },
    {
      id: "spettacolo-cubiculum-diaboli",
      testo:
        "Spettacolo di fuoco notturno. Atmosfere infernali, fiamme e narrazione per spazi all'aperto.",
    },
    {
      id: "spettacolo-macbeth",
      testo:
        "Il dramma shakespeariano portato in piazza con elementi di teatro di fuoco e maschere.",
    },
    {
      id: "spettacolo-skog",
      testo:
        "Narrazione e fuoco per un racconto fantastico ispirato alla natura selvaggia delle terre del nord.",
    },
    {
      id: "spettacolo-legend",
      testo:
        "Spettacolo di fuoco e narrazione su miti e leggende popolari, per rievocazioni e feste medievali.",
    },
    {
      id: "spettacolo-christmas-carol",
      testo:
        "Tra atmosfere noir e giochi di luci e ombre, la magia del Natale di Dickens prende vita col fuoco.",
    },
    {
      id: "spettacolo-viaggiastorie",
      testo:
        "Teatro di strada: storie portate di piazza in piazza con maschere e oggetti di scena.",
    },
  ];
  for (const { id, testo } of descrizioniHomepage) {
    await client
      .patch(id)
      .setIfMissing({ descrizioneBreve: testo })
      .commit();
    console.log(`✓ patch: ${id}.descrizioneBreve (Hotfix 4)`);
  }

  // 15. Patch descrizioniBreve sui 6 spettacoli Imaginarium 2026 (Hotfix 1).
  //     `upsert` di step 7 non aggiorna document esistenti → serve patch esplicita.
  //     setIfMissing → non sovrascrive se Vera ha editato in Studio.
  for (const s of spettacoliImag2026) {
    if (!s.descrizioneBreve) continue;
    await client
      .patch(s._id)
      .setIfMissing({ descrizioneBreve: s.descrizioneBreve })
      .commit();
    console.log(`✓ patch: ${s._id}.descrizioneBreve`);
  }

  console.log("\n✅ Seed completato.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
