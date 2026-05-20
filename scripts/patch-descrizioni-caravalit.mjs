/* eslint-disable */
/**
 * Patch descrizioneNarrativa + regia + cast + schedaTecnica per spettacoli con
 * descrizione mancante. Contenuti estratti via WebFetch da caraval.it (sito
 * legacy) come baseline — Vera potrà rifinire dopo.
 *
 * Idempotente: NON sovrascrive campi già popolati.
 *
 * Esegui: npx tsx scripts/patch-descrizioni-caravalit.mjs
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const get = (k) => env.split('\n').find((l) => l.startsWith(k + '='))?.split('=')[1]?.replace(/["']/g, '').trim()

const token = get('SANITY_API_WRITE_TOKEN')
if (!token) {
  console.error('❌ SANITY_API_WRITE_TOKEN mancante in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: get('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: get('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Helper: testo libero (paragrafi separati da \n\n) → array di Portable Text blocks
function toPortableText(text, slugPrefix) {
  const paragraphs = (Array.isArray(text) ? text : text.split('\n\n'))
    .map((p) => (typeof p === 'string' ? p.trim() : String(p ?? '').trim()))
    .filter(Boolean)
  return paragraphs.map((para, i) => ({
    _type: 'block',
    _key: `${slugPrefix}-b${i}`,
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: `${slugPrefix}-s${i}`, text: para, marks: [] },
    ],
  }))
}

// Mappa slug → contenuti estratti da caraval.it
const PATCH_MAP = {
  'viaggiastorie': {
    descrizioneNarrativa: [
      "Spettacolo di piazza ispirato alla Commedia dell'Arte che trasforma la città in palcoscenico.",
      "Avventura, astuzia e tradimento incontrano amore, morte e superstizione attraverso una trilogia di racconti inediti che unisce poesia, commedia dialettale, giocoleria col fuoco e pantomima.",
    ],
    regia: 'Vera Rossini',
    cast: [
      { nome: 'Nicola Pignoli', ruolo: 'attore' },
      { nome: 'Vera Rossini', ruolo: 'attrice' },
      { nome: 'Aurora Rossini', ruolo: 'attrice' },
    ],
    schedaTecnica: { numeroAttori: '3', spazioScenico: 'Spazio aperto (piazza/strada)' },
  },

  'banalita-del-male': {
    descrizioneNarrativa: [
      'Lo spettacolo, liberamente ispirato al libro "La banalità del male" di Hannah Arendt, ha lo scopo di sensibilizzare il pubblico sugli argomenti trattati dall\'autrice e sugli interrogativi sempre attuali che l\'opera pone.',
      "I due attori insceneranno un immaginario processo ad Adolf Eichmann mettendo in luce soprattutto gli aspetti morali e filosofici delle vicende che l'hanno coinvolto.",
      'I pensieri abbracceranno anche le azioni o l\'indifferenza dei cittadini tedeschi, nei quali risiede la vera banalità del male, e che possono diventare un forte punto d\'aggancio col pubblico moderno.',
      "L'avvicendarsi delle riflessioni estratte dalla penna della Arendt diventeranno così i capi d'accusa morali a Eichmann, che arriverà a sconfessare sé stesso: uno spettacolo in cui la riflessione è la vera protagonista, sempre al centro del palcoscenico.",
    ],
    schedaTecnica: { durataMinuti: 60, numeroAttori: '2' },
  },

  'fine-del-mondo': {
    descrizioneNarrativa: [
      "Due anime che si cercano per poi trovarsi, lottando per difendere ciò in cui credono. L'amore che edifica e distrugge, che risana e avvelena, raccontato nella sua veste più autentica mentre passato e futuro s'inseguono, separati da un presente che incombe con i suoi dubbi e le sue certezze.",
      "Una rappresentazione poetica dal sapore dolce e amaro che vuole restituire una prospettiva differente al quotidiano, superando la dimensione del comprendere per giungere a quella del sentire.",
      "Una stanza in penombra, un divano e due cuori che si cercano vicendevolmente: lo spettacolo esprime lo sperimentalismo teatrale contemporaneo, proponendo testi e musiche originali. Una performance poliedrica che unisce recitazione, canto e poesia.",
      "Attraverso narrazione intensa e passionale, il sentimento emerge dall'unione di verso e prosa, in un susseguirsi di immagini e riflessioni perennemente in bilico tra realtà e fantasia.",
      "Lo spettacolo è dedicato a chi ama teatro e letteratura, a coloro che attraverso l'arte intraprendono piccoli grandi viaggi senza sapere cosa cercare.",
    ],
    regia: 'Alessio Rosin · Vera Rossini',
    cast: [
      { nome: 'Nicola Pignoli', ruolo: 'attore' },
      { nome: 'Vera Rossini', ruolo: 'attrice' },
    ],
    schedaTecnica: { numeroAttori: '2', spazioScenico: 'Una stanza in penombra con un divano' },
  },

  'arlecchino': {
    descrizioneNarrativa: [
      "Due maschere immortali della Commedia dell'Arte tornano con una commedia inedita: Arlecchino e Colombina affrontano tre avventure divertenti, esplorando tematiche di identità, amore e fede mentre si scontrano con l'aristocrazia dell'Accademia di Sto Cappio.",
      "Scherzi, inganni, dialetti e trasformismo si combinano per mettere a nudo il genere teatrale stesso.",
    ],
    regia: 'Vera Rossini',
    schedaTecnica: { durataMinuti: 70, numeroAttori: '4' },
  },

  'cubiculum-diaboli': {
    descrizioneNarrativa: [
      "Spettacolo di fuoco, danza e mistero ambientato in una camera da letto medievale. Un rituale demoniaco vede il Diavolo evocare streghe per sedurre una donna innocente.",
      "Affascinata dal fuoco, ella partecipa alla danza delle streghe, ignara del loro scopo diabolico. Un soldato interviene per salvarla, affrontando il Demonio in uno scontro concluso con effetti pirotecnici spettacolari.",
    ],
    regia: 'Nicola Pignoli',
    schedaTecnica: { durataMinuti: 25, numeroAttori: '6', spazioScenico: 'Camera da letto medievale (scenografia)' },
  },

  'macbeth': {
    descrizioneNarrativa: [
      "Adattamento cupo e spettacolare della tragedia shakespeariana che fonde teatro, giocoleria e fuoco. Narra la storia di Macbeth, vassallo scozzese spinto dall'ambizione e dalle profezie di tre streghe, che compie omicidi per conquistare il trono, seminando morte e terrore.",
      "L'intera esibizione è caratterizzata da un'atmosfera surreale con elementi onirici e deliranti, e una spettacolare danza di spade e fiamme.",
    ],
    schedaTecnica: { durataMinuti: 25, numeroAttori: '6–10', spazioScenico: 'Teatro urbano' },
  },

  'skog': {
    descrizioneNarrativa: [
      "Creature animalesche vivono isolate in una foresta misteriosa fino all'arrivo di una ragazzina. Inizialmente catturata e respinta, viene poi accettata come regina grazie alla sua 'magia'.",
      "Ella dona a ciascuna creatura un regalo da condividere, trasformando la solitudine in gioia collettiva attraverso una festa finale trionfale.",
    ],
    regia: 'Nicola Pignoli',
    schedaTecnica: {
      durataMinuti: 25,
      numeroAttori: '8',
      audio: 'Strumenti musicali vari simboleggiano elementi narrativi diversi; coreografie accompagnano le interazioni tra personaggi.',
    },
  },

  'christmas-carol': {
    // christmas-carol ha già narrativa per audit. Patch solo se mancano regia/cast.
    regia: 'Nicola Pignoli',
    cast: [
      { nome: 'Emanuele Gusmaroli', ruolo: 'attore' },
      { nome: 'Claudia Locatelli', ruolo: 'attrice' },
      { nome: 'Giuseppe Moro', ruolo: 'attore' },
      { nome: 'Nicola Pignoli', ruolo: 'attore' },
      { nome: 'Marco Ravelli', ruolo: 'attore' },
      { nome: 'Vera Rossini', ruolo: 'attrice' },
      { nome: 'Lorenzo Samanni', ruolo: 'attore' },
      { nome: 'Claudia Zecchini', ruolo: 'attrice' },
    ],
    schedaTecnica: { numeroAttori: '8' },
  },
}

function isEmpty(v) {
  if (v === null || v === undefined) return true
  if (typeof v === 'string') return v.trim().length === 0
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === 'object') return Object.keys(v).length === 0
  return false
}

const summary = []

for (const [slug, patch] of Object.entries(PATCH_MAP)) {
  const doc = await client.fetch(
    `*[_type == "spettacolo" && slug.current == $slug][0]{
      _id, titolo, descrizioneNarrativa, regia, cast, schedaTecnica
    }`,
    { slug }
  )
  if (!doc) {
    summary.push({ slug, status: 'NOT FOUND' })
    continue
  }

  const set = {}
  let changed = []

  // descrizioneNarrativa: solo se vuota o senza testo
  const currentNarr = doc.descrizioneNarrativa ?? []
  const currentNarrText = currentNarr
    .map((b) => (b?.children ?? []).map((c) => c?.text ?? '').join(''))
    .join('')
    .trim()
  if (patch.descrizioneNarrativa && currentNarrText.length < 30) {
    set.descrizioneNarrativa = toPortableText(patch.descrizioneNarrativa, slug)
    changed.push('descrizioneNarrativa')
  }

  // regia: solo se vuoto
  if (patch.regia && isEmpty(doc.regia)) {
    set.regia = patch.regia
    changed.push('regia')
  }

  // cast: solo se vuoto array
  if (patch.cast && isEmpty(doc.cast)) {
    set.cast = patch.cast.map((c, i) => ({
      _key: `${slug}-cast-${i}`,
      _type: 'object',
      ...c,
    }))
    changed.push('cast')
  }

  // schedaTecnica: merge per-field, solo dove mancano
  const currentScheda = doc.schedaTecnica ?? {}
  const newScheda = { ...currentScheda }
  let schedaChanged = false
  for (const [k, v] of Object.entries(patch.schedaTecnica ?? {})) {
    if (isEmpty(currentScheda[k]) && !isEmpty(v)) {
      newScheda[k] = v
      schedaChanged = true
    }
  }
  if (schedaChanged) {
    set.schedaTecnica = newScheda
    changed.push('schedaTecnica:' + Object.keys(patch.schedaTecnica).join(','))
  }

  if (Object.keys(set).length === 0) {
    summary.push({ slug, status: 'SKIP (campi già popolati)', changed: [] })
    continue
  }

  await client.patch(doc._id).set(set).commit()
  summary.push({ slug, status: 'OK', changed })
}

console.log('\n========== RIEPILOGO ==========')
for (const r of summary) {
  console.log(`  ${r.status.padEnd(28)} ${r.slug}${r.changed?.length ? '  → ' + r.changed.join(', ') : ''}`)
}
