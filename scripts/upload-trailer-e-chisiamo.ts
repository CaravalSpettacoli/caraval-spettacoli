/**
 * Upload 5 trailerYoutube su spettacoli + video Scuola di Magia su paginaChiSiamoCopy.
 *
 * Uso: npx tsx scripts/upload-trailer-e-chisiamo.ts
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

const TRAILERS: Array<{ slug: string; url: string }> = [
  { slug: "fine-del-mondo", url: "https://youtu.be/UtvPHuZ7xT0" },
  { slug: "sogno-mezza-estate", url: "https://youtu.be/uJ5DyUptSwo" },
  { slug: "christmas-carol", url: "https://youtu.be/PJIZhDOt-YE" },
  { slug: "servitore-due-padroni", url: "https://youtu.be/OtOZ1X0Ss84" },
  { slug: "inferno-dante", url: "https://youtu.be/yOiEx0-beRE" },
];

const SCUOLA_MAGIA_VIDEO = "https://youtu.be/2H0xKo_SzM0";

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

async function patchByIdIfExists(id: string, patch: Record<string, unknown>): Promise<boolean> {
  const exists = await client.fetch<string | null>(`*[_id==$id][0]._id`, { id });
  if (!exists) return false;
  await withRetry(
    () => client.patch(id).set(patch).commit(),
    `patch ${id}`,
  );
  console.log(`  · patched ${id}`);
  return true;
}

async function main() {
  console.log("\n========== TRAILER SPETTACOLI ==========\n");
  for (const { slug, url } of TRAILERS) {
    console.log(`→ ${slug}: trailerYoutube = ${url}`);
    const pubId = `spettacolo-${slug === "servitore-due-padroni" ? "servitore-due-padroni" : slug.replace(/^romeo-giulietta.*/, "romeo-giulietta")}`;
    // Generic lookup via slug to avoid hardcoded id mismatches.
    const ids = await client.fetch<Array<{ _id: string }>>(
      `*[_type=="spettacolo" && slug.current==$slug]{_id}`,
      { slug },
    );
    if (ids.length === 0) {
      console.log(`  ⚠ doc non trovato per slug ${slug}`);
      continue;
    }
    for (const { _id } of ids) {
      await patchByIdIfExists(_id, { trailerYoutube: url });
    }
  }

  console.log("\n========== CHI SIAMO — SCUOLA DI MAGIA VIDEO ==========\n");
  console.log(`→ paginaChiSiamoCopy.scuolaMagiaVideoYoutube = ${SCUOLA_MAGIA_VIDEO}`);
  // Patch both published + draft if exist.
  for (const id of ["paginaChiSiamoCopy", "drafts.paginaChiSiamoCopy"]) {
    await patchByIdIfExists(id, { scuolaMagiaVideoYoutube: SCUOLA_MAGIA_VIDEO });
  }

  console.log("\n========== REPORT ==========\n");
  const slugs = TRAILERS.map((t) => t.slug);
  const checks = await client.fetch<Array<{ slug: string; trailerYoutube?: string }>>(
    `*[_type=="spettacolo" && !(_id in path("drafts.**")) && slug.current in $slugs]{"slug":slug.current,trailerYoutube} | order(slug asc)`,
    { slugs },
  );
  console.log("Trailer (published):");
  for (const r of checks) {
    console.log(`  ${r.trailerYoutube ? "✅" : "⚠️ "} ${r.slug} → ${r.trailerYoutube ?? "(vuoto)"}`);
  }
  const chi = await client.fetch<{ scuolaMagiaVideoYoutube?: string } | null>(
    `*[_id=="paginaChiSiamoCopy"][0]{scuolaMagiaVideoYoutube}`,
  );
  console.log(`\nChi siamo:\n  ${chi?.scuolaMagiaVideoYoutube ? "✅" : "⚠️ "} scuolaMagiaVideoYoutube → ${chi?.scuolaMagiaVideoYoutube ?? "(vuoto)"}\n`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
