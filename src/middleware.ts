import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Coming-soon redirect middleware.
 *
 *  Quando `impostazioniSito.comingSoon.attivo === true`, tutte le request al
 *  sito pubblico vengono reindirizzate a /coming-soon. Lo Studio Sanity
 *  (/studio), le API routes, gli asset Next.js e i file SEO restano sempre
 *  accessibili.
 *
 *  Esecuzione sul runtime Edge: niente @sanity/client (richiede Node). Fetch
 *  HTTP diretto all'API Sanity con cache di 60 secondi. Fail-open: se la
 *  fetch fallisce per qualsiasi motivo, lascia passare la request invece
 *  di bloccare il sito. */

const ALLOWED_PREFIXES = [
  "/coming-soon",
  "/studio",
  "/api",
  "/_next",
  "/favicon",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/caraval-logo-white.png",
  "/caraval-logo-black.png",
];

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

async function isComingSoonActive(): Promise<boolean> {
  if (!PROJECT_ID) return false;
  try {
    const query = encodeURIComponent(
      `*[_id == "impostazioniSito"][0]{ "attivo": comingSoon.attivo }`
    );
    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return false;
    const json = (await res.json()) as { result?: { attivo?: boolean } };
    return json.result?.attivo === true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ALLOWED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const attivo = await isComingSoonActive();
  if (attivo) {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.search = "";
    return NextResponse.redirect(url, { status: 307 });
  }

  return NextResponse.next();
}

export const config = {
  // Match tutte le request escluse quelle che terminano in estensioni di asset.
  // Filtraggio fine gestito da ALLOWED_PREFIXES sopra.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|otf|eot|css|js|map)$).*)",
  ],
};
