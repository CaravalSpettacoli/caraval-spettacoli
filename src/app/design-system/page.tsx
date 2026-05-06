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
  { name: "display-xl", className: "text-display-xl font-display", sample: "Caraval" },
  { name: "display-l", className: "text-display-l font-display", sample: "Caraval" },
  { name: "display-m", className: "text-display-m font-display", sample: "Caraval" },
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
            I mattoni del sito
          </h1>
          <p className="mt-6 text-body-l text-crema-muted max-w-2xl">
            Showcase interna di token, tipografia e componenti.
            Pagina riservata allo sviluppo, non indicizzata.
          </p>
        </Container>
      </Section>

      {/* PALETTE */}
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

      {/* TIPOGRAFIA */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>2 — Tipografia</GroupTitle>
          <p className="text-body text-crema-muted mb-12 max-w-2xl">
            Display: <span className="font-display">MCF Stonehead Demo</span> ·
            Body/UI: Inter. Body mai sotto i 16px.
          </p>
          <div className="space-y-8">
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
        </Container>
      </Section>

      {/* SPACING */}
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

      {/* BUTTONS */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>4 — Buttons</GroupTitle>
          <div className="space-y-12">
            {(["primary", "secondary", "ghost", "danger"] as const).map((v) => (
              <div key={v}>
                <SubTitle>{v}</SubTitle>
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
                  <Button variant={v} size="md" disabled>
                    Disabled
                  </Button>
                  <Button variant={v} size="md" loading>
                    Caricamento
                  </Button>
                </div>
              </div>
            ))}
            <div>
              <SubTitle>as link</SubTitle>
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
        </Container>
      </Section>

      {/* CARDS */}
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="sm" variant="bordered">
              <span className="text-label uppercase-tracked">Padding sm</span>
            </Card>
            <Card padding="md" variant="bordered">
              <span className="text-label uppercase-tracked">Padding md</span>
            </Card>
            <Card padding="lg" variant="bordered">
              <span className="text-label uppercase-tracked">Padding lg</span>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CONTAINERS */}
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

      {/* SECTIONS */}
      <div>
        <Section background="nero">
          <Container>
            <SubTitle>Section background = nero</SubTitle>
            <p className="text-body">Sfondo dominante del sito.</p>
          </Container>
        </Section>
        <Section background="nero-soft">
          <Container>
            <SubTitle>Section background = nero-soft</SubTitle>
            <p className="text-body">Per alternanza visiva.</p>
          </Container>
        </Section>
        <Section background="crema">
          <Container>
            <SubTitle>Section background = crema</SubTitle>
            <p className="text-body">Per teaser Imaginarium.</p>
          </Container>
        </Section>
      </div>

      {/* HERO */}
      <Section>
        <Container>
          <GroupTitle>8 — Hero (template)</GroupTitle>
        </Container>
      </Section>
      <Hero
        eyebrow="Festival Imaginarium · 2026"
        title="Una compagnia. Tre anime. Un festival."
        subtitle="Caraval Spettacoli porta prosa, strada e fuoco nei borghi della pianura padana."
        cta={{ text: "Scopri gli spettacoli", href: "/spettacoli" }}
        height="md"
        displayFont
      />
      <Hero
        title="La Fine del Mondo"
        subtitle="Una drammaturgia originale premiata."
        height="sm"
        align="center"
      />

      {/* SPETTACOLI */}
      <Section background="nero-soft">
        <Container>
          <GroupTitle>9 — SpettacoloCard</GroupTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPETTACOLI_MOCK.map((s) => (
              <SpettacoloCard key={s.slug} spettacolo={s} />
            ))}
          </div>
        </Container>
      </Section>

      {/* EVENTI */}
      <Section>
        <Container>
          <GroupTitle>10 — EventoCard</GroupTitle>
          <div className="grid grid-cols-1 gap-4 max-w-3xl">
            {EVENTI_MOCK.map((e) => (
              <EventoCard key={e.titolo} evento={e} />
            ))}
          </div>
        </Container>
      </Section>

      {/* BADGES */}
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
    </div>
  );
}
