/**
 * One-shot: corregge gli orari di tutti gli spettacoloImaginarium dopo
 * l'over-compensazione di +2h che era stata fatta in Studio per aggirare
 * un bug di rendering UTC vs Europe/Rome. Ora che il rendering usa
 * `partsInRome`, gli orari salvati vanno riportati al valore reale.
 *
 * Esecuzione in 2 step storici:
 *  - step 1: -2h a tutti i 14 doc. Le 2026 entries (con suffisso Z) sono
 *    state corrette correttamente. Le 2025 entries (senza Z) sono state
 *    mal-parsate dal runtime locale Europe/Rome e quindi shifted di -4h
 *    netti rispetto alla UTC corretta — vanno riallineate.
 *  - step 2: +2h alle sole 2025 entries per riportarle a 19:30 UTC
 *    (= 21:30 Europe/Rome estate).
 *
 * Lo script ora forza TZ=UTC nel runtime e legge ogni stringa come UTC
 * inequivocabilmente, e applica lo shift una volta sola sui doc che non
 * lo hanno ancora ricevuto. Mantenuto come riferimento storico.
 *
 * Uso: `npx tsx scripts/fix-imaginarium-orari.ts` (richiede SANITY_API_WRITE_TOKEN)
 */

import { config } from "dotenv";
import { createClient } from "@sanity/client";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Mancano NEXT_PUBLIC_SANITY_PROJECT_ID e/o SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

type Doc = { _id: string; titolo?: string; dataInizio?: string };

// IDs delle entries 2025 da riallineare (+2h).
const ENTRIES_2025_DA_RIALLINEARE = new Set([
  "imag-2025-amore-psiche",
  "imag-2025-brancaglione",
  "imag-2025-buffoni-inferno",
  "imag-2025-ciccio-speranza",
  "imag-2025-due-partite",
  "imag-2025-elena",
  "imag-2025-party-finale",
  "imag-2025-party-inaugurazione",
]);

async function main() {
  const docs = await client.fetch<Doc[]>(
    `*[_type == "spettacoloImaginarium" && defined(dataInizio)]{_id, titolo, dataInizio}`
  );

  console.log(`Trovati ${docs.length} documenti con dataInizio.\n`);

  for (const doc of docs) {
    if (!doc.dataInizio) continue;
    if (!ENTRIES_2025_DA_RIALLINEARE.has(doc._id)) {
      console.log(`Skip ${doc._id} (già corretto).`);
      continue;
    }
    const original = new Date(doc.dataInizio);
    if (Number.isNaN(original.getTime())) {
      console.warn(`Skip ${doc._id}: dataInizio non parsabile (${doc.dataInizio})`);
      continue;
    }
    const shifted = new Date(original.getTime() + 2 * 60 * 60 * 1000);
    const newIso = shifted.toISOString();
    console.log(
      `${doc._id.padEnd(40)} "${doc.titolo ?? ""}"\n  prima: ${doc.dataInizio}\n  dopo:  ${newIso}\n`
    );
    await client.patch(doc._id).set({ dataInizio: newIso }).commit();
  }

  console.log("✓ Documenti riallineati.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
