/**
 * Rinomina "Formazione" → "Caraval Academy" nei contenuti già pubblicati su Sanity.
 * Il codice è già stato aggiornato: qui si allineano i testi che vivono nel CMS.
 *
 * Idempotente: ogni patch scatta solo se il valore corrente è ancora quello vecchio.
 * Uso: npx tsx scripts/rename-formazione-to-academy.ts
 */
import { createClient } from "@sanity/client";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

/** Slug Sanity-compatibile: NFD per spogliare gli accenti, poi kebab-case. */
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

async function patchHomepageCopy() {
  console.log("\n→ homepageCopy");
  const doc = await client.fetch<{
    officinaEyebrow?: string;
    officinaCtaLink?: string;
    formazioneHeroEyebrow?: string;
    corsoCardCtaLabel?: string;
  } | null>(
    `*[_id=="homepageCopy"][0]{officinaEyebrow, officinaCtaLink, formazioneHeroEyebrow, corsoCardCtaLabel}`
  );
  if (!doc) return console.log("  · documento assente, salto");

  const set: Record<string, string> = {};
  if (doc.officinaCtaLink === "/formazione")
    set.officinaCtaLink = "/caraval-academy";
  if (doc.officinaEyebrow === "FORMAZIONE")
    set.officinaEyebrow = "CARAVAL ACADEMY";
  if (doc.formazioneHeroEyebrow === "FORMAZIONE")
    set.formazioneHeroEyebrow = "CARAVAL ACADEMY";
  if (!doc.corsoCardCtaLabel) set.corsoCardCtaLabel = "Scopri il corso";

  if (Object.keys(set).length === 0) return console.log("  · già allineato");
  await client.patch("homepageCopy").set(set).commit();
  for (const [k, v] of Object.entries(set)) console.log(`  · ${k} → "${v}"`);
}

async function patchFaq() {
  console.log("\n→ paginaFormazioneCopy.faq");
  const doc = await client.fetch<{
    faq?: Array<{ _key?: string; _type?: string; domanda?: string; risposta?: string }>;
  } | null>(`*[_id=="paginaFormazioneCopy"][0]{faq}`);
  if (!doc?.faq?.length) return console.log("  · nessuna FAQ, salto");

  const sostituisci = (t?: string) =>
    t
      ?.replace(/pagina Formazione/g, "pagina Caraval Academy")
      .replace(/percorsi di formazione teatrale/g, "i corsi della Caraval Academy");

  const nuove = doc.faq.map((f) => ({
    ...f,
    domanda: sostituisci(f.domanda) ?? f.domanda,
    risposta: sostituisci(f.risposta) ?? f.risposta,
  }));

  const cambiate = nuove.filter(
    (n, i) =>
      n.domanda !== doc.faq![i].domanda || n.risposta !== doc.faq![i].risposta
  );
  if (cambiate.length === 0) return console.log("  · già allineate");

  await client.patch("paginaFormazioneCopy").set({ faq: nuove }).commit();
  console.log(`  · ${cambiate.length} FAQ aggiornate`);
}

async function patchContatti() {
  console.log("\n→ paginaContattiCopy.aree");
  const doc = await client.fetch<{
    aree?: Array<{ _key?: string; icona?: string; eyebrow?: string }>;
  } | null>(`*[_id=="paginaContattiCopy"][0]{aree}`);
  if (!doc?.aree?.length) return console.log("  · nessuna area, salto");

  const idx = doc.aree.findIndex((a) => a.icona === "formazione");
  if (idx === -1) return console.log("  · area formazione assente, salto");
  if (doc.aree[idx].eyebrow !== "CORSI E FORMAZIONE")
    return console.log("  · già allineata");

  const aree = [...doc.aree];
  aree[idx] = { ...aree[idx], eyebrow: "CARAVAL ACADEMY" };
  await client.patch("paginaContattiCopy").set({ aree }).commit();
  console.log('  · eyebrow → "CARAVAL ACADEMY"');
}

async function generaSlugCorsiMancanti() {
  console.log("\n→ slug corsi");
  const corsi = await client.fetch<
    Array<{ _id: string; titolo?: string; slug?: string }>
  >(`*[_type=="corso"]{_id, titolo, "slug": slug.current}`);

  const senzaSlug = corsi.filter((c) => !c.slug && c.titolo);
  if (senzaSlug.length === 0)
    return console.log(`  · tutti i ${corsi.length} corsi hanno già lo slug`);

  for (const c of senzaSlug) {
    const current = slugify(c.titolo!);
    await client
      .patch(c._id)
      .set({ slug: { _type: "slug", current } })
      .commit();
    console.log(`  · ${c.titolo} → /caraval-academy/${current}`);
  }
}

async function main() {
  console.log("===== Formazione → Caraval Academy (contenuti Sanity) =====");
  await patchHomepageCopy();
  await patchFaq();
  await patchContatti();
  await generaSlugCorsiMancanti();
  console.log("\n✓ Fatto.\n");
}

main().catch((e) => {
  console.error("\n✗ Errore:", e?.message ?? e);
  process.exit(1);
});
