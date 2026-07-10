import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { client } from "@/../sanity/lib/client";
import { urlFor } from "@/../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroPagina } from "@/components/caraval/HeroPagina";
import { CtaFinale } from "@/components/caraval/CtaFinale";

export const revalidate = 60;

type StatoCorso = "in_corso" | "iscrizioni_aperte" | "concluso";

const STATO_LABEL: Record<StatoCorso, string> = {
  in_corso: "In corso",
  iscrizioni_aperte: "Iscrizioni aperte",
  concluso: "Concluso",
};

const TARGET_LABEL: Record<string, string> = {
  adulti: "Adulti",
  bambini: "Bambini",
  adolescenti: "Adolescenti",
  professionisti: "Professionisti",
  scuole: "Scuole",
  altro: "Altro",
};

type ImageRef = { asset?: { _ref?: string }; alt?: string };

type CorsoPage = {
  _id: string;
  titolo: string;
  target?: string;
  statoCorso?: StatoCorso;
  descrizione?: PortableTextBlock[];
  descrizioneBreve?: string;
  immagineCover?: ImageRef;
  dataInizio?: string;
  dataFine?: string;
  dataChiusuraIscrizioni?: string;
  frequenza?: string;
  sede?: string;
  costoVisibile?: boolean;
  costo?: string;
  spettacoloFinaleLinked?: {
    titolo?: string;
    slug?: string;
    edizione?: { anno?: number };
  };
  referenteIscrizioni?: {
    nome?: string;
    telefonoPubblico?: string;
    emailPubblica?: string;
  };
};

type ImpostazioniContatti = {
  contattiPubblici?: { email?: string; telefono?: string };
};

const CORSO_PROJECTION = `
  _id, titolo, target, statoCorso, descrizione, descrizioneBreve, immagineCover,
  dataInizio, dataFine, dataChiusuraIscrizioni, frequenza, sede,
  costoVisibile, costo,
  spettacoloFinaleLinked->{ titolo, "slug": slug.current, edizione->{ anno } },
  referenteIscrizioni->{ nome, telefonoPubblico, emailPubblica }
`;

function formatData(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMese(iso?: string) {
  if (!iso) return "?";
  return new Date(iso).toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const items = await client.fetch<{ slug: string }[]>(
    `*[_type == "corso" && defined(slug.current)]{ "slug": slug.current }`
  );
  return items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  type CorsoSeo = {
    titolo?: string;
    target?: string;
    descrizioneBreve?: string;
    immagineCover?: ImageRef | null;
  };
  type GlobalSeo = {
    seoDefault?: {
      defaultDescription?: string;
      defaultOgImage?: ImageRef | null;
      keywords?: string[];
      canonicalBaseUrl?: string;
    };
  };

  let corso: CorsoSeo | null = null;
  let globali: GlobalSeo | null = null;
  try {
    const data = await client.fetch<{
      corso: CorsoSeo | null;
      globali: GlobalSeo | null;
    }>(
      `{
        "corso": *[_type == "corso" && slug.current == $slug][0]{
          titolo, target, descrizioneBreve, immagineCover
        },
        "globali": *[_id == "impostazioniSito"][0]{ seoDefault }
      }`,
      { slug: params.slug }
    );
    corso = data.corso;
    globali = data.globali;
  } catch {
    /* fail-open */
  }

  const titolo = corso?.titolo ?? "Corso";
  const title = `${titolo} — Caraval Academy | Caraval Spettacoli`;
  // I meta tag non tollerano gli a capo che `descrizioneBreve` conserva per la UI.
  const description = (
    corso?.descrizioneBreve ||
    globali?.seoDefault?.defaultDescription ||
    `${titolo}: corso di teatro della Caraval Academy a Soncino (Cremona).`
  )
    .replace(/\s+/g, " ")
    .trim();

  const ogSource = corso?.immagineCover?.asset?._ref
    ? corso.immagineCover
    : globali?.seoDefault?.defaultOgImage;
  const ogImage = ogSource?.asset?._ref
    ? urlFor(ogSource as Parameters<typeof urlFor>[0])
        .width(1200)
        .height(630)
        .fit("crop")
        .quality(85)
        .url()
    : undefined;

  const baseUrl = globali?.seoDefault?.canonicalBaseUrl || "https://caraval.it";
  const url = `${baseUrl}/caraval-academy/${params.slug}`;

  return {
    title,
    description,
    keywords: globali?.seoDefault?.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article" as const,
      locale: "it_IT",
      siteName: "Caraval Spettacoli",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: titolo }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

async function getData(slug: string) {
  const [corso, impostazioni] = await Promise.all([
    client.fetch<CorsoPage | null>(
      `*[_type == "corso" && slug.current == $slug][0]{ ${CORSO_PROJECTION} }`,
      { slug }
    ),
    client.fetch<ImpostazioniContatti | null>(
      `*[_id == "impostazioniSito"][0]{ contattiPubblici { email, telefono } }`
    ),
  ]);
  return { corso, fallbackContatti: impostazioni?.contattiPubblici ?? null };
}

export default async function SchedaCorso({
  params,
}: {
  params: { slug: string };
}) {
  const { corso, fallbackContatti } = await getData(params.slug);
  if (!corso) notFound();

  const stato = (corso.statoCorso ?? "in_corso") as StatoCorso;
  const target = corso.target
    ? TARGET_LABEL[corso.target] ?? corso.target
    : null;

  const periodo =
    corso.dataInizio || corso.dataFine
      ? `${formatMese(corso.dataInizio)} – ${formatMese(corso.dataFine)}`
      : null;
  const chiusuraIscrizioni = formatData(corso.dataChiusuraIscrizioni);

  const finale = corso.spettacoloFinaleLinked;
  const finaleHref =
    finale?.slug && finale?.edizione?.anno
      ? `/imaginarium/${finale.edizione.anno}/${finale.slug}`
      : null;

  const ref = corso.referenteIscrizioni;
  const tel = ref?.telefonoPubblico ?? fallbackContatti?.telefono;
  const email = ref?.emailPubblica ?? fallbackContatti?.email;

  const dettagli: Array<{ label: string; value: string }> = [
    ...(target ? [{ label: "A chi è rivolto", value: target }] : []),
    ...(corso.frequenza ? [{ label: "Frequenza", value: corso.frequenza }] : []),
    ...(periodo ? [{ label: "Periodo", value: periodo }] : []),
    ...(corso.sede ? [{ label: "Sede", value: corso.sede }] : []),
    ...(chiusuraIscrizioni
      ? [{ label: "Iscrizioni entro il", value: chiusuraIscrizioni }]
      : []),
    ...(corso.costoVisibile && corso.costo
      ? [{ label: "Costo", value: corso.costo }]
      : []),
  ];

  const oggettoMail = encodeURIComponent(`Informazioni ${corso.titolo}`);

  return (
    <>
      <HeroPagina
        eyebrow="CARAVAL ACADEMY"
        heading={corso.titolo}
        sottotitolo={corso.descrizioneBreve}
        fotoSfondo={corso.immagineCover}
        palette="default"
        altezza="compatto"
      />

      <Section theme="dark" bgVariant="soft">
        <Container>
          <div className="mb-10">
            <Link
              href="/caraval-academy"
              className="inline-flex items-center gap-2 text-body-s uppercase-tracked text-crema-muted transition-colors hover:text-rosso-hover"
            >
              ← Tutti i corsi
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            {/* Descrizione */}
            <div>
              <span className="mb-6 inline-block rounded-sm border border-rosso-base/40 px-3 py-1 text-caption font-semibold uppercase-tracked text-rosso-hover">
                {STATO_LABEL[stato]}
              </span>

              {corso.descrizione && corso.descrizione.length > 0 ? (
                <div className="prose-narrative space-y-6 text-body-l leading-relaxed text-crema-base/95">
                  <PortableText
                    value={corso.descrizione}
                    components={{
                      block: {
                        // `whitespace-pre-line`: nello Studio gli a capo morbidi
                        // (shift+enter) restano dentro un unico blocco come "\n".
                        // Senza questo collasserebbero in un muro di testo.
                        normal: ({ children }) => (
                          <p className="whitespace-pre-line">{children}</p>
                        ),
                        h1: ({ children }) => (
                          <h2 className="pt-4 font-display text-h2 leading-tight text-crema-base">
                            {children}
                          </h2>
                        ),
                        h2: ({ children }) => (
                          <h2 className="pt-4 font-display text-h2 leading-tight text-crema-base">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="pt-2 font-display text-h3 leading-tight text-crema-base">
                            {children}
                          </h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-rosso-base pl-6 italic text-crema-muted">
                            {children}
                          </blockquote>
                        ),
                      },
                      list: {
                        bullet: ({ children }) => (
                          <ul className="list-disc space-y-2 pl-6 marker:text-rosso-base">
                            {children}
                          </ul>
                        ),
                        number: ({ children }) => (
                          <ol className="list-decimal space-y-2 pl-6 marker:text-rosso-base">
                            {children}
                          </ol>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => (
                          <strong className="font-semibold text-crema-bright">
                            {children}
                          </strong>
                        ),
                        link: ({ children, value }) => (
                          <a
                            href={value?.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-rosso-base underline-offset-4 transition-colors hover:text-rosso-hover"
                          >
                            {children}
                          </a>
                        ),
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-body-l italic text-crema-muted">
                  La descrizione di questo corso sarà disponibile a breve.
                  Contattaci per tutte le informazioni.
                </p>
              )}

              {finale?.titolo && (
                <p className="mt-10 border-t border-crema-faint/40 pt-6 text-body text-crema-muted">
                  Il percorso si chiude con lo spettacolo{" "}
                  {finaleHref ? (
                    <Link
                      href={finaleHref}
                      className="text-crema-base underline decoration-rosso-base/60 underline-offset-4 transition-colors hover:text-rosso-hover"
                    >
                      {finale.titolo}
                    </Link>
                  ) : (
                    <span className="text-crema-base">{finale.titolo}</span>
                  )}
                  , presentato al festival Imaginarium.
                </p>
              )}
            </div>

            {/* Dati pratici + iscrizioni */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-md border border-rosso-base/30 bg-nero-base p-6 md:p-8">
                {dettagli.length > 0 && (
                  <dl className="flex flex-col gap-4">
                    {dettagli.map((d) => (
                      <div key={d.label}>
                        <dt className="text-label uppercase-tracked text-crema-muted">
                          {d.label}
                        </dt>
                        <dd className="mt-1 text-body text-crema-base">
                          {d.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {(tel || email) && (
                  <div className="mt-8 border-t border-crema-faint/40 pt-6">
                    <p className="mb-3 text-label uppercase-tracked text-rosso-hover">
                      Iscrizioni
                    </p>
                    {ref?.nome && (
                      <p className="mb-2 text-body-s text-crema-muted">
                        Referente: {ref.nome}
                      </p>
                    )}
                    <div className="flex flex-col gap-2 text-body-s">
                      {tel && (
                        <a
                          href={`tel:${tel.replace(/\s+/g, "")}`}
                          className="text-crema-base transition-colors hover:text-rosso-hover"
                        >
                          {tel}
                        </a>
                      )}
                      {email && (
                        <a
                          href={`mailto:${email}?subject=${oggettoMail}`}
                          className="break-all text-crema-base transition-colors hover:text-rosso-hover"
                        >
                          {email}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CtaFinale
        variant="accent"
        heading="Vuoi iscriverti a questo corso?"
        sottotitolo="Scrivici o chiamaci: ti raccontiamo tutto."
        ctaPrimaria={{
          label: "Scrivici",
          href: `mailto:${email ?? "caravalspettacoli@gmail.com"}?subject=${oggettoMail}`,
        }}
        ctaSecondaria={{
          label: "Vedi gli altri corsi",
          href: "/caraval-academy",
        }}
      />
    </>
  );
}
