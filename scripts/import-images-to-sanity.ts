/**
 * Import automatico foto e loghi da filesystem Edo a Sanity.
 *
 * Esegui con: `npx tsx scripts/import-images-to-sanity.ts`
 *
 * Pattern di naming (vedi Hotfix_3_Pre_Call.md §8.1):
 * - `hero-sito-generale.*` / `hero-generale.*` → homepageHero.fotoSfondo
 * - `[pagina]-hero.*` → paginaXxxCopy.heroFotoSfondo (imaginarium, formazione, contatti, chi-siamo, ospita, spettacoli)
 * - `copertina-chi-siamo.*` → paginaChiSiamoCopy.heroFotoSfondo
 * - `hero-[slug-spettacolo].*` → spettacolo.fotoHero (es. hero-romeo-giulietta.jpg)
 * - `[slug-spettacolo]-orizzontale.*` → spettacolo.fotoHero
 * - `[slug-spettacolo]-verticale.*` → spettacolo.immagineCover
 * - `[slug-spettacolo]-anteprima.*` → spettacolo.immagineCover
 * - `[slug-membro].*` → membro.foto
 * - `[slug]-imaginarium.*` → spettacoloImaginarium.immagineCover (cerca per nome compagnia)
 * - File in `LOGHI SPONSOR E PREMI/` → homepageCopy.patrociniHomepage[]
 *
 * Lo script è idempotente: re-uploadare la stessa foto sostituisce l'asset.
 */

import { createClient } from "@sanity/client";
import { readdir, readFile, stat } from "fs/promises";
import { join, basename, extname } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Mancano NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_API_WRITE_TOKEN in .env.local"
  );
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

const VALID_IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

type ImageMapping =
  | {
      kind: "singleField";
      docId: string;
      field: string;
    }
  | {
      kind: "patrocinio";
      nome: string;
    };

const PAGINA_TO_DOC: Record<string, string> = {
  imaginarium: "paginaImaginariumCopy",
  formazione: "homepageCopy", // group formazione → campo dentro homepageCopy
  calendario: "homepageCopy",
  contatti: "paginaContattiCopy",
  "chi-siamo": "paginaChiSiamoCopy",
  ospita: "paginaOspitaCopy",
};

const PAGINA_TO_FIELD: Record<string, string> = {
  imaginarium: "heroFotoSfondo",
  formazione: "formazioneHeroFotoSfondo",
  calendario: "calendarioHeroFotoSfondo",
  contatti: "heroFotoSfondo",
  "chi-siamo": "heroFotoSfondo",
  ospita: "heroFotoSfondo",
};

/** Normalizza un nome file: rimuove accenti, lowercase, underscore→trattino. */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
}

/** Strip prefix articoli italiani comuni da slug. */
function stripArticlePrefix(slug: string): string {
  return slug.replace(/^(la-|il-|lo-|i-|le-|gli-|un-|una-|uno-)/, "");
}

async function findDocBySlug(
  type: string,
  slug: string
): Promise<string | null> {
  // Prova lo slug esatto, poi senza articolo, poi prefix-match con i doc esistenti.
  for (const candidate of [slug, stripArticlePrefix(slug)]) {
    const id = await client.fetch<string | null>(
      `*[_type == $type && slug.current == $slug][0]._id`,
      { type, slug: candidate }
    );
    if (id) return id;
  }
  // Prefix match
  const all = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == $type]{ _id, "slug": slug.current }`,
    { type }
  );
  const stripped = stripArticlePrefix(slug);
  const partial = all.find(
    (s) =>
      s.slug &&
      (s.slug.startsWith(slug) ||
        s.slug.startsWith(stripped) ||
        slug.startsWith(s.slug) ||
        stripped.startsWith(s.slug))
  );
  return partial?._id ?? null;
}

async function findSpettacoloImagByCompagnia(
  compagniaSlug: string
): Promise<string | null> {
  // Carica tutti gli spettacoloImaginarium e fa fuzzy match in JS.
  // Più robusto del GROQ `match` che è word-based.
  const all = await client.fetch<
    Array<{ _id: string; compagnia: { nome?: string } }>
  >(
    `*[_type == "spettacoloImaginarium" && defined(compagnia.nome)]{ _id, compagnia }`
  );
  const needle = compagniaSlug.replace(/-/g, "").toLowerCase();
  const match = all.find((s) => {
    const haystack = (s.compagnia.nome ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    return haystack.includes(needle) || needle.includes(haystack.slice(0, 6));
  });
  return match?._id ?? null;
}

async function classifyFoto(filename: string): Promise<ImageMapping | null> {
  const ext = extname(filename).toLowerCase();
  const raw = filename.slice(0, -ext.length);
  // Normalizza: rimuovi accenti, lowercase, underscore→trattino
  const name = normalize(raw);

  // Pattern: hero generale
  if (name === "hero-sito-generale" || name === "hero-generale") {
    return { kind: "singleField", docId: "homepageHero", field: "fotoSfondo" };
  }

  // Pattern: copertina-chi-siamo (custom)
  if (name === "copertina-chi-siamo") {
    return {
      kind: "singleField",
      docId: "paginaChiSiamoCopy",
      field: "heroFotoSfondo",
    };
  }

  // Pattern: [pagina]-hero
  const heroPagina = name.match(/^([a-z-]+?)-hero$/)?.[1];
  if (heroPagina && PAGINA_TO_DOC[heroPagina]) {
    return {
      kind: "singleField",
      docId: PAGINA_TO_DOC[heroPagina],
      field: PAGINA_TO_FIELD[heroPagina],
    };
  }

  // Pattern: hero-[slug] (es. hero-romeo-giulietta)
  const heroSlug = name.match(/^hero-(.+)$/)?.[1];
  if (heroSlug && !PAGINA_TO_DOC[heroSlug]) {
    // Prima prova come slug spettacolo
    const tryAsSlug = await findDocBySlug("spettacolo", heroSlug);
    if (tryAsSlug) {
      return { kind: "singleField", docId: tryAsSlug, field: "fotoHero" };
    }
    // Prova lo slug esteso (es. romeo-giulietta-inferno-amore)
    const all = await client.fetch<Array<{ _id: string; slug: string }>>(
      `*[_type == "spettacolo"]{ _id, "slug": slug.current }`
    );
    const partial = all.find((s) => s.slug?.startsWith(heroSlug));
    if (partial) {
      return { kind: "singleField", docId: partial._id, field: "fotoHero" };
    }
  }

  // Pattern: [slug]-orizzontale → fotoHero
  const orizSlug = name.match(/^(.+)-orizzontale$/)?.[1];
  if (orizSlug) {
    const tryAsSlug = await findDocBySlug("spettacolo", orizSlug);
    if (tryAsSlug) {
      return { kind: "singleField", docId: tryAsSlug, field: "fotoHero" };
    }
    const all = await client.fetch<Array<{ _id: string; slug: string }>>(
      `*[_type == "spettacolo"]{ _id, "slug": slug.current }`
    );
    const partial = all.find((s) => s.slug?.startsWith(orizSlug));
    if (partial) {
      return { kind: "singleField", docId: partial._id, field: "fotoHero" };
    }
  }

  // Pattern: [slug]-verticale / [slug]-anteprima → immagineCover
  const vertSlug =
    name.match(/^(.+)-verticale$/)?.[1] ??
    name.match(/^(.+)-anteprima$/)?.[1] ??
    name.match(/^(.+)-foto-anteprima$/)?.[1];
  if (vertSlug) {
    const tryAsSlug = await findDocBySlug("spettacolo", vertSlug);
    if (tryAsSlug) {
      return {
        kind: "singleField",
        docId: tryAsSlug,
        field: "immagineCover",
      };
    }
    const all = await client.fetch<Array<{ _id: string; slug: string }>>(
      `*[_type == "spettacolo"]{ _id, "slug": slug.current }`
    );
    const partial = all.find((s) => s.slug?.startsWith(vertSlug));
    if (partial) {
      return {
        kind: "singleField",
        docId: partial._id,
        field: "immagineCover",
      };
    }
  }

  // Pattern: [slug]-imaginarium → spettacoloImaginarium per compagnia
  const imagSlug = name.match(/^(.+)-imaginarium$/)?.[1];
  if (imagSlug) {
    const docId = await findSpettacoloImagByCompagnia(imagSlug);
    if (docId) {
      return { kind: "singleField", docId, field: "immagineCover" };
    }
  }

  // Pattern: nome semplice → prova come slug membro
  const tryMembro = await findDocBySlug("membro", name);
  if (tryMembro) {
    return { kind: "singleField", docId: tryMembro, field: "foto" };
  }

  return null;
}

async function uploadAndPatch(
  srcPath: string,
  mapping: ImageMapping
): Promise<void> {
  const buffer = await readFile(srcPath);
  const filename = basename(srcPath);

  const asset = await client.assets.upload("image", buffer, { filename });
  console.log(`  ✓ asset uploaded: ${asset._id}`);

  if (mapping.kind === "singleField") {
    await client
      .patch(mapping.docId)
      .set({
        [mapping.field]: {
          _type: "image",
          asset: { _ref: asset._id, _type: "reference" },
        },
      })
      .commit();
    console.log(`  ✓ patched: ${mapping.docId}.${mapping.field}`);
  } else if (mapping.kind === "patrocinio") {
    // Append all'array patrociniHomepage solo se non già presente con stesso nome
    const homepageCopy = await client.fetch<{
      patrociniHomepage?: Array<{ _key?: string; nome?: string; logo?: unknown }>;
    }>(`*[_id == "homepageCopy"][0]{ patrociniHomepage }`);
    const existing = homepageCopy.patrociniHomepage ?? [];
    const existingIdx = existing.findIndex(
      (p) => p.nome?.toLowerCase() === mapping.nome.toLowerCase()
    );

    if (existingIdx >= 0) {
      const key = existing[existingIdx]._key ?? `pat-${mapping.nome.replace(/\s+/g, "-")}`;
      await client
        .patch("homepageCopy")
        .set({
          [`patrociniHomepage[_key=="${key}"].logo`]: {
            _type: "image",
            asset: { _ref: asset._id, _type: "reference" },
          },
        })
        .commit();
      console.log(`  ✓ patched logo: ${mapping.nome} (existing entry)`);
    } else {
      const newKey = `pat-${mapping.nome
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
      await client
        .patch("homepageCopy")
        .setIfMissing({ patrociniHomepage: [] })
        .append("patrociniHomepage", [
          {
            _key: newKey,
            _type: "patrocinioItem",
            nome: mapping.nome,
            logo: {
              _type: "image",
              asset: { _ref: asset._id, _type: "reference" },
            },
          },
        ])
        .commit();
      console.log(`  ✓ appended patrocinio: ${mapping.nome}`);
    }
  }
}

function prettyNomeLogo(filename: string): string {
  const ext = extname(filename);
  const name = filename.slice(0, -ext.length);
  // Rimuovi suffissi tipo "-imaginarium", "-web", "-1-3" etc.
  return name
    .replace(/-imaginarium$/i, "")
    .replace(/[-_]?\d+([-_]\d+)*([-_]?web)?$/i, "")
    .replace(/[-_]/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

async function main() {
  console.log("\n=== IMPORT FOTO/LOGHI → Sanity ===\n");
  console.log(`Project: ${projectId}`);
  console.log(`Foto:    ${FOTO_DIR}`);
  console.log(`Loghi:   ${LOGHI_DIR}\n`);

  const succeeded: string[] = [];
  const failed: Array<{ file: string; reason: string }> = [];

  // FOTO
  let fotoFiles: string[] = [];
  try {
    fotoFiles = await readdir(FOTO_DIR);
  } catch (err) {
    console.warn(`⚠ Cartella foto non trovata: ${FOTO_DIR}`);
  }

  for (const filename of fotoFiles) {
    const srcPath = join(FOTO_DIR, filename);
    try {
      const st = await stat(srcPath);
      if (!st.isFile()) continue;
    } catch {
      continue;
    }
    const ext = extname(filename).toLowerCase();
    if (!VALID_IMG_EXT.includes(ext)) continue;

    console.log(`→ ${filename}`);
    let mapping: ImageMapping | null = null;
    try {
      mapping = await classifyFoto(filename);
    } catch (err) {
      console.error(`  ✗ classify error: ${(err as Error).message}`);
      failed.push({ file: filename, reason: "classify error" });
      continue;
    }
    if (!mapping) {
      console.warn(`  ⚠ nessun pattern riconosciuto`);
      failed.push({ file: filename, reason: "nessun pattern riconosciuto" });
      continue;
    }
    try {
      await uploadAndPatch(srcPath, mapping);
      succeeded.push(filename);
    } catch (err) {
      console.error(`  ✗ upload/patch error: ${(err as Error).message}`);
      failed.push({ file: filename, reason: (err as Error).message });
    }
  }

  // LOGHI
  let loghiFiles: string[] = [];
  try {
    loghiFiles = await readdir(LOGHI_DIR);
  } catch (err) {
    console.warn(`\n⚠ Cartella loghi non trovata: ${LOGHI_DIR}`);
  }

  for (const filename of loghiFiles) {
    const srcPath = join(LOGHI_DIR, filename);
    try {
      const st = await stat(srcPath);
      if (!st.isFile()) continue;
    } catch {
      continue;
    }
    const ext = extname(filename).toLowerCase();
    if (!VALID_IMG_EXT.includes(ext)) {
      console.log(`→ ${filename} (skip: ext ${ext})`);
      continue;
    }

    console.log(`→ ${filename}`);
    const nome = prettyNomeLogo(filename);
    try {
      await uploadAndPatch(srcPath, { kind: "patrocinio", nome });
      succeeded.push(filename);
    } catch (err) {
      console.error(`  ✗ upload/patch error: ${(err as Error).message}`);
      failed.push({ file: filename, reason: (err as Error).message });
    }
  }

  // SUMMARY
  console.log(`\n=== SUMMARY ===`);
  console.log(`✓ ${succeeded.length} file importati`);
  if (failed.length > 0) {
    console.log(`✗ ${failed.length} file falliti / senza mapping:`);
    for (const f of failed) {
      console.log(`  - ${f.file} (${f.reason})`);
    }
    console.log(`\nQuesti file vanno caricati manualmente da Sanity Studio.`);
  } else {
    console.log(`\nTutti i file processati correttamente.`);
  }
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});
