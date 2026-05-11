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

### ✅ Sessione 2.6 — Polish Chirurgico (FATTO)
Bug fix critici e raffinamenti dopo Sessione 2.5. Calma e profondità: meno cose, fatte bene.

**Bug fix:**
- **Font Stonehead `@misterchek` watermark risolto**: `font-feature-settings: "liga" 0, "dlig" 0, "salt" 0, "ss01-05" 0, "calt" 0, "swsh" 0, "ornm" 0` su `@font-face` + `.font-display` in `globals.css`. Test alfabeto in `/design-system` § 2.0.
- **Helper `splitDisplay(text)`** in `src/lib/splitDisplay.tsx`: uppercase + wrap automatico di punteggiatura/non-A-Z in `<span class="font-sans">`. Applicato a `Hero`, `SpettacoloCard`, `EventoCard`, `TitoloDoppio`, `TitoloRitmico`, `Header` (mobile nav), `Sipario`, demo page.
- **Pulse rosso non più infinito**: 3 cicli con `animation-delay: 800ms`; hover riavvia 1 ciclo. Skip su `prefers-reduced-motion`.
- **Script `npm run clean`** (`rm -rf .next`) per ChunkLoadError.

**Animazioni più morbide:**
- `FadeInOnScroll` ora usa la classe `.fade-in-on-scroll` (1000ms `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, translateY 24px) — sostituisce il vecchio `duration-cinematic`/`ease-cinema` che era brusco.
- `useParallax` default speed `0.15` (era 0.3) + early return su mobile (≤768px) e `prefers-reduced-motion`.
- Bottone Replay sipario in `/design-system` § 14 (già presente da 2.5 via `replayKey`).

**Sipario preloader homepage** (`src/components/layout/Sipario.tsx`):
- Full-screen overlay con due tendaggi rossi (gradiente `var(--color-rosso-deep) → var(--color-rosso-base)`) e texture velluto (strisce verticali) + vignettatura interna lato palco.
- Centro: "PRONTI A ENTRARE IN SCENA" in Stonehead, divisore SVG, label "CARAVAL SPETTACOLI — SONCINO".
- State machine: aspetta `window.load`, `minDuration=800ms`, failsafe `maxDuration=3000ms`. Apertura 1500ms con `cubic-bezier(0.7, 0, 0.3, 1)`. Smonta dopo l'animazione (no DOM residuo).
- Skip totale su `prefers-reduced-motion`. `pointer-events: none` + `aria-hidden`.
- Modalità `mode="preview"` per il showcase: parte subito, niente attesa load.
- Integrato in `src/app/page.tsx`. Sezione 16 in `/design-system` con anteprima.

**TicketBiglietto rifatto con 3 stili A/B/C** (prop `style`):
- **A — Manifesto vintage italiano**: bordo doppio rosso, ornamenti floreali agli angoli, Georgia italic per testi minori, fondo crema con texture "carta vecchia", divisore tratteggiato a cerchietti, "INGRESSO" in italico ruotato.
- **B — Art Deco puro**: cornice geometrica con linee multiple + outline esterna, ornamenti a ventaglio agli angoli, divisore zigzag/chevron, "INGRESSO" in Stonehead ruotato, seriale alto in etichetta meccanica.
- **C — Mix (default)**: cornice doppia + maschera teatrale stilizzata in alto centro, divisore tratteggiato con stella centrale, "INGRESSO" in Inter uppercase tracked.
- Hover comune: lift `-8px` + scale `1.02` + rotate `-1deg` + shadow rossa `0 16px 48px rgba(168,23,74,0.3)` + sezione INGRESSO bg `rosso-muted` + data si alza ulteriormente.
- Click "strappo": classe `is-tearing` su INGRESSO (`translateX(-20px) rotate(-3deg)` + opacity 0.5 in 380ms) prima dell'apertura URL. Skip su `prefers-reduced-motion`.
- Confronto a 3 affiancati in `/design-system` § 10.2 per scelta visiva.

**Decorativi 3 varianti A/B/C** (prop `style`):
- `Stella5Punte`, `MascheraTeatrale`, `Fiamma`, `OndaDecorativa`, `Divider`, `CorniceDeco` — ognuno con 3 versioni stilistiche. Showcase aggiornato in § 12 (sub-sezioni 12.1–12.6).

**Regola Stonehead rinforzata:**
- Stonehead solo su caratteri `[A-Z0-9 ]`. Per testi dinamici da Sanity → sempre `splitDisplay(text)` che fa uppercase + spezza punteggiatura in Inter.
- Per testi statici con punteggiatura → `<span className="font-display">PAROLA</span><span className="font-sans"> — </span>...`.

### ✅ Sessione 2.7 — Polish Definitivo (FATTO)
Riparazione finale prima delle pagine reali. Branch `polish/sessione-2-7`.

**Sistema font (definitivo, 2 font):**
- Display: **Cinzel Decorative** (400/700/900) caricato via `next/font/google` → `--font-cinzel`. Mappato su `font-display` di Tailwind.
- Body/UI: **Inter** (300/400/500/600/700) → `--font-inter`. Mappato su `font-sans` e default `body`.
- **Stonehead Demo è ritirato dal display generale**. Resta solo nel logo Header tramite l'utility `font-stonehead`. Tutti gli altri usi sono passati a `font-display` (Cinzel).
- Le feature-settings anti-watermark restano applicate sull'@font-face e sulla classe `.font-stonehead` in `globals.css` — `splitDisplay()` è ancora in uso ma con Cinzel non è più strettamente necessario; lasciato per coerenza.

**Componenti rimossi/sostituiti:**
- `TicketBiglietto` (3 stili A/B/C, ~600 righe) → eliminato.
- Nuovo `Ticket` unico in `src/components/caraval/Ticket.tsx`: cream + bordo rosso 1.5px + radius 10px, perforazione a 8 puntini, stub "INGRESSO" verticale, divider tratteggiato, titolo Cinzel + venue/prezzo Inter, colonna destra giorno/mese + N° seriale. Filigrana SVG ondulata (`ticket-watermark.svg.tsx`) opacity 0.07. Hover: lift 4px + soft shadow. Click: strappo stub 300ms, poi redirect (skip su `prefers-reduced-motion`). Mobile: titolo 15px + line-clamp 2 (no più "CUBICULUM D...").
- **Nota strategica:** il Ticket attuale è una base placeholder. Verrà ridisegnato in Sessione 4 ispirato a reference teatro nera con simmetria centrale (verticale, integrato nel template scheda spettacolo).

**Sipario rifatto (`src/components/layout/Sipario.tsx` + `globals.css`):**
- State machine esplicita: `0–1500ms` testo "Pronti a entrare in scena?" visibile · `1500–1900ms` fade testo (400ms) · `1900–4400ms` apertura tendaggi (2500ms).
- Easing definitivo: `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Pannelli rettangolari puliti** (provata l'ondulazione laterale + orlo decorativo via SVG `<clipPath>` ma scartata: simple > stylised). Texture velluto a bande verticali irregolari + gradient verticale rosso-deep → rosso-base + ombra interna lato palco mantenuti.
- Prop `withSound?: boolean` predisposto (file `/sounds/curtain.mp3` non incluso).
- Fallback `prefers-reduced-motion`: pannelli `display: none`, solo fade-out 400ms del contenuto centrale.

**Cursore decorativo rifatto (`src/components/effects/CustomCursor.tsx`):**
- Dot rosso 8px ø + glow trail rosso (24px, opacity 0.22, blur 5px) che segue con lerp 0.18.
- Posizione gestita via `requestAnimationFrame` + `transform: translate3d()` (no transition su position → niente lag).
- Scale 1.5 al `mousedown` con transition 150ms solo su `scale` (non su position).
- Componente attivo solo su `(hover: hover) and (pointer: fine)` e niente `prefers-reduced-motion`. Setta `data-custom-cursor="true"` sul `body` al mount.
- CSS in `globals.css`: con `data-custom-cursor="true"`, `cursor: none !important` su `body, a, button, [role=button], input, textarea, select, label, summary, [tabindex]`. Eccezione `cursor: text !important` solo sui campi di testo (`input[type=text/email/tel/search/url/password]`, `textarea`, `[contenteditable=true]`) per non rompere l'UX di scrittura.

**Decisioni di design prese:**
- 2 font massimo (Cinzel + Inter), niente Bodoni / Abril.
- Border radius del Ticket: 10px (era 4px).
- Sipario: pulito > stilizzato. Niente onde decorative su bordi.

### ✅ Sessione 3 — Homepage + Hub Imaginarium (FATTO)
Prime due pagine reali Sanity-driven. Branch `feat/sessione-3-homepage-imaginarium`.

**Schemi Sanity nuovi:**
- `homepageHero` (singleton) — fotoSfondo, heading, subheading, 2 CTA. ID fisso `homepageHero`.
- `homepageCopy` (singleton) — tutti i testi sezioni Premi / Imaginarium preview / Repertorio / Officina / Ospita / Contatti, organizzati in groups Studio.
- `premio` (collection) — anno, nomePremio, rassegna, spettacoloAssociato→spettacolo, motivazione, ordineHomepage, mostraInHomepage.

**Schemi estesi:**
- `spettacolo` — aggiunti `mostraInHomepage`, `ordineHomepage`, `referenteContatto`→membro, `premiAssociati`→[premio], `regia`, `produzione`. Resi optional (in fieldset "Contenuti consigliati"): `immagineCover`, `descrizioneBreve`, `annoCreazione`, `descrizioneNarrativa` — non più bloccanti per la demo. Vecchio array `premi` inline marcato come DEPRECATO.
- `membro` — aggiunti `referenteAreaTesto`, `telefonoPubblico`, `emailPubblica`. `foto` resa optional.
- `corso` — aggiunti `statoCorso` (enum), `dataChiusuraIscrizioni`, `spettacoloFinaleLinked`, `referenteIscrizioni`. Vecchio `spettacoloFinaleRif` marcato DEPRECATO.
- `edizioneImaginarium` — aggiunti `mostraInHomepage`, `locationPrincipale`, `descrizioneBreve`, `patrocinio`/`sponsor`/`partnerLista` (3 array di string separati). `descrizione` e `immagineCover` resi optional. Vecchio `partner` (con tipo discriminator) marcato DEPRECATO.
- `spettacoloImaginarium` — aggiunti `linkCompagniaEsterna`, `locationSpecifica`. `descrizione`, `immagineCover`, `comeParteciapare` resi optional.

**Singleton handling:** `homepageHero` e `homepageCopy` aggiunti a `singletonTypes`, listati in `sanity/structure.ts`, registrati in `sanity/schemas/index.ts`.

**Seed demo content:** script idempotente in `sanity/scripts/seed-demo-content.ts`, eseguibile con `npm run sanity:seed`. Crea `_id` deterministici (`spettacolo-romeo-giulietta`, `premio-edallo-2022`, `edizione-imaginarium-2026`...). Popola:
- 2 singleton (`homepageHero`, `homepageCopy`) con copy esatto da `COPY_HOMEPAGE.md`
- 2 membri (Vera Rossini, Nicola Pignoli con recapiti pubblici)
- 11 spettacoli (10 in repertorio + Miseria e Nobiltà archivio): Romeo+Giulietta e Miseria popolati 100%, gli altri minimi (titolo + categoria + ordine + referente Nicola sui fuochi)
- 3 premi (Edallo 2022/2023, Atelier Leà 2025) linkati ai relativi spettacoli; patch su Romeo/Fine del Mondo/Miseria per popolare `premiAssociati`
- 3 edizioni Imaginarium (2026 piena con location/sponsor/partner, 2025 e 2024 placeholder)
- 6 spettacoli Imaginarium 2026 linkati all'edizione corrente
- 2 corsi Officina con spettacolo finale linkato

**Importante:** lo script seed NON è stato eseguito da Claude — richiede `SANITY_API_WRITE_TOKEN`. Edo lo esegue con `npm run sanity:seed` per popolare il dataset.

**Componenti nuovi:**
- `src/components/ui/PlaceholderImage.tsx` — usato per ogni spettacolo senza foto.
- `src/components/caraval/HeroHomepage.tsx` — 80vh, foto Sanity opzionale, gradient overlay, CTA primary `pulse` + CTA secondaria sottolineata.
- `src/components/caraval/StripPremi.tsx` — bg `nero-soft`, heading sx + 3 card a dx con bordo rosso 1px, anno Cinzel grande.
- `src/components/caraval/ImaginariumPreview.tsx` — palette inversa `bg-crema-base`, logo testuale "IMAGINARIUM" Cinzel, programma 2x3, strip patrocinio/sponsor/partner.
- `src/components/caraval/RepertorioPreview.tsx` — bg nero, 2 colonne raggruppate per categoria (prosa | fuoco+strada).
- `src/components/caraval/OfficinaTeaser.tsx` — bg `nero-soft`, layout asimmetrico testo + 2 maschere teatrali decorative.
- `src/components/caraval/OspitaTeaser.tsx` — bg rosso pieno, testi crema, CTA bianca, onde decorative.
- `src/components/caraval/ContattiPrelude.tsx` — 2 CTA grandi affiancate (mailto + tel) lette da `impostazioniSito.contattiPubblici`.
- `src/components/imaginarium/HeroImaginarium.tsx` · `ProgrammaCompleto.tsx` · `SponsorPartnerStrip.tsx` · `EdizioniPassate.tsx`.

**Pagine:**
- `src/app/page.tsx` riscritta come Server Component con `Promise.all` di 7 fetch GROQ. Tutti i testi da Sanity, niente hardcoded. `revalidate = 60`.
- `src/app/imaginarium/page.tsx` — hub edizione corrente (palette inversa scoped via wrapper `theme-imaginarium`).
- `src/app/imaginarium/[anno]/page.tsx` — route dinamica: `notFound()` se anno non esiste, "Programma in caricamento" se popolata ma senza spettacoli, layout completo se piena.

**CSS:** aggiunta classe `.theme-imaginarium` in `globals.css` per scope locale palette inversa.

**Verifica:**
- `npx tsc --noEmit` pulito · `npm run lint` pulito · `npm run build` pulito (8 rotte generate).
- Screenshot Chrome MCP desktop+mobile salvati in `.screenshots/`. Le pagine renderizzano "graceful empty" finché il seed non viene eseguito — è il comportamento atteso (Sanity-driven senza dati = niente da mostrare).

**Decisioni autonome:**
- Mantenuto `corrente` boolean su `edizioneImaginarium` (esistente) e aggiunto `mostraInHomepage` come campo separato — più flessibile per scenari "anteprima dell'edizione futura mentre la corrente è ancora attiva".
- I campi legacy (`spettacolo.premi`, `corso.spettacoloFinaleRif`, `edizioneImaginarium.partner`) lasciati con description "DEPRECATO" invece che rimossi — zero rischio di rompere document esistenti.
- Logo Imaginarium: testo Cinzel "IMAGINARIUM" come placeholder finché non arriva l'asset.
- Spacing sezioni usa la `<Section>` esistente (`py-12 md:py-20 lg:py-24`) invece di nuovi token — ritmo coerente con design system.

### ✅ Sessione 4 — Spettacoli (Indice + Scheda + Archivio + Ticket finale) (FATTO)
Branch `feat/sessione-4-spettacoli` da `main` (post-merge PR #2).

**Schemi Sanity estesi:**
- `spettacolo.ts`: aggiunti `trailerYoutube` (url con validation YouTube, fieldset `contenutiConsigliati`) e oggetto `prenotazione` (modalità enum required default `richiestaContatto`, `urlBiglietti` con `hidden` se modalità ≠ `linkEsterno`, `etichettaCustom`, `noteAggiuntive`). Nuovo fieldset `prenotazioniFs`.
- Nuovo singleton `paginaSpettacoliCopy` per copy indice + archivio (groups Studio: Indice / Archivio).

**Seed esteso (`sanity/scripts/seed-demo-content.ts`):**
- Singleton `paginaSpettacoliCopy` (createOrReplace) con copy default (eyebrow, heading, intro, CTA archivio, archivio eyebrow/heading/intro).
- Patch idempotente di Romeo+Giulietta con dati 100% dal PDF brochure: nuovo slug `romeo-giulietta-inferno-amore`, descrizione narrativa 4 paragrafi, descrizione breve, anno 2026, regia "Vera Rossini", cast 5 voci (Vera/Nicola/Andrico/Botti/Aurora), schedaTecnica completa (durata 70min, palco 8x6 H5.50, audio 220V, note montaggio), prenotazione `richiestaContatto`, referente Vera. `trailerYoutube` lasciato vuoto.
- Patch Miseria e Nobiltà: regia "Lorenzo Samanni", prenotazione `richiestaContatto`.
- Patch prenotazione `richiestaContatto` su tutti gli altri 9 spettacoli attivi (`setIfMissing`).
- Patch `referenteContatto` Vera su I Viaggiastorie.
- 7 nuovi document archivio: Giovanna D'Arco, L'Inferno di Dante, I Folli di Notre Dame, Servitore di due padroni, Sogno di una notte di mezza estate, Ezzelino da Romano, Battute fuori scena. Tutti `inRepertorio: false`. Insieme a Miseria → archivio totale 8.

**Pagine nuove:**
- `src/app/spettacoli/page.tsx`: hero compatto 40vh + griglia con filtro client-side. CTA archivio in fondo.
- `src/app/spettacoli/[slug]/page.tsx`: 9 sezioni dinamiche. `generateStaticParams()` prerendera tutti gli slug attivi. `notFound()` per slug inesistenti.
- `src/app/spettacoli/archivio/page.tsx`: hero 40vh + griglia 4 colonne 4:5 NON cliccabile (decisione Vera 7/5).

**Componenti nuovi (`src/components/caraval/`):**
- `SpettacoloCardLarge`, `SpettacoliGrid` (Client), `HeroSpettacolo`, `DescrizioneNarrativa`, `GalleriaFoto` (Client con `<dialog>` lightbox HTML), `TrailerVideo` (embed YouTube), `SchedaTecnica`, `CastECrediti` (regex `/attor/i` per dividere attori da crediti), `CitazioniStampaList`, `SezionePrenotazione`, `TicketSpettacolo`, `SpettacoliCorrelati`.

**TicketSpettacolo (Task E):**
- Verticale 2:5 max-w 280, sfondo `nero-deep`, bordo rosso 1.5px, perforazioni laterali simulate, stella SVG centrale, "INGRESSO" verticale rotated.
- CTA dinamica per 5 modalità: `linkEsterno` button new-tab, `emailTelefono` 2 button mailto+subject/tel, `ingressoLibero` box dorato, `botteghino` box neutro, `richiestaContatto` button con ancora `#prenotazione`.
- Hover lift -1.5 + shadow rossa, active:scale 0.97.

**Verifica:**
- `npx tsc --noEmit` pulito · `npm run lint` pulito · `npm run build` pulito (12 rotte, di cui 10 `/spettacoli/[slug]` prerenderate SSG).
- Screenshot Chrome MCP desktop+mobile in `.screenshots/4-*.png` (indice, scheda Romeo, archivio).
- Le sezioni ricche di Romeo (galleria, trailer, citazioni, scheda tecnica) appariranno DOPO esecuzione `npm run sanity:seed` con SANITY_API_WRITE_TOKEN.

**Decisioni autonome:**
- Skog e A Christmas Carol restano in repertorio attivo (categoria fuoco, da COPY §4) — il prompt §F li elencava in archivio, ma il COPY del cliente prevale.
- `trailerYoutube` di Romeo `undefined` (PDF non espone URL leggibile). La sezione `<TrailerVideo>` non si renderizza con campo vuoto.
- Cast Romeo: tutti e 5 i crediti dentro `cast[]` con `ruolo` discriminator. `regia` separata duplicata, evidenziata sopra dal componente.
- Categoria color ticket: `prosa` → `text-rosso-hover`, `fuoco` → `text-amber-400`, `strada` → `text-crema-base`. Niente token nuovi.
- Patch `setIfMissing` su prenotazione: idempotente, non sovrascrive edit di Vera.
- `Ticket.tsx` (Sessione 2.7) lasciato in repo per eventuale uso calendario eventi.

### ✅ Sessione 5 — Calendario + Formazione (FATTO)
Branch `feat/sessione-5-calendario-formazione` da `main` post-merge PR #4.

**Schemi Sanity:**
- `evento` (riscritto da zero, schema legacy Sessione 1 non usato): `spettacolo` ref required, `dataOra` datetime required, `luogo` (riuso object esistente), `modalitaAccesso` enum (linkEsterno|prenotazione|ingressoLibero|botteghino) default `prenotazione`, `urlBiglietti` condizionale, `note`, `mostraInCalendario` default true. Preview con titolo+data+città. Label "Eventi (date manuali)".
- `homepageCopy` esteso con 2 nuovi groups: `calendario` (3 campi) e `formazione` (12 campi).

**Pagine nuove:**
- `/calendario` — Server Component, fetch `Promise.all` di `evento` (`mostraInCalendario && dataOra >= oggi`) + `spettacoloImaginarium` (`data >= oggi`) + `homepageCopy`. Helper `buildCalendario()` raggruppa imaginarium per giornata e unisce con eventi ordinati cronologicamente. `groupByMese()` raggruppa per "MESE ANNO" italiano. Hero 40vh + filtri client + lista per mese + CTA finale Ospita.
- `/formazione` — Server Component, fetch corsi `statoCorso != "concluso"` con join referenteIscrizioni + spettacoloFinaleLinked. Hero 50vh + sezione corsi (grid 2 col) + sezione laboratori bg `nero-soft` + CTA finale "Chiama Vera".

**Componenti nuovi (`src/components/caraval/`):**
- `EventoCard` — data sx (giorno Cinzel + mese + giorno settimana + ora) + contenuto dx (CategoriaBadge + titolo + luogo + note + CTA dinamica per 4 modalità). Stretched-link su scheda spettacolo.
- `GiornataImaginariumCard` — palette inversa (bg crema), badge Imaginarium {anno}, lista spettacoli giornata con thumb, CTA `/imaginarium`.
- `CalendarioFilter` (Client) — 4 bottoni Tutti/Prosa/Fuoco e strada/Imaginarium, raggruppamento per mese visibile.
- `CorsoCard` — badge stato (in_corso verde / iscrizioni_aperte oro / concluso muted), titolo Cinzel, target/frequenza/date in `<dl>`, link spettacolo finale a `/imaginarium/{anno}/{slug}`, recapiti referente cliccabili (tel:, mailto:).
- `LaboratoriScuoleSection` — bg `nero-soft`, layout asimmetrico 2/3 + maschera teatrale decorativa.

**Lib:**
- `src/lib/calendario-utils.ts` — types `CalendarioItem` (discriminated union evento|imaginarium), `buildCalendario()`, `groupByMese()`, `meseLabel()`.

**Rinomina:**
- Vecchio `EventoCard.tsx` (Sessione 2.5, card data+contenuto semplice usata in `/design-system` showcase 10.1) → `EventoCardSimple.tsx`. Import nel design-system aggiornato (`{ EventoCardSimple as EventoCard } from "..."` per minimizzare diff). Il nuovo `EventoCard.tsx` è il componente del calendario.

**Seed esteso:**
- `homepageCopy` con 15 nuovi campi default (3 calendario + 12 formazione). NB: il seed usa `createOrReplace` su `homepageCopy`, quindi un'esecuzione successiva sovrascrive eventuali customizzazioni Vera — comportamento esistente da Sessione 3, non modificato.

**Verifica:**
- `npx tsc --noEmit` pulito · `npm run lint` pulito · `npm run build` pulito.
- Build pulito su branch rebased post-merge Sessione 4 → 14 rotte totali (incluse `/spettacoli`, `/spettacoli/[slug]`, `/spettacoli/archivio`).
- Screenshot Chrome MCP desktop+mobile in `.screenshots/5-{calendario,formazione}-{desktop,mobile}.png`.

**Stato dati:**
- Su `/calendario` lo stato vuoto è il comportamento atteso finché Vera non carica eventi manuali via Studio + il seed `npm run sanity:seed` non viene rieseguito per popolare `spettacoloImaginarium` 2026.
- Su `/formazione` i 2 corsi seedati appaiono con dati reali (Vera referente, badge IN CORSO, recapiti cliccabili).

**Decisioni autonome:**
- `evento` schema sostituito (non esteso): zero document attivi, le query GROQ del prompt erano incompatibili con i nomi legacy (`dataInizio`/`spettacoloRif`/`comeParteciapare.tipo`). Riuso `luogo` object esistente, leggo `luogo.nomeStruttura` come `nome` via alias GROQ.
- `EventoCard` rinominato → `EventoCardSimple` invece di `TicketBigliettoVintage`: il vecchio componente NON era una variante ticket vintage (quello era `TicketBiglietto.tsx`, eliminato in 2.7), era solo una card data+contenuto. Nome più onesto.
- `homepageCopy` esteso (vs nuovo singleton `paginaFormazioneCopy`): un singolo singleton è più maneggevole per Vera, pattern coerente con groups Studio.

### ✅ Blocco 1 — Polish strutturale (FATTO)
Branch `feat/blocco-1-polish-strutturale` da `main` post-merge Sessione 5.

**Task A — Bug fix:**
- A.1 typo "proloco": fonte già corretta in tutte le 3 occorrenze (`COPY_HOMEPAGE.md`, `seed-demo-content.ts`, `src/app/calendario/page.tsx` fallback) — il typo è solo nel documento Sanity live, si risolve al prossimo seed run.
- A.2/A.3 overflow CTA hero homepage e logo IMAGINARIUM: assorbiti in Task B (i nuovi hero usano `clamp()` su font-size + `flex-wrap` sulle CTA). I componenti `HeroHomepage`/`HeroImaginarium` sono stati eliminati.
- A.4 Footer split CARAVAL/Associazione: `Footer.tsx` divide ora `ragioneSociale` su space, prima parola in Cinzel 1.5rem leading-none, resto in Inter body-s `text-crema-muted`.

**Task B — `HeroPagina` unificato (`src/components/caraval/HeroPagina.tsx`):**
- Props: `eyebrow`, `heading`, `sottotitolo`, `ctaPrimaria`, `ctaSecondaria`, `fotoSfondo`, `palette` (`default` | `imaginarium`), `altezza` (`full` | `compatto`).
- Layout sinistra-allineato max-w 820px, padding generoso (full = 100vh / py-20-28; compatto = 60vh / py-14-20). Foto sfondo opzionale con gradient overlay (nero per default, crema per imaginarium).
- Heading clamp `2.75–7rem` (full) / `2.25–5rem` (compatto). CTA secondaria `flex-wrap` + clamp font-size per evitare overflow su 375px.
- Refactor pagine: homepage (`altezza=full`), `/spettacoli` (compatto), `/imaginarium` (full, `palette=imaginarium`), `/imaginarium/[anno]` (compatto, imaginarium), `/calendario` (compatto), `/formazione` (compatto).
- **Eliminati**: `src/components/caraval/HeroHomepage.tsx`, `src/components/imaginarium/HeroImaginarium.tsx`. La hero scheda singola `HeroSpettacolo.tsx` rimane invariata (logica specifica).

**Task C — `CounterStrip` (`src/components/caraval/CounterStrip.tsx`):**
- Componente riusabile, props `eyebrow` + `numeri[]` + `palette`. Grid 1/2/4 colonne con separatori verticali su desktop. Valori in Cinzel `clamp(3rem, 7vw, 5rem)`.
- Schema `homepageCopy` esteso con group `numeri`: campi `numeriEyebrow` (default "I NUMERI") + `numeriElenco[]` (object array con `valore` e `etichetta` required, max 6, defaults 9 spettacoli / 3 anime / 6 anni / 1 festival).
- Inserito in homepage tra `StripPremi` e `ImaginariumPreview`. Fallback hardcoded se Sanity non popolato.

**Task D — Counter Imaginarium:**
- **Decisione**: nuovo singleton `paginaImaginariumCopy` (cumulativi totali del festival, non per edizione). Più maneggevole per Vera (la stessa hub-page può crescere con altri copy) ed evita duplicare campi su ogni `edizioneImaginarium`.
- Schema `sanity/schemas/paginaImaginariumCopy.ts`: `counterEyebrow` (default "IMAGINARIUM IN NUMERI") + `counterElenco[]` (defaults 3 edizioni / 18 spettacoli / 12 compagnie / 2.500+ spettatori).
- Registrato in `sanity/schemas/index.ts` (schemaTypes + singletonTypes) e `sanity/structure.ts` (sotto Pagina Spettacoli — Copy).
- Inserito in `/imaginarium` tra hero e ProgrammaCompleto, palette inversa.
- Seed esteso (`seed-demo-content.ts`) con `createOrReplace` di `paginaImaginariumCopy` (step 9b).

**Task E — `SpettacoliAccordionHomepage`:**
- **Decisione boolean**: riusato campo esistente `mostraInHomepage` (Sessione 3) invece di crearne uno nuovo `inHomepage`. Stessa semantica, zero duplicazioni. Patch seed: 8 spettacoli con `mostraInHomepage=true` e `ordineHomepage` 1–8 (Romeo, Fine del Mondo, Arlecchino, Banalità per prosa; Cubiculum, Macbeth, Legend, Viaggiastorie per fuoco/strada). Skog e A Christmas Carol: `mostraInHomepage=false` (visibili solo su `/spettacoli`).
- Componente Client (`"use client"`) — accordion 2 colonne (Prosa | Fuoco e strada). Click apre/chiude voce con descrizione breve + link "Vai allo spettacolo →". 1 voce aperta per colonna alla volta. CTA centrale finale "Vedi tutto il repertorio →" (testi/link da `homepageCopy.repertorio*`).
- **Eliminato**: `src/components/caraval/RepertorioPreview.tsx`.

**Task F — `/spettacoli` con archivio integrato:**
- Nuovo componente `ArchivioSpettacoliGrid.tsx` (estratto dalla vecchia pagina archivio): grid 4 colonne 4:5 con titolo + anno + regia, niente CTA.
- `/spettacoli` ora ha 2 sezioni: hero "Il repertorio / Produzioni in repertorio" → SpettacoliGrid (filtri client) → sezione archivio con anchor `#archivio` (eyebrow "ARCHIVIO" + heading "Produzioni passate" + intro).
- `SpettacoloCardLarge.tsx`: aggiunto overlay gradient on-hover desktop + CTA "Scopri di più →" (visibile sempre su mobile, fade-in su hover desktop).
- **Redirect 301** `/spettacoli/archivio` → `/spettacoli#archivio` in `next.config.mjs`.
- **Eliminato**: `src/app/spettacoli/archivio/page.tsx`.

**Task G — Spaziature CSS:**
- Aggiunte 3 variabili in `globals.css`: `--space-section-y: clamp(4rem, 8vw, 8rem)`, `--space-block-y: clamp(2rem, 4vw, 4rem)`, `--space-element-y: clamp(1rem, 2vw, 1.5rem)`.
- `Section` component: ora applica `padding-block: var(--space-section-y)` invece delle vecchie classi `py-12 md:py-20 lg:py-24` — singola fonte di verità.
- `CounterStrip` e `SpettacoliAccordionHomepage` usano la stessa var per coerenza ritmica.

**Verifica:**
- `npx tsc --noEmit` pulito · `npm run lint` pulito · `npm run build` pulito (21 rotte).
- Screenshot Chrome MCP desktop+mobile in `.screenshots/blocco-1-{homepage,spettacoli,imaginarium,calendario,formazione}-{desktop,mobile}.png`.

**Stato dati Sanity:**
- I nuovi campi (`numeri*` su homepageCopy, `counter*` su paginaImaginariumCopy) hanno `initialValue` nello schema → visibili in Studio anche senza re-seed.
- I valori reali ("9 spettacoli", "3 anime"…) vengono popolati da seed via `createOrReplace`. Edo dovrà eseguire `npm run sanity:seed` con `SANITY_API_WRITE_TOKEN` per allineare il dataset.
- Stato vuoto in produzione: i fallback hardcoded in `page.tsx` mostrano i valori default → niente buchi visivi pre-seed.

### ✅ Blocco 2 — Sessione 6: Chi Siamo + Contatti + Ospita (FATTO)
Branch `feat/blocco-2-sessione-6-chi-siamo-contatti-ospita` da `main` post-merge Blocco 1.

**3 pagine create:**
- `/chi-siamo` — hero compatto + storia (media-text 50/50) + griglia 6 membri (3/2/1 col, gerarchia orizzontale, foto placeholder con icona User per chi non ha foto) + sezione premi (3 card linked a spettacoli) + box Scuola di Magia (40/60 con CTA outlined target=_blank) + CTA finale (2 bottoni "Vedi spettacoli" / "Contattaci").
- `/contatti` — hero compatto + sezione "Dove siamo" (indirizzo + P.IVA da `impostazioniSito`, no mappa) + grid 2×2 di 4 aree contatto (Spettacolo B2B, Formazione, Fuoco, Generale) con icone `lucide-react` (Theater/GraduationCap/Flame/MessageCircle) + sezione "Seguici" condizionale (renderizzata solo se `socialLinks` configurati; usa fallback hardcoded del Footer come default).
- `/ospita` — hero compatto con CTA primaria mailto subject "Richiesta ingaggio" + valore proposto + processo 3 step (con linea di connessione gradient su desktop) + 3 testimonianze placeholder + strip "Hanno ingaggiato Caraval" (nomi separati da · in Cinzel) + CTA finale variant rosso pieno.

**Schemi Sanity nuovi (3 singleton + 1 esteso):**
- `paginaChiSiamoCopy` — groups Studio: hero / storia / membri / premi / scuolaMagia. Tutti i campi con `initialValue`.
- `paginaContattiCopy` — groups: hero / aree. `aree[]` con object discriminato (icona enum 4 valori, eyebrow/titolo/descrizione required, ref membro opzionale, override tel/email).
- `paginaOspitaCopy` — groups: hero / valore / processo / testimonianze / ingaggiato / ctafinale. `processoIngaggioStep[]` e `testimonianze[]` come array di object con `initialValue` 3 placeholder.
- `membro` esteso: aggiunto `bioBreve` (text, max 200) per griglia chi-siamo, `bio` esistente rinominato "Bio (opzionale, lunga)" per uso futuro. `ordineDisplay` del prompt → riusato `ordinamento` esistente (stessa semantica).

**Schemi legacy:** `paginaChiSiamo` e `paginaOspita` (definiti in `paginaInfo.ts`, mai usati nel codice) lasciati intatti per zero rischio di rompere documenti pre-esistenti. I nuovi sono `paginaChiSiamoCopy` / `paginaOspitaCopy` come da prompt.

**Componenti nuovi (`src/components/caraval/`):**
- `SezioneStoria.tsx` — media-text 50/50, foto placeholder con logo Caraval bianco low-opacity se `storiaFotoSezione` non popolato.
- `MembriGrid.tsx` — grid 1/2/3, foto 4:5 con bg `rosso-muted` + `<User>` icona per placeholder.
- `PremiSezione.tsx` — grid 3 card, ognuna linka allo spettacolo associato se `slug` presente.
- `ScuolaMagiaBox.tsx` — layout 5/7 (foto/testo) con CTA outlined `border-crema-base hover:bg-crema-base hover:text-nero-base`. Placeholder icona `<Sparkles>` se foto manca.
- `ContattiSezione.tsx` — card area contatto, icona discriminata, telefono/email con priorità override → referente → fallback impostazioni.
- `ProcessoIngaggio.tsx` — 3 step con linea connessione (gradient dot via div assoluto top-12) visible su md+.
- `TestimonianzeStrip.tsx` — grid 3 col, icona `<Quote>`, blockquote + footer autore/ente.
- `HannoIngaggiatoCaraval.tsx` — paragrafo Cinzel con `·` rosso tra nomi.
- `CtaFinale.tsx` — riusabile `variant="default" | "rosso"` (bg rosso pieno con CTA crema invertita usato in /ospita).

**Seed esteso:**
- 6 membri totali (Vera, Alessio, Nicola, Lorenzo, Marco, Ilaria) con `bioBreve` + `ordinamento` 1-6. Vera/Nicola patchati con nuova `bioBreve` + `ruoli` aggiornati.
- 3 nuovi singleton popolati: `paginaChiSiamoCopy`, `paginaContattiCopy` (con 4 aree referenziate a Vera×2/Nicola/generale-no-ref), `paginaOspitaCopy` (con 3 step + 3 testimonianze + 6 enti placeholder).
- Step 9c nel runner per i 3 nuovi `createOrReplace`.

**Header + Footer (Task D):**
- Header desktop: voci invariate (Spettacoli, Imaginarium, Formazione, Chi siamo, Contatti). **Ospita NON in header desktop** come da decisione esplicita.
- Header mobile: aggiunta voce extra "Ospita Caraval" via array `MOBILE_EXTRA_LINKS` separato — visibile solo nel drawer hamburger (B2B accessibile da mobile, separato dalle voci primarie).
- Footer: ristrutturato da grid 3 a **grid 4 colonne semantiche**: Caraval (intestazione + indirizzo) · Sito (Spettacoli, Calendario, Formazione, Imaginarium) · Chi siamo (Chi siamo, Contatti, Ospita Caraval) · Contatti (email, telefono, social).

**Decisioni autonome:**
- Estensione `membro.bioBreve` invece di rinomina campi: `bio` lungo resta per scheda dettaglio futura. `ordineDisplay` del prompt = `ordinamento` esistente (riuso).
- Sezione "Seguici" su `/contatti` condizionale: render solo se `socialLinks` non vuoto in Sanity. Su empty state non si renderizza (no riquadro vuoto).
- Footer 4 colonne (vs 3 del prompt): "Caraval" come intestazione separata + 3 colonne nav. La sezione "Chi siamo" in evidenza B2B include Ospita come richiesto.
- Voce "Ospita" su mobile menu: l'utente B2B su mobile non avrebbe accesso senza scrollare al footer. Aggiunta come voce visivamente identica alle altre ma in array separato per chiarezza semantica nel codice.
- `lucide-react` usato per tutte le icone (Theater, GraduationCap, Flame, MessageCircle, Quote, User, Sparkles, Instagram, Facebook, Youtube). Nessuna emoji.

**Verifica:**
- `npx tsc --noEmit` pulito · `npm run lint` pulito · `npm run build` pulito (24 rotte, di cui 3 nuove static `/chi-siamo`, `/contatti`, `/ospita`).
- Screenshot Chrome MCP desktop+mobile in `.screenshots/blocco-2-{chi-siamo,contatti,ospita}-{desktop,mobile}.png`.

**Stato dati:**
- Tutti i contenuti hanno `initialValue` nello schema → Studio mostra defaults senza re-seed.
- I valori live aggiornati via `npm run sanity:seed` (richiede `SANITY_API_WRITE_TOKEN`). Dopo seed: 4 nuovi membri con bioBreve/ruoli/ordinamento, 3 singleton popolati (createOrReplace).
- Fallback hardcoded nelle pagine garantiscono render decente anche pre-seed.

### ✅ Mini-blocco 2.5a — Sistemi adattivi (FATTO)
Branch `feat/2-5a-sistemi-adattivi` da `main` post-merge Blocco 2.

**Problema risolto:**
1. Cursore custom (dot rosso fisso `bg-rosso-base`) invisibile su sezioni rosse pieni (Ospita CTA, Counter Imaginarium accent) e poco coerente su sezioni crema.
2. Header non adattivo sezione-per-sezione: usava regex `LIGHT_BG_ROUTES` per pagina, quindi su `/imaginarium` diventava illeggibile sulla sezione Counter rosso, e viceversa su `/` la sezione Imaginarium preview crema.

**Soluzione architetturale: theme system + IntersectionObserver.**

**File nuovo:**
- `src/lib/theme-system.ts` — `SectionTheme = "dark" | "light" | "accent"`, `themeStyles` con (cursorColor, trailColor, headerVariant) per ogni tema, mappe di conversione `paletteToTheme` / `sectionBgToTheme` / `ctaVariantToTheme` per derivare il tema dalle prop esistenti senza aggiungerne di nuove.

**File modificati — pattern "deriva da prop esistente":**
- `src/components/ui/Section.tsx` — deriva auto `data-theme` da `background`. Una sola modifica copre 15+ usi della pagina (`/spettacoli`, `/calendario`, `/formazione`, `/contatti`, `/ospita` + tutti i componenti che usano `<Section>`).
- `src/components/caraval/HeroPagina.tsx` — `data-theme={paletteToTheme[palette]}`.
- `src/components/caraval/CounterStrip.tsx` — idem.
- `src/components/caraval/VideoYoutube.tsx` — idem.
- `src/components/imaginarium/ProgrammaCompleto.tsx` — idem su entrambe le section (empty state + main).
- `src/components/imaginarium/EdizioniPassate.tsx` — `data-theme={isRosso ? "accent" : "light"}` (palette `default` qui ha bg crema → light, non dark; non riusa `paletteToTheme`).
- `src/components/caraval/CtaFinale.tsx` — `data-theme={ctaVariantToTheme[variant]}`.

**File modificati — hardcoded `data-theme` sul `<section>`:**
- `OspitaTeaser.tsx` → `accent`
- `ImaginariumPreview.tsx` → `light`
- `SponsorPartnerStrip.tsx` → `light`
- `src/app/imaginarium/[anno]/page.tsx` (fallback "Programma in caricamento") → `light`
- 11 file con `<section>` dark hardcoded: `SpettacoliAccordionHomepage`, `HeroSpettacolo`, `GalleriaFoto`, `TrailerVideo`, `SezioneStoria`, `MembriGrid`, `PremiSezione`, `ScuolaMagiaBox`, `ProcessoIngaggio`, `TestimonianzeStrip`, `HannoIngaggiatoCaraval` → `dark`.

**Cursore adattivo (`src/components/effects/CustomCursor.tsx`):**
- State `currentTheme: SectionTheme` (default `"dark"`).
- `IntersectionObserver` con `rootMargin: "-40% 0px -40% 0px"` (solo il 20% centrale del viewport) + `threshold: [0, 0.25, 0.5, 0.75, 1]` osserva `section[data-theme]`. La sezione con `intersectionRatio` più alto definisce il tema.
- Colore dot e trail inline da `themeStyles[currentTheme]` (cursorColor, trailColor), `transition: background-color 220ms ease-out` (mai su transform, gestita da rAF).
- Trail: rosso brand `#a8174a` su dark/light, nero `#0a0a0a` su accent (il rosso si fonderebbe con lo sfondo rosso pieno). Decisione mia per bilanciare visibilità e cifra cromatica brand.
- Niente debounce: con `rootMargin -40%` solo una sezione tocca il 20% centrale → niente flicker possibile. Cleanup `observer.disconnect()` aggiunto.

**Header adattivo (`src/components/layout/Header.tsx`):**
- Rimossa logica `LIGHT_BG_ROUTES` regex + `usePathname` (sostituita da IntersectionObserver).
- State `currentTheme: SectionTheme`. `recomputeTheme()` itera `section[data-theme]` e trova quella che ha `rect.top <= HEADER_HEIGHT && rect.bottom > HEADER_HEIGHT`. Triggerata sia da observer (`rootMargin: "-80px 0px -90% 0px"`) sia da scroll handler come fallback.
- `dark = variant === "dark" || scrolled || open`: su scroll/menu mobile aperto si forza dark (backdrop blur nero è la scelta UX coerente).
- Logo cross-fade: 2 `<img>` sovrapposti in wrapper `position: relative` con dimensione fissa (`width: 180px`, `h-9 md:h-12`). `opacity` 0/1 con transition 220ms. Risolve l'aspect ratio diverso tra white (2.54:1) e black (1.78:1) via `object-contain object-left`.

**Decisioni autonome documentate:**
1. **Trail rosso su dark/light, nero su accent** — per visibilità sul rosso pieno.
2. **Cross-fade vs swap con `key` remount** — più fluido, niente flash, dimensioni fisse evitano layout shift.
3. **`paletteToTheme` invece di nuova prop `theme`** — i componenti con palette già esistente derivano automaticamente.
4. **`EdizioniPassate.palette="default"` non mappa a `dark`** — il suo bg è `crema-bright` (light), non nero. Hardcode ternario `isRosso ? "accent" : "light"`.
5. **Header dark su scroll anche su pagine light** — backdrop blur nero leggibile + consistente con behavior precedente.

**Verifica:**
- `npx tsc --noEmit` pulito · `npm run lint` pulito · `npm run build` pulito.
- Verifica HTML server-rendered con curl + grep `data-theme`:
  - `/` → 6 dark + 1 light + 1 accent ✓
  - `/imaginarium` → 3 light + 3 accent ✓
  - `/ospita` → 2 dark + 1 accent ✓
  - `/chi-siamo` → 4 dark (membri/premi renderizzano solo con dati Sanity)
  - `/contatti` `/calendario` `/formazione` `/spettacoli` → tutti dark ✓
- Chrome MCP non disponibile in questa sessione → niente screenshot, verifica solo via curl.

### ✅ Polish Definitivo (FATTO)
Branch `feat/polish-definitivo` da `main` post-merge PR #8.

**Mega-blocco che sostituisce i mini-blocchi 2.5a/b/c, risolve 14 feedback Edo.**

**Task 1 — Fix sistemi adattivi (cursore + header):**
- Chrome MCP non disponibile in sessione → niente diagnosi runtime con log. Procedo con fix robusti basati su analisi statica.
- `CustomCursor`: aggiunto `recomputeNow()` sincrono basato su `getBoundingClientRect` (cerca sezione che contiene il centro del viewport), chiamato sia subito dopo setTimeout 50ms sia su scroll throttled via rAF. `lastThemeRef` previene setState ridondanti.
- `Header`: stesso pattern. `recomputeTheme()` ora chiamato sincronamente all'inizio del useEffect (primo paint deterministico) + dentro setTimeout 50ms + su scroll. `lastThemeRef` guard.
- IntersectionObserver mantenuto come trigger di aggiornamento ma rimosso il `rootMargin -40%` problematico: ora threshold normali + recompute via rect.

**Task 2 — Palette uniformata + Section refactor:**
- `theme-system.ts`: mappe invariate.
- `Section.tsx`: aggiunte 2 prop opzionali:
  - `theme?: SectionTheme` — override esplicito, ha priorità su `background` legacy.
  - `bgVariant?: "base" | "soft"` — alternanza intra-pagina (`#0a0a0a` vs `#161616` su dark, `#f5e6d3` vs `#ebd9c0` su light).
- Backward compat: `background` prop continua a funzionare come prima. Le pagine nuove usano `theme` + `bgVariant`.
- Applicato `theme="dark" bgVariant="soft"` a: `/spettacoli` grid attiva, `/calendario` lista eventi, `/formazione` corsi.

**Task 3 — `CtaFinale` uniforme:**
- Refactor props: `variant: "dark" | "accent"` (era `"default" | "rosso"`), prop `sottotitolo` (era `body`), nuova prop `fotoSfondo` opzionale per variant dark con foto.
- Default `variant="accent"`: tutte le CTA finali del sito sono rosso pieno (Edo confermato in tabella prompt §3.3).
- **9 pagine** ora terminano con `<CtaFinale variant="accent">` uniforme:
  - `/` — heading "Sei un Comune…" → /ospita (sostituisce OspitaTeaser)
  - `/spettacoli` — "Ti interessa uno dei nostri spettacoli?" → /contatti
  - `/spettacoli/[slug]` — "Vuoi portare questo spettacolo da te?" → mailto ingaggio
  - `/imaginarium` — "Imaginarium è un progetto della comunità." → /
  - `/calendario` — "Sei un Comune…" → /ospita (riuso copy Sanity)
  - `/formazione` — "Vuoi iscriverti?" → mailto + tel
  - `/chi-siamo` — "Vuoi conoscerci meglio?" → /spettacoli + /contatti
  - `/contatti` — "Pronto a iniziare?" → mailto + tel
  - `/ospita` — "Pronto a portare Caraval da te?" → mailto ingaggio
- `OspitaTeaser` rimosso come usage in homepage (componente resta nel codebase, può essere riusato altrove).

**Task 4 — Accordion homepage allineato:**
- `SpettacoliAccordionHomepage.tsx`: `min-h-[4rem] md:min-h-[5rem]` sulle voci button → tutte allineate orizzontalmente tra colonne.

**Task 5 — `CorsoCard` con CTA Contattaci:**
- Aggiunto CTA testuale "Contattaci per informazioni →" che linka a `/contatti`. Stile = link uppercase tracked con freccia.
- Prop `ctaLabel?: string` su `CorsoCardData` per override.
- Campo Sanity `homepageCopy.corsoCardCtaLabel` (default "Contattaci per informazioni").
- `/formazione` passa la label dal copy a tutti i CorsoCard.

**Task 6 — `/chi-siamo` arricchita:**
- Storia importata da caraval.it: 5 paragrafi corposi che raccontano la compagnia. Sostituiscono testo precedente più breve.
- **Decisione mia**: "Dal 2016" come da sito attuale (la versione precedente diceva "dal 2020"). Edo verificherà con Vera.
- `heroHeading="Una compagnia, tre anime, un festival"` (era "Da una piazza vuota a un festival").
- `MembriGrid`: placeholder iniziali ("VR", "AR", "NP", "LS", "MR", "IC") con `font-display` size clamp 3-5rem invece di icona `User`. Sfondo `bg-rosso-base/15`. Coerente con il prompt §6.2.
- Schema `paginaChiSiamoCopy` esteso con i nuovi defaults (storiaBody rows 12).
- Seed aggiornato con storia importata.
- Tutti i 6 membri restano popolati dal Blocco 2 (Vera, Alessio, Nicola, Lorenzo, Marco, Ilaria). Query GROQ `*[_type == "membro"]` fa fetch di tutti.

**Task 7 — `/contatti` arricchita:**
- Sezione "Sui social → Seguici" già esistente. Aggiunto `SOCIAL_FALLBACK` hardcoded con URL ufficiali (FB/IG/YT) come fallback se Sanity non ha socialLinks valorizzati. Stesso pattern del Footer.
- URL aggiornati ai canali ufficiali completi (Facebook/Caraval-Spettacoli-101656231430635, Instagram/caravalspettacoli, YouTube/channel/UC-9aDMm5MfweZP7Weq881EA).
- Telefono associativo `+39 379 1497805` + email `caravalspettacoli@gmail.com` già nelle 4 aree contatto (config seed Blocco 2). Verificati cliccabili.
- Indirizzo "Via Borgo San Martino 8, 26029 Soncino (CR)" + P.IVA "01720800190" già dal singleton `impostazioniSito`.

**Task 8 — Footer ristrutturato finale:**
- Footer era già 4 colonne (Blocco 2). Aggiornato:
  - URL social fallback completi (FB/IG/YT)
  - `bg-nero-soft` (era `bg-nero-deep`) → coerente con palette §2.2
  - `data-theme="dark"` esplicito per sistema adattivo

**Task 9 — Schede spettacoli da caraval.it:**
- WebFetch su 6 URL specifici (Romeo, Sogno, Servitore, Christmas Carol, Inferno, Miseria) → estrazione descrizione plain text.
- **Romeo escluso**: già popolato dal PDF brochure in Sessione 4 (versione più ricca).
- Patch idempotente con `setIfMissing` su `descrizioneNarrativa` dei 5 spettacoli rimanenti (Sogno, Servitore, Christmas Carol, Inferno, Miseria). Step 14 del seed.
- Se Vera ha già editato in Studio, il seed NON sovrascrive (setIfMissing).

**Decisioni autonome documentate:**
1. **Chrome MCP non funzionante in sessione** → fix Task 1 basato su analisi statica + ridondanza (sincrono + IntersectionObserver + scroll). Annotato in PR.
2. **Romeo storia da brochure mantenuta** invece di sovrascrivere con versione caraval.it più breve.
3. **"Dal 2016" da sito attuale**, contraria al "dal 2020" precedente (decisione di Edo da verificare con Vera).
4. **`setIfMissing` per descrizioni**: zero rischio di sovrascrivere edit Vera.
5. **`CtaFinale.variant` default = "accent"**: tutte le CTA finali rosso pieno come da tabella prompt §3.3.
6. **OspitaTeaser non eliminato**: resta nel codebase ma non più usato in homepage. Sostituito da CtaFinale.
7. **Placeholder membri = iniziali Cinzel** invece di icona generica (prompt §6.2 esplicito).
8. **bgVariant alternato a `/imaginarium`**: rispetto del prompt §2.2 (counter+programma+edizioni passate ora `light` con bgVariant alternato, NON più `accent`). Solo CTA finale resta accent.

**Verifica:**
- `npx tsc --noEmit` pulito · `npm run lint` pulito · `npm run build` pulito (24 rotte invariate).
- HTML server-rendered verificato via curl: tutte le pagine principali hanno conteggi `data-theme` coerenti.
- Chrome MCP non disponibile → niente screenshot allegati alla PR. Da verificare manualmente in preview Vercel.

**Note bug residui:**
- Task 1 fix è basato su analisi statica + ridondanza. Se Edo riscontra ancora "ogni tanto non coerente", servirà diagnosi runtime live (cosa impossibile in questa sessione per Chrome MCP down).
- Programma Imaginarium con palette `imaginarium` (light) anziché `rosso` come prima: visivamente più chiaro, da validare con Edo nel preview.

### ⏳ Da fare nelle prossime sessioni
- [ ] **Sessione 6** — Chi siamo + ospita + contatti + privacy/cookie
- [ ] **Sessione 7** — Iubenda + Umami analytics + accessibilità WCAG AA
- [ ] **Sessione 8** — Popolamento contenuti reali + foto ottimizzate + go-live

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

### Troubleshooting

- **`ChunkLoadError: Loading chunk app/layout failed`** dopo modifiche grosse al layout root → cache `.next` corrotta. Risolvi con:
  ```bash
  npm run clean && npm run dev
  ```
- **Font Stonehead mostra il watermark `@misterchek`** su lettere come S/M/A/F → `font-feature-settings` non sta agendo. Verifica che `globals.css` abbia il blocco anti-alternates su `@font-face` E `.font-display`. Se ancora visibile, la lettera potrebbe avere un alternates fuori dai feature-tag noti: applica una whitelist (Stonehead solo lettere pulite, fallback Georgia per quelle problematiche).
- **Testi dinamici da Sanity in font-display**: usa sempre `splitDisplay(text)` da `src/lib/splitDisplay.tsx`. Fa uppercase e spezza punteggiatura in Inter automaticamente.
