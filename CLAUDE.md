# CLAUDE.md — Memoria per Claude Code

> Letto automaticamente dalle sessioni Claude Code. Tienilo aggiornato a fine sessione.

---

## 1. Header

- **Progetto:** Caraval Spettacoli — sito istituzionale + festival Imaginarium
- **Cliente:** Caraval Associazione Culturale (Soncino, CR)
- **Repo:** https://github.com/CaravalSpettacoli/caraval-spettacoli
- **Hosting:** Vercel (`caraval-spettacoli`) · **CMS:** Sanity (dataset `production`)
- **Working dir:** `/Users/edoardobiondi/Desktop/SITO-CARAVAL/SITO/`
- **Materiali brand esterni (leggere, non committare):** `/Users/edoardobiondi/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/`
  - `LOGHI/` (Caraval nero/bianco PNG+PDF) · `CARAVAL/MCF STONEHEAD DEMO.TTF` → `public/fonts/`
  - `IMAGINARIUM/Fonts/TheCircous.{ttf,otf}` · `BROCHURE SPETTACOLI/`
  - Strategici: `Caraval_DesignBrief.md`, `Caraval_FaseA_PianoDiLavoro.md`

---

## 2. Strategia & brand

### Positioning
Compagnia teatrale della media pianura padana che attraversa con la stessa serietà prosa, teatro di strada e fuoco. Ogni estate trasforma i borghi in palcoscenico col festival **Imaginarium**.

**Tagline:** *Una compagnia. Tre anime. Un festival.*

### Tre anime
- **Prosa:** La Fine del Mondo, Arlecchino servo per amore, Romeo+Giulietta L'Inferno dell'Amore, La Banalità del Male
- **Strada:** I Viaggiastorie
- **Fuoco:** Legend, Cubiculum Diaboli, Macbeth, Origines, Skog, A Christmas Carol

Repertorio attivo: 10 spettacoli + archivio 8 produzioni passate.

### Imaginarium
3ª edizione 4–18 giugno 2026, 6 serate, ingresso libero. Ospiti storici: Stivalaccio Teatro, Tournée Da Bar, Compagnia Burambò, Les Moustaches.

### Officina Teatrale
Corso adulti (ott–mag, 1 sera/sett), spettacolo finale a Imaginarium. 2 corsi attivi + laboratori scolastici.

### Tone of voice
1. Caldo, mai distaccato (tu/noi)
2. Diretto, non aulico
3. Evocativo dove serve, asciutto altrove
4. Sicuro, mai auto-celebrativo

**Bandite:** magico, indimenticabile, eccellenza, sognante, fiabesco, "vi invitiamo".
**Da usare:** stupore, sorprendere, borghi, itinerante, officina, comunità.

### Premi
- Edallo CremainScena 2022 (Miseria e Nobiltà) · 2023 (La Fine del Mondo)
- Miglior Drammaturgia Originale Atelier Leà 2025 (La Fine del Mondo)

### Palette (CSS vars in `globals.css` + Tailwind colors)
- `nero-base #0a0a0a` · `nero-soft #1a1a1a` · `nero-deep #050505`
- `rosso-base #a8174a` · `rosso-hover #c01d56` · `rosso-deep #8e1240` · `rosso-muted rgba(168,23,74,0.1)`
- `crema-base #f5e6d3` · `crema-bright #faf0e1` · `crema-muted rgba(245,230,211,0.7)` · `crema-faint rgba(245,230,211,0.4)`

**Doppia identità Imaginarium:** palette inversa scoped via `.theme-imaginarium` o `data-theme`.

### Tipografia (2 font definitivi)
- **Body:** Inter via `next/font` (var `--font-inter`) → `font-sans`, default body
- **Display:** Cinzel Decorative (400/700/900) via `next/font/google` (var `--font-cinzel`) → `font-display`
- **Stonehead Demo:** ritirato dal display generale; resta SOLO nel logo Header via utility `font-stonehead`. Feature-settings anti-watermark (`liga 0, dlig 0, salt 0, ss01-05 0, calt 0, swsh 0, ornm 0`) mantenute su `@font-face` e `.font-stonehead`.
- **Scala:** `text-display-xl/l/m`, `text-h1…h4`, `text-body-l/body/body-s`, `text-caption`, `text-label`
- Body ≥16px · contrasto ≥4.5:1 (WCAG AA) · Label uppercase + tracking 0.1em (`.uppercase-tracked`)
- Mobile (<768px): riduzione scale display in `globals.css`

### Tokens design
- **Spacing:** 4/8/12/16/20/24/32/40/48/64/80/96/128
- **Spacing CSS vars (sezioni):** `--space-section-y: clamp(4rem,8vw,8rem)` · `--space-block-y` · `--space-element-y`. `Section` component applica `padding-block: var(--space-section-y)`.
- **Radius:** sm 4 · md 8 · lg 12 · xl 24 · full
- **Shadow:** sm/md/lg · glow-rosso · glow-rosso-lg · poster (drammatica)
- **Transizioni:** duration-fast 100ms · base 200ms · slow 400ms · cinematic 800ms · sipario 1200ms · `ease-cinema` (cubic-bezier) · `ease-bounce-soft`
- **Container max-w:** narrow 720 / default 1280 / wide 1440. Padding 16/24/32 (mobile/tablet/desktop)
- **Gradients:** `bg-gradient-hero`, `bg-gradient-overlay-rosso/nero`

### Regola Stonehead/Cinzel
Display SOLO su `[A-Z0-9 ]`. Per testi dinamici Sanity → `splitDisplay(text)` in `src/lib/splitDisplay.tsx` (uppercase + wrap punteggiatura in Inter). Con Cinzel non più strettamente necessario, ma mantenuto per coerenza.

---

## 3. Stack tecnico

### Tech
- **Next.js 14** App Router + TypeScript + Tailwind CSS
- **Sanity v3** Studio embedded a `/studio`
- **Vercel** (Hobby) · GitHub · Iubenda (env hardcoded) · Umami self-hosted (futuro)

### Comandi
```bash
npm run dev          # localhost:3000
npm run build        # production
npm run lint
npm run clean        # rm -rf .next (per ChunkLoadError)
npm run seed         # popola impostazioniSito (richiede SANITY_API_WRITE_TOKEN)
npm run sanity:seed  # seed completo demo content
```

### Env vars (`.env.local`, mai committato)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` · `NEXT_PUBLIC_SANITY_DATASET=production` · `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`
- `SANITY_API_WRITE_TOKEN` (solo locale per script seed)

Vercel: stesse env per Production e Preview (NO token write).

### Struttura cartelle
```
src/app/
├── layout.tsx, template.tsx, page.tsx, globals.css
├── design-system/, demo/, studio/[[...tool]]/
├── spettacoli/, spettacoli/[slug]/
├── imaginarium/, imaginarium/[anno]/
├── calendario/, formazione/
├── chi-siamo/, contatti/, ospita/
src/components/
├── ui/         # Button, Card, Container, Section, PlaceholderImage
├── layout/     # SkipLink, Header, Footer, Hero, Sipario
├── caraval/    # ~30 componenti dominio (vedi §5)
├── imaginarium/# HeroImaginarium (legacy), ProgrammaCompleto, SponsorPartnerStrip, EdizioniPassate
├── decorative/ # Stella5Punte, MascheraTeatrale, Fiamma, OndaDecorativa, Divider, CorniceDeco (3 varianti A/B/C)
└── effects/    # FadeInOnScroll, RevealSipario, CustomCursor, ImmagineConOverlay, Reveal, HeroParallaxFoto, GlowSfondo
src/lib/
├── cn.ts, splitDisplay.tsx, theme-system.ts, calendario-utils.ts, prossimi-eventi-utils.ts
└── hooks/      # useFadeInOnScroll, useParallax
sanity/
├── env.ts, structure.ts
├── lib/{client,image}.ts
├── schemas/    # vedi §4
└── scripts/seed-demo-content.ts
scripts/import-images-to-sanity.ts
```

---

## 4. Schemi Sanity

### Document types
- **`impostazioniSito`** (singleton) — ragioneSociale, indirizzo, P.IVA, contattiPubblici (email/tel), socialLinks
- **`homepageHero`** (singleton) — fotoSfondo, heading, subheading, 2 CTA
- **`homepageCopy`** (singleton) — groups: premi · imaginarium · repertorio · officina · ospita · contatti · numeri (numeriEyebrow + numeriElenco[]) · calendario · formazione · patrociniHomepage[] (object: nome, logo, url) · calendarioHeroFotoSfondo · formazioneHeroFotoSfondo · corsoCardCtaLabel · descrizioneBreve per 10 spettacoli homepage accordion
- **`paginaImaginariumCopy`** (singleton) — heroFotoSfondo, counterEyebrow, counterElenco[]
- **`paginaSpettacoliCopy`** (singleton) — groups Indice / Archivio
- **`paginaChiSiamoCopy`** (singleton) — groups: hero (incluso heroFotoSfondo) · storia · membri · premi · scuolaMagia (foto + url)
- **`paginaContattiCopy`** (singleton) — heroFotoSfondo + aree[] (object: icona enum 4 valori, eyebrow, titolo, descrizione, ref membro, override tel/email)
- **`paginaOspitaCopy`** (singleton) — hero · valore · processoIngaggioStep[] · testimonianze[] · ingaggiato · ctaFinale
- **`spettacolo`** — titolo, slug, categoria (prosa|fuoco|strada), `immagineCover` (verticale 4:5), `fotoHero` (orizzontale 16:9), descrizioneBreve, descrizioneNarrativa, annoCreazione, regia, produzione, cast[] (object con ruolo discriminator), schedaTecnica, gallery, trailerYoutube, citazioniStampa[], `mostraInHomepage`, ordineHomepage, referenteContatto→membro, premiAssociati→[premio], `prenotazione` (object: modalita enum {linkEsterno|emailTelefono|ingressoLibero|botteghino|richiestaContatto} + urlBiglietti condizionale + etichettaCustom + noteAggiuntive), inRepertorio. **Deprecati:** `premi` inline
- **`spettacoloImaginarium`** — titolo, slug, descrizione, `immagineCover`, descrizioneBreve, descrizioneCompagniaBreve, linkCompagniaEsterna, locationSpecifica, data, edizione ref
- **`edizioneImaginarium`** — anno, slug (=anno), dataInizio/Fine, locationPrincipale, descrizione, descrizioneBreve, immagineCover, corrente bool, mostraInHomepage, patrocinio[], sponsor[], partnerLista[]. **Deprecato:** `partner` con tipo discriminator
- **`premio`** — anno, nomePremio, rassegna, spettacoloAssociato→spettacolo, motivazione, ordineHomepage, mostraInHomepage
- **`evento`** (riscritto Sess.5, esteso Hotfix 6) — spettacolo ref, dataOra, luogo (object), modalitaAccesso enum (4), urlBiglietti condizionale, note, mostraInCalendario. **Group "homepage":** `descrizioneBreve`, `mostraInHomepage` (default true), `ordinePriorita`, `ctaTipo` enum (default|link|telefono|email), `ctaValore` condizionale, `ctaLabel`
- **`corso`** — titolo, target, frequenza, date, statoCorso enum (in_corso|iscrizioni_aperte|concluso), dataChiusuraIscrizioni, spettacoloFinaleLinked, referenteIscrizioni→membro. **Deprecato:** `spettacoloFinaleRif`
- **`membro`** — nome, ruoli[], `bioBreve` (max 200, per griglia), `bio` (lunga, dettaglio futuro), foto (opt), `ordinamento`, referenteAreaTesto, telefonoPubblico, emailPubblica
- **Object riusabili:** `luogo` (nomeStruttura, citta, indirizzo, mappa) · `comeParteciapare` (tipo discriminator)

### Singleton handling
ID fisso = nome tipo. Studio nasconde "new template" + disabilita unpublish/delete (`sanity.config.ts`). Lista in `sanity/structure.ts`.

### Slug rules
- `spettacolo`: autogenerato dal titolo, max 96 char
- `edizioneImaginarium`: slug = anno (`2026`)
- `evento`: autogenerato

### Seed
`npm run sanity:seed` esegue `sanity/scripts/seed-demo-content.ts` (idempotente, `_id` deterministici). **Helper `createOrReplacePreservingImages(doc)`:** fa fetch del doc esistente e per campi nella whitelist `PRESERVED_IMAGE_FIELDS` preserva i valori già caricati (evita di cancellare foto importate via Studio o script). Whitelist: `fotoSfondo`, `heroFotoSfondo`, `storiaFotoSezione`, `scuolaMagiaFoto`, `formazione+calendarioHeroFotoSfondo`, `patrociniHomepage`. Applicato a 7 singleton createOrReplace.

### Script import foto/loghi
`npx tsx scripts/import-images-to-sanity.ts` — scansiona `MATERIALE-PER-SITO/FOTO PER SITO/` + `LOGHI SPONSOR E PREMI/`. Pattern matching:
- `hero-sito-generale` → `homepageHero.fotoSfondo`
- `{pagina}-hero` → singleton corrispondente
- `{slug}-orizzontale` → `spettacolo.fotoHero`
- `{slug}-verticale` o `{slug}-anteprima` → `spettacolo.immagineCover`
- `hero-{slug}` → `spettacolo.fotoHero`
- `{slug-membro}` → `membro.foto`
- `{compagnia}-imaginarium` → `spettacoloImaginarium` (fuzzy match in JS)
- Loghi sponsor → append a `patrociniHomepage[]`

Normalizzazione accenti NFD + underscore→trattino + strip prefix articoli italiani (la-/il-/i-). Idempotente.

---

## 5. Componenti chiave (`src/components/`)

### ui/
`Button` (4 variants × 3 size, prop `pulse` pulsazione box-shadow 3 cicli, hover translate-y + scale + shadow rossa) · `Card` · `Container` · `Section` (deriva auto `data-theme` da `background`, prop `theme: SectionTheme` override + `bgVariant: "base"|"soft"` alternanza intra-pagina + prop `glow?: GlowPosizione`) · `PlaceholderImage`

### layout/
`Header` (sticky, IntersectionObserver per tema adattivo, logo cross-fade bianco/nero con dimensioni fisse + preload, scrim adattivo, hover color per tema) · `Footer` (4 col semantiche: Caraval/Sito/Chi siamo/Contatti) · `Hero` (legacy template) · `Sipario` (preloader homepage, state machine 0–4400ms, pannelli rettangolari + texture velluto, fallback `prefers-reduced-motion`)

### caraval/ (dominio)
- **Hero/Layout:** `HeroPagina` (unificato: prop palette `default|imaginarium`, altezza `full|compatto`, fotoSfondo + parallax + subtle-zoom, placeholder grafico con SVG noise), `HeroSpettacolo` (specifico scheda), `HeroParallaxFoto`
- **Cards:** `SpettacoloCardLarge`, `SpettacoliGrid` (Client, filtri + lista verticale media-text alternato), `SpettacoloRow` (interno: foto 4:5 alternata sx/dx), `ArchivioSpettacoliGrid` (grid 4 col 4:5 non cliccabile, integrato in `/spettacoli#archivio`), `EventoCard`, `EventoCardSimple` (ex EventoCard Sess.2.5), `GiornataImaginariumCard`, `CorsoCard` (CTA "Contattaci per informazioni"), `SpettacoloCard` (variant manifesto)
- **Homepage:** `HeroHomepage`/`HeroImaginarium` eliminati in Blocco 1 (unificati in `HeroPagina`), `ProssimiEventiHomepage` (Client, sezione "Prossimi eventi" sotto hero, feed verticale, unifica `evento` + `spettacoloImaginarium`, auto-resolve via cutoff GROQ, countdown discreto, CTA flessibile, limit 5 + link `/calendario`), `StripPremi`, `CounterStrip` (Client, animazione rAF 1500ms ease-out-cubic + IntersectionObserver one-shot), `ImaginariumPreview` (palette inversa rifatta Hotfix 2), `RepertorioPreview` eliminato (sostituito da accordion), `SpettacoliAccordionHomepage` (Client, 2 col Prosa/Fuoco+strada, descrizioneBreve da Sanity, accordion `.accordion-body` max-height 500ms ease-out), `OfficinaTeaser`, `OspitaTeaser` (sostituito in homepage da CtaFinale, resta nel repo), `ContattiPrelude`, `PatrociniStrip` (Server, prop palette `dark|light`, filtra entries senza logo)
- **Scheda spettacolo:** `DescrizioneNarrativa`, `GalleriaFoto` (Client, `<dialog>` lightbox HTML), `TrailerVideo`, `SchedaTecnica`, `CastECrediti` (`combinaPersone(cast, regia)` → Map<nome, ruoli[]> dedup + ordine prima occorrenza), `CitazioniStampaList`, `SezionePrenotazione` (semplificata: solo descrizione + BigliettoSpettacolo), `BigliettoSpettacolo` (Client, flip 3D rotateY 800ms bouncy, FRONTE CTA → /contatti, RETRO tel cliccabile, accessibile), `TicketSpettacolo` (legacy, in repo), `SpettacoliCorrelati`
- **Decorativi semantici:** `TitoloDoppio`, `TitoloRitmico`, `Ticket` (cinema vintage, legacy 2.7), `CreditiLocandina`, `CitazioneStampa`, `CategoriaBadge`, `PremioBadge`
- **Pagine info:** `SezioneStoria` (media-text 50/50), `MembriCarosello` (Client, vanilla React no framer-motion, 3 slot desktop scale+blur, autoplay 5s, frecce + dots), `MembriGrid` (legacy), `PremiSezione` (statica, no link), `ScuolaMagiaBox` (40/60, CTA outlined target=_blank), `ContattiSezione` (icone lucide-react, min-h 280px, .reveal-stagger), `ProcessoIngaggio` (3 step + linea gradient md+), `TestimonianzeStrip`, `HannoIngaggiatoCaraval`, `CtaFinale` (variant `dark|accent`, default `accent`, prop `sottotitolo` + `fotoSfondo` opt), `LaboratoriScuoleSection`

### imaginarium/
`ProgrammaCompleto` (entrambe palette convergono a rosso pieno + crema, heading dinamico `Programma {anno}`), `SponsorPartnerStrip`, `EdizioniPassate` (bg rosso, card con bordo crema)

### decorative/
3 varianti A/B/C per `Stella5Punte`, `MascheraTeatrale`, `Fiamma`, `OndaDecorativa`, `Divider`, `CorniceDeco`. SVG inline `currentColor`. Showcase in `/design-system §12`.

### effects/
- `FadeInOnScroll` (legacy) → preferire `Reveal`
- `Reveal` (Client) — IntersectionObserver one-shot, prop `direction: "up"|"left"|"right"`, prop `as: "div"|"section"|"article"|"ul"|"ol"`, prop `delay?`, fallback sincrono via `getBoundingClientRect` se già in viewport al mount (risolve hydration edge case). CSS class `.reveal/.revealed` 900ms translateY 30px. Rispetta `prefers-reduced-motion`.
- **Stagger CSS-only:** selettore `.reveal-stagger.revealed > *` (self-applicato, NON nested). Container `<Reveal as="ul/div" className="reveal-stagger">` → figli ricevono fade+slide con `transition-delay` 0-700ms via `:nth-child`. Non rompe semantica `<ul><li>`.
- `RevealSipario`, `CustomCursor`, `ImmagineConOverlay`
- `HeroParallaxFoto` (Client) — speed 0.3, skip mobile/reduced-motion, rAF throttled, classe `.hero-foto-sfondo` con keyframe `subtle-zoom 20s alternate` scale 1→1.08
- `GlowSfondo` (Server) — radial-gradient class `.glow-sfondo` con `glow-pulse 8s alternate`. 5 posizioni · 3 intensità.

---

## 6. Theme system (sistemi adattivi)

### Architettura (`src/lib/theme-system.ts`)
`SectionTheme = "dark" | "light" | "accent"`.

`themeStyles[theme]` contiene:
- `bg` (background color)
- `cursorColor` (dot)
- `trailColor` (glow trail)
- `cursorGlow` (separato da trail, contrasto sfondo)
- `headerVariant` ("light"|"dark", quale logo+testi)
- `headerHoverColor` (CSS var `--header-hover` per hover voci nav)

### Valori correnti (Hotfix 1+)
- **dark:** bg `#0a0a0a`, cursor `#a8174a` rosso, glow rosso, header dark, hover `#c01d56`
- **light:** bg `#a8174a` rosso saturo (palette inversa), cursor `#0a0a0a` nero, glow nero, header dark (testo crema legge meglio su rosso), hover `#0a0a0a` nero
- **accent:** bg `#8b0e3a` rosso scuro (distacco da light), cursor nero, glow nero, header dark, hover nero

`bgVariant` (su `Section`):
- dark: base `#0a0a0a` / soft `#161616`
- light: base `#a8174a` / soft `#8a1340`

### Mappe di conversione
- `paletteToTheme[palette]` — per componenti con prop palette esistente (HeroPagina, CounterStrip, VideoYoutube, ProgrammaCompleto)
- `sectionBgToTheme[bg]` — per back-compat su `Section.background`
- `ctaVariantToTheme[variant]` — CtaFinale

Pattern: i componenti derivano automaticamente `data-theme` dalle prop esistenti. Nessuna nuova prop nei call-site.

### Detection
- **CustomCursor** (`src/components/effects/CustomCursor.tsx`):
  - Dot 8px + glow trail 24px (opacity 0.22 blur 5px) lerp 0.18 via rAF `transform: translate3d`
  - State `currentTheme`, `lastThemeRef` guard
  - `recomputeNow()` sincrono via `getBoundingClientRect` (cerca sezione che contiene il centro viewport), chiamato all'avvio + dopo setTimeout 50ms + su scroll throttled rAF
  - IntersectionObserver come trigger secondario
  - `MutationObserver` throttled rAF: ri-applica `cursor: none` su nuovi elementi interattivi (`a, button, [role=button], [onclick], input, textarea, select, iframe, video, [draggable]`). Eccezione text input per caret style.
  - Setta `data-custom-cursor="true"` sul `body`. CSS: con questo attr, `cursor: none !important` su tutti gli interattivi + `cursor: text !important` per text input.
  - Solo `(hover: hover) and (pointer: fine)` e non `prefers-reduced-motion`.
  - `transition: background-color 250ms ease-out` (mai su transform).

- **Header** (`src/components/layout/Header.tsx`):
  - Stessa logica `recomputeTheme()` sincrona via rect (sezione che contiene HEADER_HEIGHT)
  - `lastThemeRef` guard
  - `dark = variant === "dark" || scrolled || open` (su scroll/menu mobile aperto forza dark)
  - Logo cross-fade 2 `<img>` sovrapposti (`width=180, height=48`, `loading="eager"`, `fetchPriority="high"`)
  - `<link rel="preload" as="image">` per entrambi i loghi in `<head>` di `layout.tsx`
  - Scrim adattivo: nero `rgba(0,0,0,0.55)` su dark/accent, `rgba(0,0,0,0.35)` su light

### Lezioni apprese
1. **IntersectionObserver con `rootMargin -40%` non basta** — al primo paint può non sparare. Soluzione: sempre fallback sincrono via `getBoundingClientRect` nell'useEffect.
2. **Stagger nested NON funziona affidabilmente** — selettore `.reveal.revealed .reveal-stagger > *` fallisce per ordine eventi. Refactor a `.reveal-stagger.revealed > *` (self-applicato).
3. **`createOrReplace` cancella i campi non specificati** — risolto con `createOrReplacePreservingImages()` whitelist-based.
4. **MutationObserver throttled** — necessario per ri-applicare `cursor: none` quando il DOM cambia (route transitions, dialog aperti). Niente debounce, rAF.
5. **Logo cross-fade > swap con `key`** — niente flash, dimensioni fisse evitano layout shift.
6. **Theme `light.headerVariant = "dark"`** — su rosso saturo il testo crema legge meglio del nero.

---

## 7. Routes

- `/` — Server Component, fetch parallel 7+ GROQ, `revalidate=60`. Sipario preloader.
- `/spettacoli` — hero compatto + griglia filtrabile media-text alternato + sezione archivio anchor `#archivio`
- `/spettacoli/[slug]` — `generateStaticParams()` SSG, 9 sezioni dinamiche, `notFound()` su slug inesistente
- `/spettacoli/archivio` → redirect 301 a `/spettacoli#archivio` (`next.config.mjs`)
- `/imaginarium` — hub edizione corrente, hero dark, palette inversa rosso sul resto, scope `.theme-imaginarium`
- `/imaginarium/[anno]` — dinamica, `notFound()` se anno inesistente, "Programma in caricamento" se vuoto
- `/calendario` — Server, fetch eventi + spettacoli Imaginarium, raggruppamento per mese italiano, filtri client 4 voci
- `/formazione` — Server, corsi `statoCorso != "concluso"`, sezione laboratori scolastici
- `/chi-siamo` — hero compatto + storia + carosello membri + premi + Scuola di Magia + CTA finale
- `/contatti` — hero + indirizzo/P.IVA + 4 aree (Spettacolo B2B/Formazione/Fuoco/Generale) + social
- `/ospita` — hero CTA mailto + processo 3 step + testimonianze + ingaggiato + CTA finale rosso
- `/design-system` — showcase 15+ sezioni (noindex)
- `/studio` — Sanity Studio embedded
- `/demo` — playground query

24 rotte totali in build.

---

## 8. Convenzioni

### Naming
- **File componenti:** PascalCase (`SpettacoloCard.tsx`)
- **File utilities:** camelCase (`splitDisplay.ts`)
- **Schemi Sanity:** camelCase tecnico, label italiano in `title`
- **Slug URL:** kebab-case italiano (`/chi-siamo`, `/spettacoli/romeo-giulietta`)
- **Foto in `MATERIALE-PER-SITO/`:** `{slug}-orizzontale.jpg` (16:9 fotoHero) · `{slug}-verticale.jpg` o `{slug}-anteprima.jpg` (4:5 immagineCover) · `{pagina}-hero.jpg` · `hero-sito-generale.jpg` · `{slug-membro}.jpg` · `{compagnia}-imaginarium.jpg`

### Componenti React
- Server Components di default; `"use client"` solo dove serve interattività
- Tailwind inline; pattern ricorrenti → componenti
- Niente framer-motion (vanilla React + CSS transitions, risparmio ~150KB)

### Commit (Conventional)
`feat:` `fix:` `chore:` `docs:` `style:` `refactor:`

### Sanity content
- Tutti i campi user-facing in **italiano**
- Slug autogenerati dal titolo dove possibile
- Image alt **obbligatorio** se user-facing
- Validazioni condizionali via `validation.custom` con `ctx.document`

---

## 9. Deploy

### Workflow
1. Feature branch (`git checkout -b feat/nome`)
2. Push → Vercel Preview deploy automatico
3. Merge su `main` → production

### Env Vercel
- `NEXT_PUBLIC_SANITY_PROJECT_ID` · `NEXT_PUBLIC_SANITY_DATASET` · `NEXT_PUBLIC_SANITY_API_VERSION` (Production + Preview)
- `SANITY_API_WRITE_TOKEN` NON su Vercel — solo locale per seed

### Account
- GitHub: `CaravalSpettacoli` / `info@caraval.it`
- Sanity: `info@caraval.it` · Vercel: collegato a GitHub

---

## 10. Stato progetto (storia compatta)

### Completato
- **Sess.1** — Bootstrap Next.js + Sanity (8 schemi + Studio embedded + seed impostazioniSito + Vercel link)
- **Sess.2** — Design System completo (tokens Tailwind, palette, tipografia, UI base, layout, dominio, /design-system showcase)
- **Sess.2.5** — Polish DS (gradients, shadow poster, animation utilities, componenti decorativi, animazioni cinematografiche)
- **Sess.2.6** — Polish chirurgico (fix watermark Stonehead, splitDisplay, pulse 3 cicli, Sipario preloader, TicketBiglietto 3 stili A/B/C)
- **Sess.2.7** — Polish definitivo (Cinzel come display, Stonehead solo logo, Ticket unificato, Sipario rifatto, CustomCursor rifatto)
- **Sess.3** — Homepage + Hub Imaginarium (singleton + schemi premio/spettacolo estesi, seed demo content, /imaginarium + /[anno])
- **Sess.4** — Spettacoli (indice + scheda + archivio + TicketSpettacolo verticale, trailerYoutube + oggetto prenotazione, seed Romeo da brochure PDF, 8 archivio)
- **Sess.5** — Calendario + Formazione (schema evento riscritto, /calendario + /formazione, EventoCard nuovo, GiornataImaginariumCard palette inversa, CorsoCard)
- **Blocco 1** — Polish strutturale (HeroPagina unificato, CounterStrip riusabile + paginaImaginariumCopy, SpettacoliAccordionHomepage, /spettacoli con archivio integrato + redirect 301, spaziature CSS vars)
- **Blocco 2 / Sess.6** — Chi siamo + Contatti + Ospita (3 singleton nuovi, MembriGrid → MembriCarosello, ScuolaMagiaBox, ProcessoIngaggio + TestimonianzeStrip, Footer 4 col semantiche, Ospita su mobile menu)
- **Mini-blocco 2.5a** — Sistemi adattivi (theme-system.ts, IntersectionObserver cursore+header, derivazione `data-theme` automatica da prop esistenti)
- **Polish Definitivo** — Fix sistemi adattivi (recompute sincrono + rect), CtaFinale uniforme (9 pagine), accordion homepage allineato, /chi-siamo storia + iniziali Cinzel, /contatti social fallback URL ufficiali, schede spettacoli da caraval.it
- **Hotfix 1** — Palette Imaginarium rossa (themeStyles.light bg → rosso saturo, accent → rosso scuro), cursore con cursorGlow separato, MutationObserver, Header scrim adattivo + preload loghi, Counter animato rAF, descrizioneBreve in spettacoloImaginarium
- **Hotfix 2** — Polish completo (MembriCarosello, BigliettoSpettacolo flip 3D, PatrociniStrip, Reveal effect, HeroParallaxFoto, page transitions via template.tsx, schemi Sanity estesi con heroFotoSfondo su tutti i singleton, Imaginarium 2025 popolato)
- **Hotfix 3** — Pre-call Vera (Reveal con fallback sincrono, decorazioni `OndaDecorativa` estese, /spettacoli media-text alternato, heading dinamico programma, re-seed 2025, script import foto automatico 24/31 file)
- **Hotfix 4** — Polish post-call (animazioni stagger CSS-only nested, PatrociniStrip da homepage → /imaginarium con palette light box bianco, 10 descrizioniBreve homepage accordion, .cta-tertiary underline, /imaginarium hero dark, Header hover color per tema, hero subtle-zoom 20s, GlowSfondo, /chi-siamo fotoObjectPosition, card contatti min-h, biglietto polish)
- **Hotfix 5** — Stabilizzazione (fix `createOrReplacePreservingImages` per preservare foto, fix fotoHero query GROQ scheda spettacolo, stagger refactor self-applicato non più nested, patrocini Imaginarium 9 entries live)

### Da fare
- [ ] **Sess.7** — Iubenda + Umami analytics + accessibilità WCAG AA
- [ ] **Sess.8** — Popolamento contenuti reali completo + foto ottimizzate + go-live
- [ ] Privacy/cookie page · sitemap.xml · robots.txt

---

## 11. Foto/loghi pendenti per Edo

### Da caricare in Sanity Studio
- `homepageHero.fotoSfondo` ✓ caricata (verificare)
- `paginaChiSiamoCopy.heroFotoSfondo` + `storiaFotoSezione` + `scuolaMagiaFoto`
- `paginaContattiCopy.heroFotoSfondo`
- `paginaOspitaCopy.heroFotoSfondo`
- `paginaImaginariumCopy.heroFotoSfondo`
- `homepageCopy.formazioneHeroFotoSfondo` + `calendarioHeroFotoSfondo`
- `paginaChiSiamoCopy.scuolaMagiaUrl` (da chiedere a Vera)
- Foto 6 membri (Vera/Alessio/Nicola/Lorenzo/Marco/Ilaria) per carosello
- **Foto 6 doc `imag-2026-*` in `immagineCover`** (0/6 popolati al 2026-05-13)
- Foto schede 10 spettacoli attivi (campi `immagineCover` 4:5 + `fotoHero` 16:9)
- Foto archivio: 7 produzioni mancanti (Giovanna D'Arco, L'Inferno di Dante, I Folli di Notre Dame, Servitore di due padroni, Sogno di una notte di mezza estate, Ezzelino da Romano, Battute fuori scena)

### Cleanup
- Cancellare in Studio entries placeholder testuali duplicate in `homepageCopy.patrociniHomepage[]` (PatrociniStrip filtra già automaticamente entries senza logo, ma meglio pulire)

### Workflow alternativo
Aggiungere file in `MATERIALE-PER-SITO/FOTO PER SITO/` con naming `{slug}-verticale.jpg` (o `-orizzontale.jpg`, `-anteprima.jpg`, `{pagina}-hero.jpg`, ecc.) e ri-eseguire `npx tsx scripts/import-images-to-sanity.ts`.

---

## 12. Troubleshooting

- **`ChunkLoadError: Loading chunk app/layout failed`** → cache `.next` corrotta. `npm run clean && npm run dev`.
- **`npm run build` mentre dev è attivo** → corrompe la cache condivisa, dev server torna 500. Fermare uno dei due.
- **Font Stonehead mostra `@misterchek` watermark** → verifica `font-feature-settings` su `@font-face` E `.font-stonehead` in `globals.css`. Se persiste: whitelist lettere pulite + fallback Georgia per problematiche.
- **Testi dinamici Sanity in display** → sempre `splitDisplay(text)` (uppercase + spezza punteggiatura in Inter).
- **Sanity `createOrReplace` cancella foto** → usa `createOrReplacePreservingImages(doc)` con whitelist `PRESERVED_IMAGE_FIELDS` (vedi `seed-demo-content.ts`).
- **Cursore custom invisibile su sezione** → verifica che la sezione abbia `data-theme` (auto da Section o hardcoded). Vedi `theme-system.ts` mappe.
- **Animazione Reveal non parte** → controlla che il fallback sincrono via `getBoundingClientRect` sia nell'useEffect; per stagger usare `.reveal-stagger` self-applicato (NON nested in `.reveal`).
- **Chrome MCP screenshot economy** — cap retries a 3, fallback a verifica JS via curl + grep, fidarsi dei check visivi dell'utente.
