/**
 * Upload finale materiali — PDF rider + gallerie + trailer YT
 *
 * Sorgente:  ~/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/MATERIALE_FINALE/_optimized/
 * Patcha:    spettacolo (published + draft se esiste)
 *
 * Uso:       SANITY_API_WRITE_TOKEN=... npx tsx scripts/upload-materiali-finali.ts
 *            (oppure prende il token da .env.local)
 *
 * Idempotente: Sanity deduplica asset per SHA1; patch su stesso ref è no-op.
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env.local" });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN!;

if (!PROJECT_ID || !TOKEN) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

const HOME = process.env.HOME!;
const ROOT = `${HOME}/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/MATERIALE_FINALE/_optimized`;

type PdfEntry = { slug: string; file: string };
type GalleryEntry = { slug: string; hero: string; cover: string };

const PDF_MAP: PdfEntry[] = [
  { slug: "christmas-carol", file: "../brochure-pdf/A Christmas Carol_compressed.pdf" },
  { slug: "giovanna-darco", file: "brochure-pdf/giovanna-darco-scheda-tecnica.pdf" },
  { slug: "cubiculum-diaboli", file: "../brochure-pdf/Presentazione Cubiculum.pdf" },
  { slug: "inferno-dante", file: "../brochure-pdf/Presentazione L'Inferno di Dante (1).pdf" },
  { slug: "banalita-del-male", file: "../brochure-pdf/presentazione La Banalità del Male.pdf" },
  { slug: "fine-del-mondo", file: "../brochure-pdf/Presentazione LA FINE DEL MONDO rev. 08.2025.pdf" },
  { slug: "legend", file: "../brochure-pdf/Presentazione Legend.pdf" },
  { slug: "macbeth", file: "../brochure-pdf/Presentazione Macbeth.pdf" },
  { slug: "miseria-nobilta", file: "brochure-pdf/miseria-nobilta-presentazione.pdf" },
  { slug: "romeo-giulietta-inferno-amore", file: "../brochure-pdf/Presentazione ROMEO+GIULIETTA rev.02.2026.pdf" },
  { slug: "skog", file: "../brochure-pdf/Presentazione Skog.pdf" },
  { slug: "viaggiastorie", file: "../brochure-pdf/Presentazione Viaggiastorie rid.pdf" },
  { slug: "servitore-due-padroni", file: "../brochure-pdf/Servi e Padroni - presentazione_compressed.pdf" },
];

const GALLERY_MAP: GalleryEntry[] = [
  {
    slug: "cubiculum-diaboli",
    hero: "gallerie/cubiculum/cubiculum-orizzontale.jpg",
    cover: "gallerie/cubiculum/cubiculum-verticale.jpg",
  },
  {
    slug: "legend",
    hero: "gallerie/legend/legend-orizzontale.jpg",
    cover: "gallerie/legend/legend-verticale.jpg",
  },
  {
    slug: "servitore-due-padroni",
    hero: "gallerie/un-servo-due-padroni/servo-padroni-orizzontale.jpg",
    cover: "gallerie/un-servo-due-padroni/servo-padroni-verticale.jpg",
  },
];

const TRAILERS: Array<{ slug: string; url: string }> = [
  { slug: "giovanna-darco", url: "https://youtu.be/BSWIvp-8vaM" },
];

type DocPair = { published?: string; draft?: string };

async function resolveDocsBySlug(slug: string): Promise<DocPair> {
  const docs = await client.fetch<Array<{ _id: string }>>(
    `*[_type=="spettacolo" && slug.current==$slug]{_id}`,
    { slug },
  );
  const pair: DocPair = {};
  for (const d of docs) {
    if (d._id.startsWith("drafts.")) pair.draft = d._id;
    else pair.published = d._id;
  }
  return pair;
}

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

async function uploadFileAsset(absPath: string): Promise<string> {
  const buf = readFileSync(absPath);
  const filename = basename(absPath);
  return withRetry(
    async () => (await client.assets.upload("file", buf, { filename }))._id,
    `upload ${filename}`,
  );
}

async function uploadImageAsset(absPath: string): Promise<string> {
  const buf = readFileSync(absPath);
  const filename = basename(absPath);
  return withRetry(
    async () => (await client.assets.upload("image", buf, { filename }))._id,
    `upload ${filename}`,
  );
}

async function patchDocs(pair: DocPair, patch: Record<string, unknown>, label: string) {
  const targets = [pair.published, pair.draft].filter(Boolean) as string[];
  for (const id of targets) {
    await withRetry(
      () => client.patch(id).set(patch).commit({ autoGenerateArrayKeys: true }),
      `patch ${id}`,
    );
    console.log(`  · patched ${id}`);
  }
  return targets.length;
}

type Report = {
  pdfs: Array<{ slug: string; file: string; status: "ok" | "skip" | "err"; docs: number; note?: string }>;
  gallery: Array<{ slug: string; status: "ok" | "skip" | "err"; docs: number; note?: string }>;
  trailer: Array<{ slug: string; status: "ok" | "err"; docs: number; note?: string }>;
};

async function main() {
  const report: Report = { pdfs: [], gallery: [], trailer: [] };

  console.log("\n========== PDF RIDER ==========\n");
  for (const { slug, file } of PDF_MAP) {
    const abs = `${ROOT}/${file}`;
    if (!existsSync(abs)) {
      console.log(`✗ ${slug}: file mancante ${file}`);
      report.pdfs.push({ slug, file, status: "err", docs: 0, note: "file mancante" });
      continue;
    }
    const pair = await resolveDocsBySlug(slug);
    if (!pair.published && !pair.draft) {
      console.log(`✗ ${slug}: doc non trovato`);
      report.pdfs.push({ slug, file, status: "err", docs: 0, note: "doc non trovato" });
      continue;
    }
    console.log(`→ ${slug}: upload ${basename(abs)}`);
    const assetId = await uploadFileAsset(abs);
    const docs = await patchDocs(
      pair,
      { schedaTecnicaPdf: { _type: "file", asset: { _type: "reference", _ref: assetId } } },
      slug,
    );
    report.pdfs.push({ slug, file: basename(abs), status: "ok", docs });
  }

  console.log("\n========== GALLERIE (fotoHero + immagineCover) ==========\n");
  for (const { slug, hero, cover } of GALLERY_MAP) {
    const heroAbs = `${ROOT}/${hero}`;
    const coverAbs = `${ROOT}/${cover}`;
    if (!existsSync(heroAbs) || !existsSync(coverAbs)) {
      console.log(`✗ ${slug}: file mancante`);
      report.gallery.push({ slug, status: "err", docs: 0, note: "file mancante" });
      continue;
    }
    const pair = await resolveDocsBySlug(slug);
    if (!pair.published && !pair.draft) {
      console.log(`✗ ${slug}: doc non trovato`);
      report.gallery.push({ slug, status: "err", docs: 0, note: "doc non trovato" });
      continue;
    }
    console.log(`→ ${slug}: upload hero ${basename(heroAbs)} + cover ${basename(coverAbs)}`);
    const heroAssetId = await uploadImageAsset(heroAbs);
    const coverAssetId = await uploadImageAsset(coverAbs);
    const docs = await patchDocs(
      pair,
      {
        fotoHero: { _type: "image", asset: { _type: "reference", _ref: heroAssetId } },
        immagineCover: { _type: "image", asset: { _type: "reference", _ref: coverAssetId } },
      },
      slug,
    );
    report.gallery.push({ slug, status: "ok", docs });
  }

  console.log("\n========== TRAILER YOUTUBE ==========\n");
  for (const { slug, url } of TRAILERS) {
    const pair = await resolveDocsBySlug(slug);
    if (!pair.published && !pair.draft) {
      console.log(`✗ ${slug}: doc non trovato`);
      report.trailer.push({ slug, status: "err", docs: 0, note: "doc non trovato" });
      continue;
    }
    console.log(`→ ${slug}: trailerYoutube = ${url}`);
    const docs = await patchDocs(pair, { trailerYoutube: url }, slug);
    report.trailer.push({ slug, status: "ok", docs });
  }

  console.log("\n========== REPORT ==========\n");
  console.log("PDF rider:");
  for (const r of report.pdfs) {
    const icon = r.status === "ok" ? "✅" : r.status === "skip" ? "⏭️ " : "⚠️ ";
    console.log(`  ${icon} ${r.slug} ← ${r.file} (docs patchati: ${r.docs})${r.note ? " — " + r.note : ""}`);
  }
  console.log("\nGallerie:");
  for (const r of report.gallery) {
    const icon = r.status === "ok" ? "✅" : "⚠️ ";
    console.log(`  ${icon} ${r.slug} (docs patchati: ${r.docs})${r.note ? " — " + r.note : ""}`);
  }
  console.log("\nTrailer:");
  for (const r of report.trailer) {
    const icon = r.status === "ok" ? "✅" : "⚠️ ";
    console.log(`  ${icon} ${r.slug} (docs patchati: ${r.docs})${r.note ? " — " + r.note : ""}`);
  }
  console.log();
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
