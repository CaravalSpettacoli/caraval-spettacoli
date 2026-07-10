/**
 * Upload finale: Imaginarium 2026 location + Eddidesign logo + FAQ 5 pagine.
 * Uso: npx tsx scripts/upload-finale-imaginarium-faq.ts
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

const HOME = process.env.HOME!;
const OPTIMIZED = `${HOME}/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/MATERIALE_FINALE/_optimized`;

async function withRetry<T>(fn: () => Promise<T>, label: string, attempts = 5): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastErr = e;
      const code = e?.statusCode ?? e?.response?.statusCode;
      const retryable = !code || code >= 500 || code === 429;
      if (!retryable || i === attempts - 1) throw e;
      const delay = 1000 * Math.pow(2, i);
      console.log(`  ⚠ ${label} fallito (${code ?? "?"}), retry tra ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function patchIfExists(id: string, patch: Record<string, unknown>): Promise<boolean> {
  const exists = await client.fetch<string | null>(`*[_id==$id][0]._id`, { id });
  if (!exists) return false;
  await withRetry(
    () => client.patch(id).set(patch).commit({ autoGenerateArrayKeys: true }),
    `patch ${id}`,
  );
  console.log(`  · patched ${id}`);
  return true;
}

// ============ IMAGINARIUM 2026 ============
const IMAGINARIUM_LOCATIONS: Array<{ id: string; locationSpecifica: string }> = [
  { id: "imag-2026-letizia", locationSpecifica: "Rocca Sforzesca, Soncino (CR)" },
  { id: "imag-2026-romeo", locationSpecifica: "Rocca Sforzesca, Soncino (CR)" },
  { id: "imag-2026-james-brown", locationSpecifica: "Teatro Aldo Moro, Orzinuovi (BS)" },
  { id: "imag-2026-mandragola", locationSpecifica: 'Castel Giardino "Il Fagiolo", Soncino (CR)' },
  { id: "imag-2026-matti", locationSpecifica: "Teatro Aldo Moro, Orzinuovi (BS)" },
  { id: "imag-2026-modi", locationSpecifica: "Coop L'Inchiostro, Soncino (CR)" },
];

async function task1Imaginarium() {
  console.log("\n========== IMAGINARIUM 2026 — location ==========\n");
  for (const { id, locationSpecifica } of IMAGINARIUM_LOCATIONS) {
    console.log(`→ ${id}: locationSpecifica = "${locationSpecifica}"`);
    await patchIfExists(id, { locationSpecifica });
    await patchIfExists(`drafts.${id}`, { locationSpecifica });
  }
}

// ============ EDDIDESIGN LOGO ============
async function task2Eddidesign() {
  console.log("\n========== EDDIDESIGN LOGO ==========\n");
  const logoPath = `${OPTIMIZED}/logo-partner/eddidesign.png`;
  const buf = readFileSync(logoPath);
  console.log(`→ upload eddidesign.png (${(buf.length / 1024).toFixed(0)}KB)`);
  const asset = await withRetry(
    () => client.assets.upload("image", buf, { filename: "eddidesign.png" }),
    "upload eddidesign",
  );
  console.log(`  · asset: ${asset._id}`);

  // Patch entry "Eddidesign" già presente — non duplicare.
  for (const docId of ["homepageCopy", "drafts.homepageCopy"]) {
    const doc = await client.fetch<{ patrociniHomepage?: Array<{ _key?: string; nome?: string }> } | null>(
      `*[_id==$id][0]{patrociniHomepage[]{_key,nome}}`,
      { id: docId },
    );
    if (!doc) continue;
    const entry = (doc.patrociniHomepage ?? []).find(
      (p) => p.nome?.trim().toLowerCase() === "eddidesign",
    );
    if (!entry || !entry._key) {
      console.log(`  ⚠ ${docId}: entry Eddidesign non trovata (skip)`);
      continue;
    }
    console.log(`  · ${docId}: patch entry _key=${entry._key}`);
    await withRetry(
      () =>
        client
          .patch(docId)
          .set({
            [`patrociniHomepage[_key=="${entry._key}"].logo`]: {
              _type: "image",
              asset: { _type: "reference", _ref: asset._id },
            },
            [`patrociniHomepage[_key=="${entry._key}"].url`]: "https://eddidesign.it",
          })
          .commit(),
      `patch ${docId}`,
    );
    console.log(`    · OK`);
  }
}

// ============ FAQ ============
type FaqItem = { _type: "faqItem"; domanda: string; risposta: string };

const FAQ_HOME: FaqItem[] = [
  {
    _type: "faqItem",
    domanda: "Chi è Caraval Spettacoli?",
    risposta:
      "Caraval Spettacoli è una compagnia teatrale di Soncino (Cremona) attiva dal 2020, specializzata in teatro di prosa, teatro di fuoco e teatro di strada. Organizza inoltre Imaginarium, il festival di teatro itinerante.",
  },
  {
    _type: "faqItem",
    domanda: "Dove si trova e dove opera Caraval?",
    risposta:
      "Caraval ha sede a Soncino, in provincia di Cremona, e porta i suoi spettacoli in teatri, piazze, castelli ed eventi in tutta la Lombardia e oltre.",
  },
  {
    _type: "faqItem",
    domanda: "Come posso contattare Caraval Spettacoli?",
    risposta:
      "Puoi scrivere a caravalspettacoli@gmail.com o chiamare il numero indicato nella pagina Contatti. Rispondiamo a richieste di spettacoli, collaborazioni e informazioni.",
  },
];

const FAQ_SPETTACOLI: FaqItem[] = [
  {
    _type: "faqItem",
    domanda: "Che generi di spettacoli propone Caraval?",
    risposta:
      "Caraval propone teatro di prosa, teatro di fuoco e teatro di strada, con un repertorio che spazia dai grandi classici (Shakespeare, Dante, Goldoni) a produzioni originali.",
  },
  {
    _type: "faqItem",
    domanda: "Come si prenota o acquista il biglietto per uno spettacolo?",
    risposta:
      "Ogni spettacolo ha le proprie modalità di prenotazione, indicate nella sua pagina: telefono, email o biglietteria del teatro ospitante.",
  },
  {
    _type: "faqItem",
    domanda: "È possibile portare uno spettacolo Caraval nel proprio teatro o evento?",
    risposta:
      "Sì. Tutti gli spettacoli del repertorio possono essere ingaggiati per teatri, rassegne, feste ed eventi privati. Vedi la pagina Ospita per maggiori informazioni.",
  },
  {
    _type: "faqItem",
    domanda: "Gli spettacoli sono adatti a tutte le età?",
    risposta:
      "Il repertorio comprende titoli adatti a pubblici diversi. Le indicazioni su età e durata sono riportate nella scheda di ogni spettacolo.",
  },
];

const FAQ_IMAGINARIUM: FaqItem[] = [
  {
    _type: "faqItem",
    domanda: "Cos'è il festival Imaginarium?",
    risposta:
      "Imaginarium è il festival di teatro itinerante organizzato da Caraval Spettacoli: una rassegna che porta spettacoli dal vivo in luoghi suggestivi come rocche, castelli e teatri del territorio.",
  },
  {
    _type: "faqItem",
    domanda: "Dove e quando si svolge Imaginarium 2026?",
    risposta:
      "L'edizione 2026 si tiene in diverse location tra Soncino e Orzinuovi (Rocca Sforzesca, Teatro Aldo Moro, Castel Giardino \"Il Fagiolo\", Coop L'Inchiostro). Tutti gli spettacoli iniziano alle 21:30. Date e dettagli nella pagina Imaginarium.",
  },
  {
    _type: "faqItem",
    domanda: "Come si partecipa agli spettacoli del festival?",
    risposta:
      "L'ingresso e le modalità di prenotazione sono indicati per ogni serata nella pagina dedicata all'edizione.",
  },
];

const FAQ_FORMAZIONE: FaqItem[] = [
  {
    _type: "faqItem",
    domanda: "Caraval organizza corsi o laboratori teatrali?",
    risposta:
      "Sì, Caraval propone i corsi della Caraval Academy. I dettagli su programmi e iscrizioni sono nella pagina Caraval Academy.",
  },
  {
    _type: "faqItem",
    domanda: "A chi sono rivolti i corsi?",
    risposta:
      "I percorsi si rivolgono a diversi livelli ed età. Contatta Caraval per scoprire il percorso più adatto.",
  },
  {
    _type: "faqItem",
    domanda: "Come ci si iscrive a un corso?",
    risposta: "Puoi richiedere informazioni e iscriverti contattando Caraval via email o telefono.",
  },
];

const FAQ_OSPITA: FaqItem[] = [
  {
    _type: "faqItem",
    domanda: "Come posso ingaggiare Caraval per un evento?",
    risposta:
      "Contatta Caraval descrivendo l'evento (luogo, data, tipo di spettacolo desiderato): riceverai una proposta su misura.",
  },
  {
    _type: "faqItem",
    domanda: "Che tipo di eventi può animare Caraval?",
    risposta:
      "Caraval è adatta a rassegne teatrali, feste cittadine, eventi privati, sagre, inaugurazioni e manifestazioni culturali, con spettacoli di prosa, fuoco e strada.",
  },
  {
    _type: "faqItem",
    domanda: "Quali spazi servono per uno spettacolo?",
    risposta:
      "Le esigenze tecniche variano per spettacolo e sono indicate nella scheda tecnica (rider) scaricabile da ogni pagina spettacolo. Gli spettacoli di fuoco richiedono spazi all'aperto idonei.",
  },
];

const FAQ_TARGETS: Array<{ baseId: string; faq: FaqItem[] }> = [
  { baseId: "homepageCopy", faq: FAQ_HOME },
  { baseId: "paginaSpettacoliCopy", faq: FAQ_SPETTACOLI },
  { baseId: "paginaImaginariumCopy", faq: FAQ_IMAGINARIUM },
  { baseId: "paginaFormazioneCopy", faq: FAQ_FORMAZIONE },
  { baseId: "paginaOspitaCopy", faq: FAQ_OSPITA },
];

async function task3Faq() {
  console.log("\n========== FAQ — 5 singleton pagina ==========\n");
  for (const { baseId, faq } of FAQ_TARGETS) {
    console.log(`→ ${baseId} (${faq.length} domande)`);
    // Idempotente: se faq è già popolato, non sovrascrivere (rispetta eventuali modifiche utente).
    const exists = await client.fetch<{ _id: string; faq?: unknown[] } | null>(
      `*[_id==$id][0]{_id, faq}`,
      { id: baseId },
    );
    if (!exists) {
      // Singleton non ancora creato (caso paginaFormazioneCopy): createIfNotExists con faq.
      await withRetry(
        () =>
          client.createIfNotExists({
            _id: baseId,
            _type: baseId,
            faq,
          } as any),
        `create ${baseId}`,
      );
      console.log(`  · created ${baseId} con ${faq.length} domande`);
      continue;
    }
    if (Array.isArray(exists.faq) && exists.faq.length > 0) {
      console.log(`  ⏭️  ${baseId}: faq già popolato (${exists.faq.length} entries), skip`);
      continue;
    }
    await patchIfExists(baseId, { faq });
    // Patch draft se esiste.
    const draftId = `drafts.${baseId}`;
    const draftExists = await client.fetch<string | null>(`*[_id==$id][0]._id`, { id: draftId });
    if (draftExists) {
      const draftFaq = await client.fetch<unknown[] | null>(`*[_id==$id][0].faq`, { id: draftId });
      if (!draftFaq || (Array.isArray(draftFaq) && draftFaq.length === 0)) {
        await patchIfExists(draftId, { faq });
      } else {
        console.log(`  ⏭️  ${draftId}: faq già popolato (${(draftFaq as unknown[]).length} entries), skip`);
      }
    }
  }
}

async function report() {
  console.log("\n========== REPORT ==========\n");
  const imag = await client.fetch<Array<{ _id: string; titolo: string; loc?: string }>>(
    `*[_id in $ids]{_id,titolo,"loc":locationSpecifica} | order(_id asc)`,
    { ids: IMAGINARIUM_LOCATIONS.map((l) => l.id) },
  );
  console.log("Imaginarium 2026:");
  for (const r of imag) {
    console.log(`  ${r.loc ? "✅" : "⚠️ "} ${r._id} → ${r.loc ?? "(vuoto)"}`);
  }

  const hp = await client.fetch<{
    patrociniHomepage?: Array<{ nome?: string; logo?: { asset?: { _ref?: string } }; url?: string }>;
  } | null>(`*[_id=="homepageCopy"][0]{patrociniHomepage[]{nome,logo,url}}`);
  const eddi = hp?.patrociniHomepage?.find((p) => p.nome?.toLowerCase() === "eddidesign");
  console.log(`\nEddidesign:`);
  console.log(
    `  ${eddi?.logo?.asset?._ref ? "✅" : "⚠️ "} logo: ${eddi?.logo?.asset?._ref ? "presente" : "mancante"} · url: ${eddi?.url ?? "(vuoto)"}`,
  );

  console.log(`\nFAQ:`);
  for (const { baseId, faq } of FAQ_TARGETS) {
    const d = await client.fetch<{ faq?: unknown[] } | null>(
      `*[_id==$id][0]{faq}`,
      { id: baseId },
    );
    const n = Array.isArray(d?.faq) ? d!.faq.length : 0;
    console.log(`  ${n > 0 ? "✅" : "⚠️ "} ${baseId} → ${n} domande (atteso: ${faq.length})`);
  }
  console.log();
}

async function main() {
  await task1Imaginarium();
  await task2Eddidesign();
  await task3Faq();
  await report();
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
