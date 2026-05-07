import type { Metadata } from "next";
import { ArrowRight, Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Hero } from "@/components/layout/Hero";
import { CategoriaBadge } from "@/components/caraval/CategoriaBadge";
import { PremioBadge } from "@/components/caraval/PremioBadge";
import { SpettacoloCard } from "@/components/caraval/SpettacoloCard";
import { EventoCard } from "@/components/caraval/EventoCard";
import { TitoloDoppio } from "@/components/caraval/TitoloDoppio";
import { TitoloRitmico } from "@/components/caraval/TitoloRitmico";
import { Ticket } from "@/components/caraval/Ticket";
import { CreditiLocandina } from "@/components/caraval/CreditiLocandina";
import { CitazioneStampa } from "@/components/caraval/CitazioneStampa";
import { Stella5Punte } from "@/components/decorative/Stella5Punte";
import { MascheraTeatrale } from "@/components/decorative/MascheraTeatrale";
import { Fiamma } from "@/components/decorative/Fiamma";
import { OndaDecorativa } from "@/components/decorative/OndaDecorativa";
import { Divider } from "@/components/decorative/Divider";
import { CorniceDeco } from "@/components/decorative/CorniceDeco";
import { FadeInOnScroll } from "@/components/effects/FadeInOnScroll";
import { ImmagineConOverlay } from "@/components/effects/ImmagineConOverlay";
import { SiparioDemo } from "./SiparioDemo";
import { SiparioPreloaderDemo } from "./SiparioPreloaderDemo";

export const metadata: Metadata = {
  title: "Design System",
  description: "Showcase interno del design system Caraval",
  robots: { index: false, follow: false },
};

const COLORS = [
  { group: "Nero", items: [
    { name: "nero-base", hex: "#0a0a0a", className: "bg-nero-base text-crema-base" },
    { name: "nero-soft", hex: "#1a1a1a", className: "bg-nero-soft text-crema-base" },
    { name: "nero-deep", hex: "#050505", className: "bg-nero-deep text-crema-base" },
  ]},
  { group: "Rosso", items: [
    { name: "rosso-base", hex: "#a8174a", className: "bg-rosso-base text-crema-base" },
    { name: "rosso-hover", hex: "#c01d56", className: "bg-rosso-hover text-crema-base" },
    { name: "rosso-deep", hex: "#8e1240", className: "bg-rosso-deep text-crema-base" },
    { name: "rosso-muted", hex: "rgba(168,23,74,0.1)", className: "bg-rosso-muted text-crema-base border border-crema-faint" },
  ]},
  { group: "Crema", items: [
    { name: "crema-base", hex: "#f5e6d3", className: "bg-crema-base text-nero-base" },
    { name: "crema-bright", hex: "#faf0e1", className: "bg-crema-bright text-nero-base" },
    { name: "crema-muted", hex: "rgba(245,230,211,0.7)", className: "bg-crema-muted text-nero-base" },
    { name: "crema-faint", hex: "rgba(245,230,211,0.4)", className: "bg-crema-faint text-nero-base" },
  ]},
];

const TYPE_SCALE = [
  { name: "display-xl", className: "text-display-xl font-display", sample: "CARAVAL" },
  { name: "display-l", className: "text-display-l font-display", sample: "CARAVAL" },
  { name: "display-m", className: "text-display-m font-display", sample: "CARAVAL" },
  { name: "h1", className: "text-h1 font-semibold", sample: "Tre anime, una compagnia" },
  { name: "h2", className: "text-h2 font-semibold", sample: "Una serata di stupore" },
  { name: "h3", className: "text-h3 font-semibold", sample: "Romeo + Giulietta" },
  { name: "h4", className: "text-h4 font-semibold", sample: "La Fine del Mondo" },
  { name: "body-l", className: "text-body-l", sample: "Compagnia teatrale della media pianura padana." },
  { name: "body", className: "text-body", sample: "Una compagnia. Tre anime. Un festival." },
  { name: "body-s", className: "text-body-s", sample: "Note, contesti, didascalie." },
  { name: "caption", className: "text-caption", sample: "12 GIUGNO · SONCINO" },
  { name: "label", className: "text-label uppercase-tracked", sample: "PROSA" },
];

const SPACING = [
  { name: "1", px: 4 },
  { name: "2", px: 8 },
  { name: "3", px: 12 },
  { name: "4", px: 16 },
  { name: "6", px: 24 },
  { name: "8", px: 32 },
  { name: "12", px: 48 },
  { name: "16", px: 64 },
  { name: "24", px: 96 },
  { name: "32", px: 128 },
];

const SPETTACOLI_MOCK = [
  {
    slug: "la-fine-del-mondo",
    titolo: "La Fine del Mondo",
    sottotitolo: "Premiata drammaturgia originale, una storia ai confini dell'umano.",
    categoria: "prosa" as const,
    anno: 2023,
    premi: [
      { nome: "Edallo CremainScena", anno: 2023 },
    ],
  },
  {
    slug: "i-viaggiastorie",
    titolo: "I Viaggiastorie",
    sottotitolo: "Spettacolo itinerante per i borghi della pianura.",
    categoria: "strada" as const,
    anno: 2024,
  },
  {
    slug: "macbeth-fuoco",
    titolo: "Macbeth",
    sottotitolo: "Shakespeare riletto attraverso il fuoco.",
    categoria: "fuoco" as const,
    anno: 2025,
  },
];

const EVENTI_MOCK = [
  {
    data: "2026-06-04",
    titolo: "Imaginarium 2026 — Apertura",
    citta: "Soncino",
    struttura: "Rocca Sforzesca",
    modalitaAccesso: "Ingresso libero",
    tipoEvento: "Festival",
    detailUrl: "/imaginarium/2026",
  },
  {
    data: "2026-07-12",
    titolo: "Romeo + Giulietta — L'Inferno dell'Amore",
    citta: "Brescia",
    struttura: "Teatro Sociale",
    modalitaAccesso: "Biglietto 12€",
    tipoEvento: "Prosa",
    ticketUrl: "https://example.com/ticket",
  },
  {
    data: "2026-08-20",
    titolo: "Cubiculum Diaboli",
    citta: "Cremona",
    struttura: "Piazza del Comune",
    modalitaAccesso: "Ingresso libero",
    tipoEvento: "Fuoco",
  },
];

function Swatch({ name, hex, className }: { name: string; hex: string; className: string }) {
  return (
    <div className={`rounded-md p-4 h-28 flex flex-col justify-between ${className}`}>
      <span className="text-body-s font-semibold">{name}</span>
      <span className="text-caption opacity-80">{hex}</span>
    </div>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-h2 font-semibold mb-2 text-crema-base">{children}</h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-h4 font-semibold mb-4 text-crema-muted uppercase-tracked text-label">
      {children}
    </h3>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="bg-nero-base text-crema-base">
      {/* HEADER PAGINA */}
      <Section background="nero-soft" className="border-b border-crema-faint">
        <Container>
          <p className="text-label uppercase-tracked text-rosso-hover mb-4">
            Caraval — Design System
          </p>
          <h1 className="text-display-m md:text-display-l font-display text-balance">
            I MATTONI DEL SITO
          </h1>
          <p className="mt-6 text-body-l text-crema-muted max-w-2xl">
            Showcase interna di token, tipografia e componenti.
            Pagina riservata allo sviluppo, non indicizzata.
          </p>
        </Container>
      </Section>

      {/* 1 — PALETTE */}
      <Section>
        <Container>
          <GroupTitle>1 — Palette colori</GroupTitle>
          <p className="text-body text-crema-muted mb-12 max-w-2xl">
            Tre famiglie con tonalità per UI states. Tutti i contrasti
            sono validati WCAG AA per testo body.
          </p>
          {COLORS.map((g) => (
            <div key={g.group} className="mb-10">
              <SubTitle>{g.group}</SubTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {g.items.map((c) => (
                  <Swatch key={c.name} {...c} />
                ))}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      {/* 2 — TIPOGRAFIA */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>2 — Tipografia</GroupTitle>
          <p className="text-body text-crema-muted mb-12 max-w-2xl">
            Sistema a due font:{" "}
            <span className="font-display">Cinzel Decorative</span> per i
            titoli in evidenza,{" "}
            <span className="font-sans font-semibold">Inter</span> (300/400/500/600/700)
            per body, UI e tutto il resto. Stonehead Demo resta solo nel logo
            Header.
          </p>

          <SubTitle>2.0 — Sistema font definitivo</SubTitle>
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-nero-deep rounded-md border border-crema-faint space-y-5">
              <div className="pb-3 border-b border-crema-faint">
                <p className="text-caption uppercase-tracked text-rosso-base">
                  Display · titoli in evidenza
                </p>
                <p className="text-body-l text-crema-base">Cinzel Decorative</p>
              </div>
              <div className="font-display text-h3 leading-tight break-words">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </div>
              <div className="font-display text-h3 leading-tight">
                0123456789 &amp; ! ?
              </div>
              <div>
                <p className="text-caption uppercase-tracked text-crema-muted mb-2">
                  Heading XL
                </p>
                <p className="font-display text-h1 leading-[1.05]">
                  La Fine del Mondo
                </p>
              </div>
              <div>
                <p className="text-caption uppercase-tracked text-crema-muted mb-2">
                  Heading L
                </p>
                <p className="font-display text-h2 leading-[1.1]">
                  Romeo + Giulietta
                </p>
              </div>
            </div>

            <div className="p-6 bg-nero-deep rounded-md border border-crema-faint space-y-5">
              <div className="pb-3 border-b border-crema-faint">
                <p className="text-caption uppercase-tracked text-rosso-base">
                  Body · UI e testi
                </p>
                <p className="text-body-l text-crema-base">Inter</p>
              </div>
              <div className="space-y-2">
                {[
                  { w: "font-light", label: "Light · 300" },
                  { w: "font-normal", label: "Regular · 400" },
                  { w: "font-medium", label: "Medium · 500" },
                  { w: "font-semibold", label: "Semibold · 600" },
                  { w: "font-bold", label: "Bold · 700" },
                ].map((row) => (
                  <div
                    key={row.w}
                    className="grid grid-cols-[140px_1fr] gap-4 items-baseline border-b border-crema-faint/50 pb-2"
                  >
                    <span className="text-caption uppercase-tracked text-crema-muted">
                      {row.label}
                    </span>
                    <span className={`${row.w} text-body-l text-crema-base`}>
                      Una compagnia. Tre anime.
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-caption uppercase-tracked text-crema-muted mb-2">
                  Body lungo · 16px regular
                </p>
                <p className="text-body text-crema-base/90 leading-relaxed">
                  Caraval Spettacoli è la compagnia teatrale della media
                  pianura padana che attraversa con la stessa serietà la
                  prosa, il teatro di strada e gli spettacoli di fuoco.
                </p>
              </div>
            </div>
          </div>

          <SubTitle>2.1 — Scale base</SubTitle>
          <div className="space-y-8 mb-16">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.name}
                className="grid grid-cols-[120px_1fr] gap-6 items-baseline border-b border-crema-faint pb-6"
              >
                <div className="text-caption uppercase-tracked text-crema-muted">
                  {t.name}
                </div>
                <div className={t.className}>{t.sample}</div>
              </div>
            ))}
          </div>

          <SubTitle>2.2 — Pattern espressivi</SubTitle>
          <div className="space-y-16">
            <div>
              <p className="text-caption uppercase-tracked text-crema-muted mb-4">
                TitoloDoppio · livelli sovrapposti
              </p>
              <TitoloDoppio
                display="ROMEO"
                display2="GIULIETTA"
                body="L'Inferno dell'Amore"
                as="h3"
              />
            </div>
            <div>
              <p className="text-caption uppercase-tracked text-crema-muted mb-4">
                TitoloRitmico · mix dimensioni
              </p>
              <TitoloRitmico
                as="h3"
                parts={[
                  { text: "UNA", size: "small" },
                  { text: "COMPAGNIA", size: "large" },
                  { text: "TRE", size: "small" },
                  { text: "ANIME", size: "large" },
                  { text: "UN", size: "small" },
                  { text: "FESTIVAL", size: "large" },
                ]}
              />
            </div>
            <div>
              <p className="text-caption uppercase-tracked text-crema-muted mb-4">
                Hero align=&quot;left-extreme&quot; · titolo a filo margine sinistro
              </p>
              <div className="border border-crema-faint rounded-md overflow-hidden">
                <Hero
                  title="LA FINE DEL MONDO"
                  subtitle="Allineamento estremo a sinistra, niente centratura corporate."
                  height="sm"
                  align="left-extreme"
                  displayFont
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3 — SPACING */}
      <Section>
        <Container>
          <GroupTitle>3 — Spacing</GroupTitle>
          <p className="text-body text-crema-muted mb-12">
            Scala 4 → 128px. Spaziatura sezioni: 64–96px desktop.
          </p>
          <div className="space-y-3">
            {SPACING.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="w-16 text-caption uppercase-tracked text-crema-muted">
                  {s.name}
                </div>
                <div className="w-20 text-caption text-crema-muted">
                  {s.px}px
                </div>
                <div
                  className="h-4 bg-rosso-base rounded-sm"
                  style={{ width: `${s.px}px` }}
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4 — BUTTONS */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>4 — Buttons</GroupTitle>
          <SubTitle>4.1 — Variants base</SubTitle>
          <div className="space-y-12 mb-16">
            {(["primary", "secondary", "ghost", "danger"] as const).map((v) => (
              <div key={v}>
                <p className="text-caption uppercase-tracked text-crema-muted mb-4">{v}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant={v} size="sm">Small</Button>
                  <Button variant={v} size="md">Medium</Button>
                  <Button variant={v} size="lg">Large</Button>
                  <Button variant={v} size="md" iconLeft={<Download size={16} />}>
                    Con icona
                  </Button>
                  <Button variant={v} size="md" iconRight={<ArrowRight size={16} />}>
                    Avanti
                  </Button>
                  <Button variant={v} size="md" disabled>Disabled</Button>
                  <Button variant={v} size="md" loading>Caricamento</Button>
                </div>
              </div>
            ))}
            <div>
              <p className="text-caption uppercase-tracked text-crema-muted mb-4">as link</p>
              <div className="flex flex-wrap gap-4">
                <Button as="link" href="/spettacoli" variant="primary">
                  Link interno
                </Button>
                <Button as="a" href="https://caraval.it" variant="secondary" target="_blank" rel="noopener noreferrer">
                  Link esterno
                </Button>
              </div>
            </div>
          </div>

          <SubTitle>4.2 — Pulse animation (CTA principali)</SubTitle>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary" size="lg" pulse>
              Vai ai biglietti
            </Button>
            <p className="text-body-s text-crema-muted max-w-sm">
              Solo per CTA primari ad alta priorità (homepage, biglietti).
              Da usare con parsimonia.
            </p>
          </div>
        </Container>
      </Section>

      {/* 5 — CARDS */}
      <Section>
        <Container>
          <GroupTitle>5 — Cards</GroupTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" padding="md">
              <h4 className="font-display text-h4">Default</h4>
              <p className="text-body-s text-crema-muted mt-2">
                Fondo nero-soft, bordo nullo. Per gruppi di contenuto.
              </p>
            </Card>
            <Card variant="bordered" padding="md">
              <h4 className="font-display text-h4">Bordered</h4>
              <p className="text-body-s text-crema-muted mt-2">
                Solo bordo crema sottile, fondo trasparente.
              </p>
            </Card>
            <Card variant="flat" padding="md">
              <h4 className="font-display text-h4">Flat</h4>
              <p className="text-body-s text-crema-muted mt-2">
                Nessuno sfondo né bordo. Per layout che si reggono altrove.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 6 — CONTAINERS */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>6 — Containers</GroupTitle>
          <div className="space-y-6">
            <div>
              <SubTitle>narrow · max 720px</SubTitle>
              <Container width="narrow" className="border border-crema-faint py-4">
                <p className="text-body-s text-crema-muted">narrow container</p>
              </Container>
            </div>
            <div>
              <SubTitle>default · max 1280px</SubTitle>
              <Container width="default" className="border border-crema-faint py-4">
                <p className="text-body-s text-crema-muted">default container</p>
              </Container>
            </div>
            <div>
              <SubTitle>wide · max 1440px</SubTitle>
              <Container width="wide" className="border border-crema-faint py-4">
                <p className="text-body-s text-crema-muted">wide container</p>
              </Container>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7 — SECTIONS */}
      <Section>
        <Container>
          <GroupTitle>7 — Sections</GroupTitle>
          <p className="text-body text-crema-muted mb-8">
            Background variants e gradient hero.
          </p>
        </Container>
      </Section>
      <Section background="nero">
        <Container>
          <SubTitle>background = nero</SubTitle>
          <p className="text-body">Sfondo dominante del sito.</p>
        </Container>
      </Section>
      <Section background="nero-soft">
        <Container>
          <SubTitle>background = nero-soft</SubTitle>
          <p className="text-body">Per alternanza visiva.</p>
        </Container>
      </Section>
      <Section background="crema">
        <Container>
          <SubTitle>background = crema</SubTitle>
          <p className="text-body">Per teaser Imaginarium.</p>
        </Container>
      </Section>
      <section className="bg-gradient-hero py-20">
        <Container>
          <SubTitle>background = gradient-hero (NUOVO)</SubTitle>
          <p className="text-body text-crema-muted">
            Sfondo verticale nero-deep → nero-base → soffio rosso. Per hero
            cinematografici.
          </p>
        </Container>
      </section>

      {/* 8 — HERO */}
      <Section>
        <Container>
          <GroupTitle>8 — Hero (template)</GroupTitle>
        </Container>
      </Section>
      <Hero
        eyebrow="Festival Imaginarium · 2026"
        title="UNA COMPAGNIA TRE ANIME UN FESTIVAL"
        subtitle="Caraval Spettacoli porta prosa, strada e fuoco nei borghi della pianura padana."
        cta={{ text: "Scopri gli spettacoli", href: "/spettacoli" }}
        height="md"
        displayFont
      />

      {/* 9 — SPETTACOLOCARD */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>9 — SpettacoloCard</GroupTitle>

          <SubTitle>9.1 — Variant card (default)</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {SPETTACOLI_MOCK.map((s) => (
              <SpettacoloCard key={s.slug} spettacolo={s} />
            ))}
          </div>

          <SubTitle>9.2 — Variant manifesto (poster cinema)</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPETTACOLI_MOCK.map((s) => (
              <SpettacoloCard
                key={`m-${s.slug}`}
                spettacolo={s}
                variant="manifesto"
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 10 — EVENTI & TICKET */}
      <Section>
        <Container>
          <GroupTitle>10 — Eventi & Ticket</GroupTitle>

          <SubTitle>10.1 — EventoCard standard</SubTitle>
          <div className="grid grid-cols-1 gap-4 max-w-3xl mb-16">
            {EVENTI_MOCK.map((e) => (
              <EventoCard key={e.titolo} evento={e} />
            ))}
          </div>

          <SubTitle>10.2 — Ticket</SubTitle>
          <p className="text-body-s text-crema-muted mb-8 max-w-2xl">
            Componente unico con filigrana SVG ondulata di sfondo (opacity 0.07),
            bordo rosso 1.5px, perforazione laterale a 8 puntini, stub
            &ldquo;INGRESSO&rdquo; ruotato. Hover: lift di 4px + shadow leggera.
            Click: animazione &ldquo;strappo&rdquo; sullo stub sinistro (skip su{" "}
            <code className="font-mono">prefers-reduced-motion</code>).
          </p>
          <div className="space-y-10 mb-16">
            <div>
              <p className="text-caption uppercase-tracked text-crema-muted mb-3">
                Desktop · larghezza piena
              </p>
              <Ticket
                data="2026-07-12"
                titolo="Romeo + Giulietta"
                citta="Brescia"
                struttura="Teatro Sociale"
                prezzo="12 €"
                urlBiglietti="https://example.com/ticket"
              />
            </div>
            <div>
              <p className="text-caption uppercase-tracked text-crema-muted mb-3">
                Mobile · max-w-sm (aspect 3:1)
              </p>
              <div className="max-w-sm">
                <Ticket
                  data="2026-08-20"
                  titolo="Cubiculum Diaboli"
                  citta="Cremona"
                  struttura="Piazza del Comune"
                  prezzo="Ingresso libero"
                  urlBiglietti="https://example.com/info"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 11 — BADGES */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>11 — Badges</GroupTitle>
          <div className="space-y-10">
            <div>
              <SubTitle>CategoriaBadge</SubTitle>
              <div className="flex flex-wrap gap-3">
                <CategoriaBadge categoria="prosa" />
                <CategoriaBadge categoria="strada" />
                <CategoriaBadge categoria="fuoco" />
                <CategoriaBadge categoria="prosa" size="sm" />
                <CategoriaBadge categoria="strada" size="sm" />
                <CategoriaBadge categoria="fuoco" size="sm" />
              </div>
            </div>
            <div>
              <SubTitle>PremioBadge</SubTitle>
              <div className="flex flex-wrap gap-3">
                <PremioBadge nome="Edallo CremainScena" anno={2022} />
                <PremioBadge nome="Edallo CremainScena" anno={2023} />
                <PremioBadge
                  nome="Atelier Leà"
                  anno={2025}
                  categoria="Miglior drammaturgia"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 12 — ACCENTI DECORATIVI */}
      <Section>
        <Container>
          <GroupTitle>12 — Accenti decorativi · 3 varianti</GroupTitle>
          <p className="text-body text-crema-muted mb-12 max-w-2xl">
            Per ogni famiglia, 3 varianti stilistiche (A/B/C). Sceglierne una;
            le altre verranno rimosse in Sessione 3. Tutto SVG inline con{" "}
            <code className="font-mono text-rosso-hover">currentColor</code>.
          </p>

          {/* Stella */}
          <SubTitle>12.1 — Stella5Punte</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(["A", "B", "C"] as const).map((s) => (
              <div
                key={s}
                className="p-8 border border-crema-faint rounded-md flex flex-col items-center gap-4 text-rosso-base"
              >
                <Stella5Punte size={48} style={s} />
                <div className="text-center">
                  <p className="text-label uppercase-tracked text-rosso-hover">Stile {s}</p>
                  <p className="text-caption text-crema-muted mt-1">
                    {s === "A" ? "Outline floreale" : s === "B" ? "Geometrica art deco" : "Stella piena"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Maschera */}
          <SubTitle>12.2 — MascheraTeatrale</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(["A", "B", "C"] as const).map((s) => (
              <div
                key={s}
                className="p-8 border border-crema-faint rounded-md flex flex-col items-center gap-4 text-crema-base"
              >
                <div className="flex gap-3">
                  <MascheraTeatrale tipo="commedia" size={56} style={s} />
                  <MascheraTeatrale tipo="tragedia" size={56} style={s} />
                </div>
                <div className="text-center">
                  <p className="text-label uppercase-tracked text-rosso-hover">Stile {s}</p>
                  <p className="text-caption text-crema-muted mt-1">
                    {s === "A" ? "Lineare vintage" : s === "B" ? "Diamante geometrico" : "Volto morbido"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Fiamma */}
          <SubTitle>12.3 — Fiamma</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(["A", "B", "C"] as const).map((s) => (
              <div
                key={s}
                className="p-8 border border-crema-faint rounded-md flex flex-col items-center gap-4 text-rosso-hover"
              >
                <Fiamma size={64} style={s} />
                <div className="text-center">
                  <p className="text-label uppercase-tracked text-rosso-hover">Stile {s}</p>
                  <p className="text-caption text-crema-muted mt-1">
                    {s === "A" ? "Curve morbide" : s === "B" ? "Triangoli concentrici" : "Fiamma classica"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Onda */}
          <SubTitle>12.4 — OndaDecorativa</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(["A", "B", "C"] as const).map((s) => (
              <div
                key={s}
                className="p-8 border border-crema-faint rounded-md flex flex-col items-center gap-4 text-rosso-base"
              >
                <OndaDecorativa width={220} variant="sottile" style={s} />
                <OndaDecorativa width={220} variant="spessa" style={s} />
                <div className="text-center">
                  <p className="text-label uppercase-tracked text-rosso-hover">Stile {s}</p>
                  <p className="text-caption text-crema-muted mt-1">
                    {s === "A" ? "Onda morbida" : s === "B" ? "Zigzag art deco" : "Sinusoidale"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <SubTitle>12.5 — Divider</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(["A", "B", "C"] as const).map((s) => (
              <div
                key={s}
                className="p-8 border border-crema-faint rounded-md flex flex-col items-center gap-4 text-rosso-base"
              >
                <Divider width={240} style={s} />
                <div className="text-center">
                  <p className="text-label uppercase-tracked text-rosso-hover">Stile {s}</p>
                  <p className="text-caption text-crema-muted mt-1">
                    {s === "A" ? "Floreale" : s === "B" ? "Triplo chevron" : "Stella"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cornice */}
          <SubTitle>12.6 — CorniceDeco</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["A", "B", "C"] as const).map((s) => (
              <div key={s} className="border border-crema-faint rounded-md">
                <CorniceDeco padding="md" style={s}>
                  <p className="text-center font-display text-h4 text-crema-base">
                    CARAVAL
                  </p>
                  <p className="text-center text-body-s text-crema-muted mt-2">
                    Stile {s} —{" "}
                    {s === "A" ? "Floreale" : s === "B" ? "Art deco puro" : "Mix"}
                  </p>
                </CorniceDeco>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 13 — EFFETTI & GRADIENT */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>13 — Effetti & gradients</GroupTitle>

          <SubTitle>13.1 — Gradient overlay rosso</SubTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <ImmagineConOverlay variant="rosso" className="aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-br from-nero-soft to-rosso-deep" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-label uppercase-tracked text-crema-muted">
                  hover su questa area
                </span>
              </div>
            </ImmagineConOverlay>
            <ImmagineConOverlay variant="nero" className="aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-br from-rosso-base to-rosso-deep" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-label uppercase-tracked text-crema-base">
                  variant nero
                </span>
              </div>
            </ImmagineConOverlay>
          </div>

          <SubTitle>13.2 — Shadow poster</SubTitle>
          <div className="flex flex-wrap gap-8 mb-16">
            <div className="w-40 h-56 bg-crema-base rounded-sm shadow-poster" />
            <div className="w-40 h-56 bg-rosso-base rounded-sm shadow-glow-rosso-lg" />
          </div>

          <SubTitle>13.3 — Pulse rosso</SubTitle>
          <div>
            <Button variant="primary" size="lg" pulse>
              CTA con pulse
            </Button>
          </div>
        </Container>
      </Section>

      {/* 14 — ANIMAZIONI */}
      <Section>
        <Container>
          <GroupTitle>14 — Animazioni</GroupTitle>
          <p className="text-body text-crema-muted mb-12 max-w-2xl">
            Tutte le animazioni rispettano <code className="font-mono">prefers-reduced-motion</code>.
          </p>

          <SubTitle>14.1 — Fade-in on scroll</SubTitle>
          <div className="space-y-32 mb-24">
            <p className="text-body text-crema-muted">
              Scrolla verso il basso. Ogni titolo apparirà con un fade-in
              quando entra in viewport.
            </p>
            <FadeInOnScroll>
              <h3 className="font-display text-display-m text-crema-base">
                APPARO SCORRENDO
              </h3>
            </FadeInOnScroll>
            <FadeInOnScroll delay={150}>
              <h3 className="font-display text-display-m text-rosso-base">
                ANCHE IO
              </h3>
            </FadeInOnScroll>
          </div>

          <SubTitle>14.2 — Reveal sipario</SubTitle>
          <SiparioDemo />

          <SubTitle>14.3 — Cursor decorativo</SubTitle>
          <div className="p-8 border border-crema-faint rounded-md text-body-s text-crema-muted">
            Il punto rosso che segue il mouse è già attivo a livello globale
            (mount in <code className="font-mono">layout.tsx</code>). Visibile
            solo su dispositivi con hover (no touch). Disabilitato se{" "}
            <code className="font-mono">prefers-reduced-motion</code>.
          </div>
        </Container>
      </Section>

      {/* 15 — HERO MANIFESTO + CREDITI + CITAZIONE */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>15 — Hero Manifesto</GroupTitle>
          <p className="text-body text-crema-muted mb-12 max-w-2xl">
            Layout asimmetrico per pagine spettacolo: foto a destra, testo a
            sinistra, crediti formattati come locandina.
          </p>
        </Container>
      </Section>
      <Hero
        variant="manifesto-spettacolo"
        eyebrow="In repertorio · 2023"
        title="LA FINE DEL MONDO"
        subtitle="Una drammaturgia originale, una storia ai confini dell'umano."
        stamp={
          <div className="w-24 h-24 rounded-full bg-rosso-base text-crema-base flex flex-col items-center justify-center text-center rotate-12 shadow-md">
            <span className="font-display text-[14px] leading-none">WINNER</span>
            <span className="font-display text-[20px] leading-none mt-1">2023</span>
          </div>
        }
      >
        <CreditiLocandina
          crediti={[
            { ruolo: "REGIA", nome: "Vera Rossini" },
            { ruolo: "DRAMMATURGIA", nome: "Vera Rossini" },
            { ruolo: "IN SCENA", nome: "Alessio Rosin, Lucia Bevilacqua" },
            { ruolo: "PRODUZIONE", nome: "Caraval Spettacoli" },
          ]}
        />
      </Hero>
      <Section background="nero-soft">
        <Container width="narrow">
          <CitazioneStampa
            testo="Una drammaturgia originale che colpisce per misura e densità."
            fonte="La Provincia di Cremona"
            data="2023"
          />
        </Container>
      </Section>

      {/* 16 — SIPARIO PRELOADER */}
      <Section>
        <Container>
          <GroupTitle>16 — Sipario preloader</GroupTitle>
          <p className="text-body text-crema-muted mb-8 max-w-2xl">
            Preloader teatrale full-screen montato solo sulla homepage. Aspetta
            il <code className="font-mono">window.load</code> con minimo{" "}
            <code className="font-mono">1500ms</code> di permanenza del testo, e
            failsafe a <code className="font-mono">3500ms</code>. Su{" "}
            <code className="font-mono">prefers-reduced-motion</code> niente
            tendaggi, solo fade-out 400ms.
          </p>
          <ul className="text-body-s text-crema-muted mb-8 space-y-1 list-disc pl-5 max-w-2xl">
            <li>Sequenza: <strong>0–1500ms</strong> testo visibile · <strong>1500–1900ms</strong> fade testo · <strong>1900–4400ms</strong> apertura tendaggi (2500ms)</li>
            <li>Easing apertura: <code className="font-mono">cubic-bezier(0.4, 0, 0.2, 1)</code></li>
            <li>Pannelli rettangolari puliti, bordo interno dritto</li>
            <li>Texture velluto: bande verticali irregolari (pieghe) in <code className="font-mono">repeating-linear-gradient</code> con <code className="font-mono">mix-blend-mode: multiply</code></li>
            <li>Profondità: gradient verticale rosso-deep → rosso-base → rosso-deep + ombra interna lato palco</li>
            <li><code className="font-mono">pointer-events: none</code> + <code className="font-mono">aria-hidden</code>: invisibile agli screen reader</li>
          </ul>
          <SiparioPreloaderDemo />
        </Container>
      </Section>
    </div>
  );
}
