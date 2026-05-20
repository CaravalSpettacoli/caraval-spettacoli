/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Audit Sanity content gaps pre go-live.
 *
 * Esegui: `npx tsx scripts/audit-sanity-gaps.ts`
 *
 * Stampa una tabella di contenuti mancanti che Vera/Edo devono popolare
 * da Studio prima del go-live. Read-only.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

config({ path: resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const audit = await client.fetch<Record<string, unknown>>(`{
    "spettacoliSenzaFotoHero": *[_type == "spettacolo" && inRepertorio == true && !defined(fotoHero)]{ _id, titolo, "slug": slug.current },
    "spettacoliSenzaImmagineCover": *[_type == "spettacolo" && inRepertorio == true && !defined(immagineCover)]{ _id, titolo, "slug": slug.current },
    "spettacoliSenzaDescrizioneBreve": *[_type == "spettacolo" && inRepertorio == true && !defined(descrizioneBreve)]{ _id, titolo, "slug": slug.current },
    "spettacoliSenzaSeoOverride": *[_type == "spettacolo" && inRepertorio == true && !defined(seoTitle)]{ _id, titolo, "slug": slug.current },
    "membriSenzaFoto": *[_type == "membro" && !defined(foto)]{ _id, nome },
    "membriSenzaBio": *[_type == "membro" && (!defined(bio) || length(pt::text(bio)) < 50)]{ _id, nome },
    "singletonsSenzaSeoOverride": [
      {"id": "homepageCopy", "seoTitle": *[_id == "homepageCopy"][0].seoTitle, "seoDescription": *[_id == "homepageCopy"][0].seoDescription, "seoOgImage": *[_id == "homepageCopy"][0].seoOgImage},
      {"id": "paginaSpettacoliCopy", "seoTitle": *[_id == "paginaSpettacoliCopy"][0].seoTitle, "seoDescription": *[_id == "paginaSpettacoliCopy"][0].seoDescription, "seoOgImage": *[_id == "paginaSpettacoliCopy"][0].seoOgImage},
      {"id": "paginaImaginariumCopy", "seoTitle": *[_id == "paginaImaginariumCopy"][0].seoTitle, "seoDescription": *[_id == "paginaImaginariumCopy"][0].seoDescription, "seoOgImage": *[_id == "paginaImaginariumCopy"][0].seoOgImage},
      {"id": "paginaChiSiamoCopy", "seoTitle": *[_id == "paginaChiSiamoCopy"][0].seoTitle, "seoDescription": *[_id == "paginaChiSiamoCopy"][0].seoDescription, "seoOgImage": *[_id == "paginaChiSiamoCopy"][0].seoOgImage},
      {"id": "paginaContattiCopy", "seoTitle": *[_id == "paginaContattiCopy"][0].seoTitle, "seoDescription": *[_id == "paginaContattiCopy"][0].seoDescription, "seoOgImage": *[_id == "paginaContattiCopy"][0].seoOgImage},
      {"id": "paginaOspitaCopy", "seoTitle": *[_id == "paginaOspitaCopy"][0].seoTitle, "seoDescription": *[_id == "paginaOspitaCopy"][0].seoDescription, "seoOgImage": *[_id == "paginaOspitaCopy"][0].seoOgImage}
    ],
    "globaliSeo": *[_id == "impostazioniSito"][0]{
      "defaultTitleOk": defined(seoDefault.defaultTitle),
      "defaultDescriptionOk": defined(seoDefault.defaultDescription),
      "defaultOgImageOk": defined(seoDefault.defaultOgImage),
      "keywordsCount": length(seoDefault.keywords),
      "comingSoonAttivo": comingSoon.attivo,
      "iubendaConfigurato": defined(iubenda.cookieBannerSiteId)
    },
    "imaginariumHeroFoto": defined(*[_id == "paginaImaginariumCopy"][0].heroFotoSfondo),
    "homepageHeroFoto": defined(*[_id == "homepageHero"][0].fotoSfondo)
  }`);

  console.log("\n=== AUDIT SANITY CONTENT GAPS ===\n");
  console.log(JSON.stringify(audit, null, 2));

  const spettacoliSenzaFoto = (audit.spettacoliSenzaFotoHero as any[])?.length ?? 0;
  const membriSenzaFoto = (audit.membriSenzaFoto as any[])?.length ?? 0;
  const globals = audit.globaliSeo as any;

  console.log("\n=== RIEPILOGO ===");
  console.log(`Spettacoli attivi senza fotoHero: ${spettacoliSenzaFoto}`);
  console.log(`Membri senza foto: ${membriSenzaFoto}`);
  console.log(`Coming-soon attivo: ${globals?.comingSoonAttivo ? "SÌ" : "NO"}`);
  console.log(`Iubenda configurato: ${globals?.iubendaConfigurato ? "SÌ" : "NO (banner disattivato)"}`);
  console.log(`OG image default: ${globals?.defaultOgImageOk ? "SÌ" : "MANCANTE (importante per condivisioni social)"}`);
  console.log(`Keywords globali: ${globals?.keywordsCount ?? 0}`);
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
