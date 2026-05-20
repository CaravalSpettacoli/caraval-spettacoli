/**
 * Import foto/loghi Hotfix 6 — con override espliciti decisi dalla mappatura
 * interattiva Edo (vedi conversazione Hotfix_6 in PR #10).
 *
 * Esegui con: `npx tsx scripts/import-images-hotfix-6.ts`
 *
 * Cosa fa:
 * 1. Per ogni filename nella mappa `OVERRIDES`: upload + patch al docId.field specificato
 * 2. Skippa i filename in `SKIP` (decisione Edo)
 * 3. Per i loghi sponsor: RESET completo dell'array `patrociniHomepage` e
 *    caricamento dei 5 patrocini finali con nomi puliti (Bacco da seta, Danesi,
 *    Pro Loco Soncino, Comune di Soncino, Viaggia Storie).
 *
 * Idempotente: re-run sostituisce gli asset (nuovo asset id, ma immagine
 * aggiornata).
 */

import { createClient } from "@sanity/client";
import { readFile } from "fs/promises";
import { join, basename, extname } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Mancano env Sanity in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

const FOTO_DIR =
  "/Users/edoardobiondi/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/FOTO PER SITO";
const LOGHI_DIR =
  "/Users/edoardobiondi/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/LOGHI SPONSOR E PREMI";

// ---------- 1. Override espliciti FOTO (filename → {docId, field}) ----------

type Target = { docId: string; field: string };

const OVERRIDES: Record<string, Target> = {
  // Hero pagine
  "hero-sito-generale.jpg": { docId: "homepageHero", field: "fotoSfondo" },
  "imaginarium-hero.jpg": {
    docId: "paginaImaginariumCopy",
    field: "heroFotoSfondo",
  },
  "copertina-chi-siamo.jpeg": {
    docId: "paginaChiSiamoCopy",
    field: "heroFotoSfondo",
  },

  // Spettacoli attivi: cover + hero (sovrascrivono test attuali)
  "hero-romeo-giulietta.jpg": {
    docId: "spettacolo-romeo-giulietta",
    field: "fotoHero",
  },
  "romeo-giulietta-anteprima.jpg": {
    docId: "spettacolo-romeo-giulietta",
    field: "immagineCover",
  },
  "foto-arlecchino-orizzontale.jpeg": {
    docId: "spettacolo-arlecchino",
    field: "fotoHero",
  },
  "arlecchino-verticale-2.png": {
    docId: "spettacolo-arlecchino",
    field: "immagineCover",
  },
  "la-fine-del-mondo-orizzontale.jpg": {
    docId: "spettacolo-fine-del-mondo",
    field: "fotoHero",
  },
  "la-fine-del-mondo-verticale.jpg": {
    docId: "spettacolo-fine-del-mondo",
    field: "immagineCover",
  },
  "Miseria_Nobiltà-orizzontale.jpg": {
    docId: "spettacolo-miseria-nobilta",
    field: "fotoHero",
  },
  "Miseria_Nobiltà-verticale.jpg": {
    docId: "spettacolo-miseria-nobilta",
    field: "immagineCover",
  },
  "viaggiastorie-foto-anteprima.jpg": {
    docId: "spettacolo-viaggiastorie",
    field: "immagineCover",
  },

  // Spettacoli archivio
  "giovannaarco-orizzontale.jpeg": {
    docId: "spettacolo-giovanna-darco",
    field: "fotoHero",
  },
  "giovannaarco-verticale-2.jpeg": {
    docId: "spettacolo-giovanna-darco",
    field: "immagineCover",
  },
  "sogno-notte-mezza-estate-orizzontale.jpeg": {
    docId: "spettacolo-sogno-mezza-estate",
    field: "fotoHero",
  },
  "sogno-notte-mezza-estate-verticale.jpeg": {
    docId: "spettacolo-sogno-mezza-estate",
    field: "immagineCover",
  },
  "DanteCremArena-271.jpg": {
    docId: "spettacolo-inferno-dante",
    field: "fotoHero",
  },
  "DanteCremArena-295.jpg": {
    docId: "spettacolo-inferno-dante",
    field: "immagineCover",
  },

  // Membri
  "vera-rossini.jpg": { docId: "membro-vera-rossini", field: "foto" },
  "nicola-pignoli.jpg": { docId: "membro-nicola-pignoli", field: "foto" },

  // Imaginarium 2025 — versioni "Imaginarium2025_*" sono quelle ufficiali
  "Imaginarium2025_LESMOUSTACHES-orizzontale.jpg": {
    docId: "imag-2025-ciccio-speranza",
    field: "immagineCover",
  },
  "Imaginarium2025_STIVALACCIO-orizzontale.jpg": {
    docId: "imag-2025-buffoni-inferno",
    field: "immagineCover",
  },
  "Imaginarium2025_TDB-orizzontale.jpg": {
    docId: "imag-2025-elena",
    field: "immagineCover",
  },
  "Imaginarium2025-OFFICINE-orizzontale.jpg": {
    docId: "imag-2025-due-partite",
    field: "immagineCover",
  },
  "imaginarium-2025-burambo-orizzontale.jpg": {
    docId: "imag-2025-amore-psiche",
    field: "immagineCover",
  },
  "brancaglione-imaginarium.jpg": {
    docId: "imag-2025-brancaglione",
    field: "immagineCover",
  },
};

// ---------- 2. File da skippare (decisione Edo) ----------

const SKIP = new Set<string>([
  // Hero pagina /imaginarium: vince imaginarium-hero.jpg
  "IMAGINARIUM-orizzontale.jpg",
  // Duplicati delle versioni Imaginarium2025_*
  "stivalaccio-imaginarium.jpg",
  "tournee-imaginarium.jpg",
  "les-moustaches-imaginarium.jpg",
  // Generici "spettacolo-fuoco-*": non assegnabili a uno spettacolo specifico
  "spettacolo-fuoco-orizzontale.jpg",
  "spettacolo-fuoco-orizzontale-2.jpg",
  "spettacolo-fuoco-verticale.png",
  // Non match
  "adariapaoletta-imaginarium.jpg",
  "Imaginarium2025_FRATERNAL-orizzontale.jpg",
  "WhatsApp Image 2026-05-18 at 11.36.54.jpeg",
]);

// ---------- 3. Patrocini finali (decisione Edo) ----------
// Lista DEFINITIVA dei 5 partner Imaginarium per homepage/imaginarium.

type Patrocinio = { nome: string; filename: string };

const PATROCINI_FINALI: Patrocinio[] = [
  { nome: "Bacco da seta", filename: "Bacco-da-seta-imaginarium.png" },
  { nome: "Danesi", filename: "logo-danesi.jpeg" },
  { nome: "Pro Loco Soncino", filename: "LogoProLocoSoncino.png" },
  { nome: "Comune di Soncino", filename: "stemma.png" },
  { nome: "Viaggia Storie", filename: "viaggiastorie-imaginarium.png" },
];

// ---------- helpers ----------

async function uploadAsset(srcPath: string): Promise<string> {
  const buffer = await readFile(srcPath);
  const filename = basename(srcPath);
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset._id;
}

async function patchSingleField(
  docId: string,
  field: string,
  assetId: string
): Promise<void> {
  await client
    .patch(docId)
    .set({
      [field]: {
        _type: "image",
        asset: { _ref: assetId, _type: "reference" },
      },
    })
    .commit();
}

// ---------- main ----------

async function main() {
  console.log("\n=== IMPORT HOTFIX 6 ===\n");

  const succeeded: string[] = [];
  const failed: Array<{ file: string; reason: string }> = [];

  // FOTO con override
  console.log("--- FOTO (override espliciti) ---");
  for (const [filename, target] of Object.entries(OVERRIDES)) {
    const srcPath = join(FOTO_DIR, filename);
    console.log(`→ ${filename}`);
    try {
      const assetId = await uploadAsset(srcPath);
      await patchSingleField(target.docId, target.field, assetId);
      console.log(`  ✓ patched: ${target.docId}.${target.field}`);
      succeeded.push(filename);
    } catch (err) {
      const msg = (err as Error).message;
      console.error(`  ✗ ${msg}`);
      failed.push({ file: filename, reason: msg });
    }
  }

  // FOTO skippati
  console.log("\n--- FOTO skippati (decisione Edo) ---");
  Array.from(SKIP).forEach((f) => {
    console.log(`  · skip: ${f}`);
  });

  // LOGHI — reset completo + carica i 5 finali
  console.log("\n--- LOGHI: reset array patrociniHomepage + 5 entries ---");
  const newPatrociniEntries: Array<{
    _key: string;
    _type: string;
    nome: string;
    logo: { _type: string; asset: { _ref: string; _type: string } };
  }> = [];

  for (const p of PATROCINI_FINALI) {
    const srcPath = join(LOGHI_DIR, p.filename);
    console.log(`→ ${p.nome} (${p.filename})`);
    try {
      const assetId = await uploadAsset(srcPath);
      const ext = extname(p.filename).toLowerCase();
      const validExts = [".jpg", ".jpeg", ".png", ".webp"];
      if (!validExts.includes(ext)) {
        console.warn(
          `  ⚠ estensione ${ext} potrebbe non essere supportata da Sanity`
        );
      }
      newPatrociniEntries.push({
        _key: `pat-${p.nome.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        _type: "patrocinioItem",
        nome: p.nome,
        logo: {
          _type: "image",
          asset: { _ref: assetId, _type: "reference" },
        },
      });
      console.log(`  ✓ asset uploaded: ${assetId}`);
      succeeded.push(p.filename);
    } catch (err) {
      const msg = (err as Error).message;
      console.error(`  ✗ ${msg}`);
      failed.push({ file: p.filename, reason: msg });
    }
  }

  // Override completo dell'array (rimuove i 9 esistenti, inserisce i 5 nuovi)
  await client
    .patch("homepageCopy")
    .set({ patrociniHomepage: newPatrociniEntries })
    .commit();
  console.log(
    `\n  ✓ homepageCopy.patrociniHomepage reset → ${newPatrociniEntries.length} entries`
  );

  // SUMMARY
  console.log(`\n=== SUMMARY ===`);
  console.log(`✓ ${succeeded.length} file importati`);
  if (failed.length > 0) {
    console.log(`\n✗ ${failed.length} file falliti:`);
    for (const f of failed) {
      console.log(`  - ${f.file}: ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});
