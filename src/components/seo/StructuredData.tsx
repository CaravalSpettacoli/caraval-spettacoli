import { client } from "@/../sanity/lib/client";

/** JSON-LD structured data injected nel <head>.
 *
 *  Schemi emessi:
 *  - Organization + PerformingArtsTheater + LocalBusiness (singleton sito)
 *  - TheaterEvent per ogni spettacolo Imaginarium imminente
 *  - Course per ogni corso Academy in stato in_corso o iscrizioni_aperte
 *
 *  Tutto fail-open: se Sanity fallisce restituisce array vuoto, niente errori
 *  di build. Cache 1h. */

type StructuredDataPayload = {
  globali?: {
    seoDefault?: {
      defaultTitle?: string;
      defaultDescription?: string;
      keywords?: string[];
      canonicalBaseUrl?: string;
      geoLat?: number;
      geoLon?: number;
    } | null;
    datiAssociazione?: {
      ragioneSociale?: string;
      partitaIva?: string;
      codiceFiscale?: string;
      indirizzo?: string;
      citta?: string;
      cap?: string;
      provincia?: string;
    } | null;
    contattiPubblici?: { email?: string; telefono?: string } | null;
    socialLinks?: { piattaforma?: string; url?: string }[];
  } | null;
  spettacoliImaginarium?: {
    titolo?: string;
    slug?: { current?: string };
    data?: string;
    locationSpecifica?: string;
    descrizioneBreve?: string;
  }[];
  corsi?: {
    titolo?: string;
    target?: string;
    statoCorso?: string;
    slug?: string;
  }[];
};

async function getSeedData(): Promise<StructuredDataPayload> {
  try {
    const data = await client.fetch<StructuredDataPayload>(`{
      "globali": *[_id == "impostazioniSito"][0]{
        seoDefault,
        datiAssociazione,
        contattiPubblici,
        socialLinks[]{piattaforma, url}
      },
      "spettacoliImaginarium": *[_type == "spettacoloImaginarium" && defined(data) && data > now()]{
        titolo, slug, data, locationSpecifica, descrizioneBreve
      },
      "corsi": *[_type == "corso" && statoCorso in ["in_corso", "iscrizioni_aperte"]]{
        titolo, target, statoCorso, "slug": slug.current
      }
    }`);
    return data ?? {};
  } catch {
    return {};
  }
}

export async function StructuredData() {
  const data = await getSeedData();
  const seo = data.globali?.seoDefault ?? {};
  const ass = data.globali?.datiAssociazione ?? {};
  const cont = data.globali?.contattiPubblici ?? {};
  const baseUrl = seo.canonicalBaseUrl ?? "https://caraval.it";

  const socials = (data.globali?.socialLinks ?? [])
    .map((s) => s.url)
    .filter(Boolean);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "PerformingArtsTheater", "LocalBusiness"],
    name: ass.ragioneSociale || "Caraval Associazione Culturale",
    alternateName: "Caraval Spettacoli",
    description: seo.defaultDescription,
    url: baseUrl,
    logo: `${baseUrl}/caraval-logo-white.png`,
    email: cont.email,
    telephone: cont.telefono,
    taxID: ass.codiceFiscale,
    vatID: ass.partitaIva,
    address: {
      "@type": "PostalAddress",
      streetAddress: ass.indirizzo,
      postalCode: ass.cap,
      addressLocality: ass.citta || "Soncino",
      addressRegion: ass.provincia || "CR",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: seo.geoLat ?? 45.4017,
      longitude: seo.geoLon ?? 9.8693,
    },
    areaServed: [
      { "@type": "City", name: "Soncino" },
      { "@type": "City", name: "Cremona" },
      { "@type": "City", name: "Brescia" },
      { "@type": "City", name: "Bergamo" },
      { "@type": "City", name: "Lodi" },
      { "@type": "AdministrativeArea", name: "Lombardia" },
    ],
    sameAs: socials,
    keywords: seo.keywords?.join(", "),
  };

  const eventSchemas = (data.spettacoliImaginarium ?? [])
    .filter((s) => s.titolo && s.data)
    .map((s) => ({
      "@context": "https://schema.org",
      "@type": "TheaterEvent",
      name: s.titolo,
      startDate: s.data,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: s.locationSpecifica || "Soncino",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Soncino",
          addressRegion: "CR",
          addressCountry: "IT",
        },
      },
      description: s.descrizioneBreve,
      organizer: {
        "@type": "Organization",
        name: "Caraval Spettacoli",
        url: baseUrl,
      },
      url: `${baseUrl}/imaginarium${s.slug?.current ? `#${s.slug.current}` : ""}`,
    }));

  const courseSchemas = (data.corsi ?? [])
    .filter((c) => c.titolo)
    .map((c) => ({
      "@context": "https://schema.org",
      "@type": "Course",
      name: c.titolo,
      description: c.target,
      url: c.slug
        ? `${baseUrl}/caraval-academy/${c.slug}`
        : `${baseUrl}/caraval-academy`,
      provider: {
        "@type": "Organization",
        name: "Caraval Academy",
        url: `${baseUrl}/caraval-academy`,
      },
    }));

  const schemas = [orgSchema, ...eventSchemas, ...courseSchemas];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export default StructuredData;
