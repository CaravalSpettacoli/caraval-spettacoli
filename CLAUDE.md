# CLAUDE.md — Memoria per Claude Code

> Questo file viene letto automaticamente dalle sessioni Claude Code in questa cartella.
> **Tienilo aggiornato** alla fine di ogni sessione.

---

## 1. Header

- **Progetto:** Caraval Spettacoli — sito istituzionale + festival
- **Cliente:** Caraval Associazione Culturale (Soncino, CR)
- **Repository:** https://github.com/CaravalSpettacoli/caraval-spettacoli
- **Hosting:** Vercel (project `caraval-spettacoli`)
- **CMS:** Sanity (dataset `production`)
- **Working dir:** `/Users/edoardobiondi/Desktop/SITO-CARAVAL/SITO/` — questa cartella È il progetto.
- **Materiali brand (esterni, leggere/copiare ma non modificare):**
  `/Users/edoardobiondi/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/`
  - Loghi: `LOGHI/` (Caraval logo nero/bianco PNG+PDF)
  - Font display: `CARAVAL/MCF STONEHEAD DEMO.TTF` → copiato in `public/fonts/`
  - Font Imaginarium: `IMAGINARIUM/Fonts/TheCircous.{ttf,otf}` (per sub-route Imaginarium)
  - Brochure spettacoli: `BROCHURE SPETTACOLI/`
  - Documenti strategici: `Caraval_DesignBrief.md`, `Caraval_FaseA_PianoDiLavoro.md`

---

## 2. Strategia

### Positioning
Caraval Spettacoli è la compagnia teatrale della media pianura padana che attraversa con la stessa serietà la prosa, il teatro di strada e gli spettacoli di fuoco, e che ogni estate trasforma i borghi del territorio in palcoscenico con il festival Imaginarium.

**Tagline:** *Una compagnia. Tre anime. Un festival.*

### Tre anime artistiche
1. **Prosa** — La Fine del Mondo, Arlecchino servo per amore, Romeo+Giulietta L'Inferno dell'Amore, La Banalità del Male
2. **Strada** — I Viaggiastorie
3. **Fuoco** — Legend, Cubiculum Diaboli, Macbeth, Origines

Repertorio attivo: **9 spettacoli** (4 prosa + 1 strada + 4 fuoco).

### Festival Imaginarium
3ª edizione: **4–18 giugno 2026**, 6 serate, ingresso libero. Compagnie ospiti: Stivalaccio Teatro, Tournée Da Bar, Compagnia Burambò.

### Officina Teatrale
Corso adulti (ott–mag, 1 sera/sett), spettacolo finale a Imaginarium. 2 corsi attivi + laboratori scolastici.

### Tone of voice (4 attributi)
1. **Caldo, mai distaccato** — tu/noi, niente passivo impersonale
2. **Diretto, non aulico** — frasi corte, verbi concreti
3. **Evocativo dove serve, asciutto altrove**
4. **Sicuro, mai auto-celebrativo**

**Bandite:** magico, indimenticabile, eccellenza, sognante, fiabesco, "vi invitiamo", "siamo una realtà".
**Da usare:** stupore, sorprendere, borghi, itinerante, officina, comunità, tradizione popolare, insieme.

### Audience (4 personas)
1. **Marta** (47, Soncino) — B2C prossimità → "Quando e dove?"
2. **Stefano e Chiara** (38–42, Brescia) — B2C culturale → "Vale la pena spostarsi?"
3. **Roberto** (54, assessore) — B2B → "È una compagnia seria?"
4. **Anna** (56, aspirante allieva) — formazione → "Posso farlo anch'io?"

### Premi
- Premio Edallo CremainScena 2022 (Miseria e Nobiltà)
- Premio Edallo CremainScena 2023 (La Fine del Mondo)
- Miglior Drammaturgia Originale Atelier Leà 2025 (La Fine del Mondo)

### Palette / tipografia (definitivi — Sessione 2)

**Colori (CSS vars in `globals.css`, esposti come Tailwind colors):**
- `nero-base #0a0a0a` · `nero-soft #1a1a1a` · `nero-deep #050505`
- `rosso-base #a8174a` · `rosso-hover #c01d56` · `rosso-deep #8e1240` · `rosso-muted rgba(168,23,74,0.1)`
- `crema-base #f5e6d3` · `crema-bright #faf0e1` · `crema-muted rgba(245,230,211,0.7)` · `crema-faint rgba(245,230,211,0.4)`

**Tipografia:**
- Body: Inter (`next/font`, var `--font-inter`)
- Display: MCF Stonehead Demo (`@font-face`, file in `public/fonts/`, var `--font-stonehead`)
- Scala: `text-display-xl/l/m`, `text-h1…h4`, `text-body-l/body/body-s`, `text-caption`, `text-label`
- Riduzioni mobile via media query in `globals.css` (sotto 768px) — display-xl 56px, h1 32px, ecc.
- Body min 16px, contrasto ≥ 4.5:1 (WCAG AA)
- Label sempre uppercase + tracking 0.1em (utility `.uppercase-tracked`)

**Spacing:** scala completa `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128`.

**Border radius:** `sm 4` · `md 8` · `lg 12` · `xl 24` · `full`.

**Shadow:** `sm` (subtle), `md`, `lg` (drammatica), `glow-rosso`, `glow-rosso-lg`.

**Transizioni:** `duration-fast 100ms`, `duration-base 200ms`, `duration-slow 400ms` con `ease-cinema` (cubic-bezier).

**Container max-width:** narrow 720 / default 1280 / wide 1440. Padding orizzontale: 16/24/32 (mobile/tablet/desktop).

**Doppia identità** (Imaginarium sub-route): palette inversa — `crema-base` come bg dominante, `rosso-base` accenti. Da implementare in Sessione 3+ via componente o root override della sub-route.

**Doppia identità:** Imaginarium (sub-route) usa palette inversa (crema su rosso) + font Stonehead più presente.

---

## 3. Tecnica

### Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **CMS:** Sanity v3 con Studio embedded a `/studio`
- **Hosting:** Vercel (Hobby)
- **Repo:** GitHub
- **Privacy:** Iubenda (env vars hardcoded)
- **Analytics:** Umami self-hosted (Sessione futura)

### Struttura cartelle
```
/
├── src/app/                 # Next.js App Router
│   ├── layout.tsx           # root layout, font Inter, Header+Footer integrati
│   ├── page.tsx             # homepage
│   ├── globals.css          # CSS vars palette, focus ring, skip link, mobile type scale
│   ├── demo/                # pagina demo query Sanity
│   ├── design-system/       # showcase interna design system (noindex)
│   └── studio/[[...tool]]/  # Sanity Studio embedded
├── src/components/
│   ├── ui/                  # Button (con prop pulse), Card, Container, Section
│   ├── layout/              # SkipLink, Header, Footer, Hero (variant manifesto-spettacolo)
│   ├── caraval/             # CategoriaBadge, PremioBadge, SpettacoloCard (variant manifesto), EventoCard, TicketBiglietto, TitoloDoppio, TitoloRitmico, CreditiLocandina, CitazioneStampa
│   ├── decorative/          # SVG inline: Stella5Punte, MascheraTeatrale, Fiamma, OndaDecorativa, Divider, CorniceDeco
│   └── effects/             # FadeInOnScroll, RevealSipario, CustomCursor, ImmagineConOverlay
├── src/lib/
│   ├── cn.ts                # helper className via clsx
│   └── hooks/               # useFadeInOnScroll, useParallax
├── sanity/
│   ├── env.ts               # lettura env vars
│   ├── lib/{client,image}.ts
│   ├── structure.ts         # struttura desk con singleton
│   ├── seed.ts              # script pre-popolamento
│   └── schemas/             # 8 schemi + objects/
├── public/fonts/            # MCFStoneheadDemo.ttf
├── sanity.config.ts
├── sanity.cli.ts
├── tailwind.config.ts
└── CLAUDE.md
```

### Comandi
```bash
npm run dev        # Next.js dev server → localhost:3000
npm run build      # Build production
npm run start      # Serve build production
npm run lint       # ESLint
npm run seed       # Pre-popola impostazioniSito (richiede SANITY_API_WRITE_TOKEN)
```

### Variabili d'ambiente
File `.env.local` (mai committato), `.env.example` come template:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — ID progetto Sanity
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`
- `SANITY_API_WRITE_TOKEN` — solo per script seed (token con write da sanity.io/manage)

Vercel: stessi env settati per Production e Preview.

---

## 4. Stato progetto

### ✅ Sessione 1 — Setup tecnico (FATTO)
- [x] Bootstrap Next.js 14 + TS + Tailwind + App Router
- [x] Stack Sanity installato (sanity, next-sanity, image-url, vision, portabletext)
- [x] 8 schemi Sanity creati + 2 object types riusabili (`luogo`, `comeParteciapare`)
- [x] Sanity Studio embedded a `/studio`
- [x] Singleton handling (`impostazioniSito`, `paginaChiSiamo`, `paginaOspita`)
- [x] Design tokens (colori + Inter + Stonehead + spacing)
- [x] Skeleton homepage + `/demo` per validare connessione Sanity
- [x] Script seed `impostazioniSito` con dati iniziali Caraval
- [x] Git init + push GitHub
- [x] Vercel link + preview deploy
- [x] CLAUDE.md (questo file)

### ✅ Sessione 2 — Design System (FATTO)
- [x] Token Tailwind finalizzati: palette estesa, scala tipografica completa, spacing/radius/shadow/transizioni
- [x] `globals.css` con CSS vars, focus ring rosso `:focus-visible`, skip link, riduzione mobile delle scale display
- [x] Componenti UI base (`src/components/ui/`): `Button` (4 variants × 3 size, loading, as link/a/button), `Card`, `Container`, `Section`
- [x] Componenti layout (`src/components/layout/`): `SkipLink`, `Header` (sticky con blur on scroll, mobile overlay), `Footer` (3 colonne, fetch Sanity con fallback), `Hero` (template)
- [x] Componenti dominio (`src/components/caraval/`): `CategoriaBadge`, `PremioBadge`, `SpettacoloCard`, `EventoCard`
- [x] Layout root con Header/Footer integrati e skip link
- [x] Pagina `/design-system` showcase (noindex)
- [x] Build production pulito (`npm run build`)

### ✅ Sessione 2.5 — Polish Design System (FATTO)
Personalità teatrale distintiva. Niente più "tech-startup": vintage circus, manifesti d'epoca, cinema poster.

**Token nuovi (`tailwind.config.ts` + `globals.css`):**
- Gradients: `bg-gradient-hero`, `bg-gradient-overlay-rosso`, `bg-gradient-overlay-nero` (CSS vars)
- Shadow: `shadow-poster` (drammatica per blocchi principali)
- Easing: `ease-bounce-soft` (cubic-bezier 0.34, 1.56, 0.64, 1) per micro-interazioni giocose
- Duration: `duration-cinematic` (800ms) e `duration-sipario` (1200ms)
- Animation utilities: `animate-pulse-rosso`, `animate-fade-in-up`, `animate-sipario-left/right`
- `font-mono` (system stack) per dettagli tipo numero seriale ticket

**Componenti distintivi (`src/components/`):**
- `decorative/` — libreria SVG inline con `currentColor`: `Stella5Punte`, `MascheraTeatrale` (commedia/tragedia), `Fiamma`, `OndaDecorativa`, `Divider` (linea + stella), `CorniceDeco` (wrapper art déco)
- `caraval/TitoloDoppio` — titoli stratificati Stonehead con offset orizzontale + body Inter italic
- `caraval/TitoloRitmico` — mix dimensioni small/large nella stessa frase
- `caraval/TicketBiglietto` — biglietto cinema vintage anni '50 (bordo doppio + sezione "STRAPPA QUI" verticale + variant `compact`)
- `caraval/CreditiLocandina` — `<dl>` semantica formato locandina (REGIA — Vera Rossini)
- `caraval/CitazioneStampa` — citazione con virgolette decorative SVG

**Animazioni cinematografiche (`src/components/effects/` + `src/lib/hooks/`):**
- `FadeInOnScroll` + `useFadeInOnScroll` — Intersection Observer con `prefers-reduced-motion`
- `RevealSipario` — due tendaggi si separano al mount (1200ms ease-cinema)
- `useParallax` — translateY proporzionale allo scroll
- `CustomCursor` — punto rosso lerp su mouse, solo desktop con hover, montato in `layout.tsx`
- `ImmagineConOverlay` — wrapper hover con gradient overlay

**Estensioni componenti esistenti:**
- `Hero`: variant `manifesto-spettacolo` (asimmetrico 60/40 foto-testo) + align `left-extreme`
- `SpettacoloCard`: variant `manifesto` (aspect 2:3, categoria verticale, stamp premio rotondo, hover rotation)
- `Button`: prop `pulse` (animazione box-shadow rossa pulsante per CTA principali)

**Showcase `/design-system` riorganizzata in 15 sezioni:**
1 Palette · 2 Tipografia (2.1 scale + 2.2 pattern espressivi) · 3 Spacing · 4 Buttons (4.1 variants + 4.2 pulse) · 5 Cards · 6 Containers · 7 Sections (con gradient-hero) · 8 Hero · 9 SpettacoloCard (9.1 card + 9.2 manifesto) · 10 Eventi & Ticket · 11 Badges · 12 Accenti decorativi · 13 Effetti & gradients · 14 Animazioni · 15 Hero Manifesto + Crediti + Citazione.

**Regola Stonehead (memoria operativa):** font display SOLO su `[A-Z0-9]`. Punteggiatura/simboli sempre Inter. Nei componenti decorativi non Unicode `★`/`—` ma SVG inline.

### ⏳ Da fare nelle prossime sessioni
- [ ] **Sessione 3** — Pagine reali (homepage, /spettacoli, /spettacoli/[slug], /imaginarium...)
- [ ] **Sessione 4** — Calendario eventi + filtraggio
- [ ] **Sessione 5** — Pagina formazione + chi siamo + ospita + contatti
- [ ] **Sessione 6** — Iubenda + Umami analytics + accessibilità WCAG AA
- [ ] **Sessione 7** — Popolamento contenuti reali + foto ottimizzate + go-live

---

## 5. Convenzioni

### Naming
- **File componenti:** PascalCase (`SpettacoloCard.tsx`)
- **File utilities:** camelCase (`formatDate.ts`)
- **Schemi Sanity:** camelCase nome tecnico (`spettacoloImaginarium`), label italiano nel campo `title`
- **Slug URL:** kebab-case in italiano (`/chi-siamo`, `/spettacoli/romeo-giulietta`)

### Componenti React
- Server Components di default; `"use client"` solo dove serve interattività
- Tailwind classi inline; per pattern ricorrenti → componenti

### Commit messages (Conventional)
- `feat:` nuove funzionalità
- `fix:` bugfix
- `chore:` config/setup
- `docs:` documentazione
- `style:` solo formatting
- `refactor:` ristrutturazione senza cambio comportamento

### Sanity
- Tutti i campi visibili al cliente in **italiano**
- Slug autogenerati dal titolo dove possibile
- Singleton: usare ID fisso uguale al nome del tipo (es. `_id: "impostazioniSito"`)
- Validazioni condizionali via `validation.custom` con accesso a `ctx.document`
- Image alt **obbligatorio** dove l'immagine è user-facing

---

## 6. Sanity — gestione contenuti

### Project ID
Vedi `.env.local`. Lo Studio è raggiungibile sia su `/studio` (in dev e produzione) che via CLI con `npx sanity dev`.

### Schemi (11 tipi totali)
**Documenti:** `spettacolo`, `evento`, `edizioneImaginarium`, `spettacoloImaginarium`, `corso`, `membro`, `paginaChiSiamo`, `paginaOspita`, `impostazioniSito`
**Object riusabili:** `luogo`, `comeParteciapare`

### Singleton
Tre tipi sono singleton (un solo documento per tipo):
- `impostazioniSito` (settings globali)
- `paginaChiSiamo`
- `paginaOspita`

Lo Studio nasconde i template "new" per questi tipi e disabilita unpublish/delete (vedi `sanity.config.ts`).

### Slug rules
- `spettacolo`: slug autogenerato dal titolo, max 96 char
- `edizioneImaginarium`: slug = anno (es. `2026`)
- `evento`: slug autogenerato dal titolo

### Pre-popolamento
Script `npm run seed` popola `impostazioniSito` con i dati iniziali (contatti, dati associazione, hero homepage). Richiede `SANITY_API_WRITE_TOKEN`.

### Query patterns
Importa il client da `sanity/lib/client`:
```ts
import { client } from "@/../sanity/lib/client";
const data = await client.fetch(`*[_type == "spettacolo" && inRepertorio == true]`);
```

---

## 7. Deploy

### Workflow
1. Lavora su feature branch (`git checkout -b feat/nome-feature`)
2. Push → Vercel crea Preview deploy automaticamente
3. Merge su `main` → deploy production

### Environments Vercel
- **Production:** branch `main`
- **Preview:** ogni branch e PR

### Env vars Vercel
Settare via `vercel env add` o dashboard:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (Production + Preview)
- `NEXT_PUBLIC_SANITY_DATASET` (Production + Preview)
- `NEXT_PUBLIC_SANITY_API_VERSION` (Production + Preview)
- `SANITY_API_WRITE_TOKEN` (NON necessaria su Vercel — solo locale per seed)

### MCP Chrome (testing visivo)
Per le sessioni di design dovremo configurare un MCP Chrome/Playwright per consentire a Claude Code di "vedere" la pagina. Setup futuro tramite:
```bash
claude mcp add chrome-devtools npx -- @modelcontextprotocol/server-chrome
```
(Da finalizzare in Sessione 2.)

---

## 8. Note operative

- **Cartella `MATERIALE-PER-SITO/` è esterna al repo Git** — leggi i file ma non committare i materiali. Le foto/loghi necessarie copiale in `public/` o caricale su Sanity.
- **Sanity Studio** è single-source-of-truth per i contenuti. Non hardcodare testi nelle pagine.
- **Account / credenziali**:
  - GitHub: `CaravalSpettacoli` / `info@caraval.it`
  - Sanity: `info@caraval.it`
  - Vercel: collegato a GitHub
