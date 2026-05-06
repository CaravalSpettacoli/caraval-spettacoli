# Prompt Chat 2 — Design System Caraval Spettacoli

> **Sessione 2:** costruzione del design system completo (token, tipografia, componenti base).  
> **Stato di partenza:** Sessione 1 completata, progetto Next.js + Sanity funzionante, repo GitHub e Vercel configurati.  
> **Da incollare in Claude Code** dopo aver navigato in `/Users/edoardobiondi/Desktop/SITO-CARAVAL/SITO/`.

---

# CONTESTO

Sei la stessa istanza AI che ha fatto il setup tecnico nella Sessione 1. Tutto il contesto di progetto è già nel file `CLAUDE.md` nella root — leggilo per primo per riprendere il filo.

Lavora in **modalità agentic** con auto-mode. Pianifica con Plan Mode, esegui in batch, commit frequenti, aggiorna CLAUDE.md alla fine.

# OBIETTIVO DELLA SESSIONE 2

Costruire il **design system completo** del sito Caraval Spettacoli: token, tipografia, componenti base. Niente pagine vere ancora (quelle arriveranno nelle sessioni 3+). Solo i mattoni.

Al termine voglio:

1. ✅ Token Tailwind finalizzati (colori, font, spacing, radius, shadow)
2. ✅ Tipografia completa: H1/H2/H3/H4/body/caption/label per desktop + mobile
3. ✅ Font Inter (Google Fonts) e MCF Stonehead Demo (locale) integrati
4. ✅ Componenti base in `src/components/ui/`: Button, Card, Container, Section
5. ✅ Componenti layout in `src/components/layout/`: Header, Footer, Hero (template)
6. ✅ Componenti dominio in `src/components/caraval/`: SpettacoloCard, EventoCard, PremioBadge, CategoriaBadge
7. ✅ Layout root (`src/app/layout.tsx`) con Header/Footer integrati
8. ✅ Pagina `/design-system` che mostra tutti i componenti come "showcase" per validare visivamente il sistema
9. ✅ Tutti i componenti rispettano accessibilità WCAG 2.2 AA (contrasti, focus state, semantica)
10. ✅ CLAUDE.md aggiornato con design tokens definitivi

# DESIGN PRINCIPLES

## Palette colori (ridefinita e ampliata)

Le 3 base sono già stabilite, ma servono **tonalità** per UI states (hover, disabled, ecc.).

```
NERO (sfondo dominante)
- nero-base: #0a0a0a
- nero-soft: #1a1a1a (per cards, sezioni leggermente sollevate)
- nero-deep: #050505 (per overlay molto scuri)

ROSSO CREMISI (accenti, CTA, etichette)
- rosso-base: #a8174a
- rosso-hover: #c01d56 (10% più chiaro)
- rosso-deep: #8e1240 (15% più scuro, per pressed states)
- rosso-muted: rgba(168, 23, 74, 0.1) (background sottile)

CREMA / AVORIO (testi, sfondi alternati)
- crema-base: #f5e6d3
- crema-bright: #faf0e1 (leggermente più chiaro per hover su testo)
- crema-muted: rgba(245, 230, 211, 0.7) (testo secondario)
- crema-faint: rgba(245, 230, 211, 0.4) (testo terziario / divider)
```

**Doppia identità (importante):**
- Sito principale Caraval: `nero-base` come body bg, `crema-base` come testo, `rosso-base` come accenti
- Sub-route Imaginarium (futuro): palette inversa, `crema-base` come bg dominante, `rosso-base` accenti

## Tipografia

```
DISPLAY (titoli decorativi, raro): MCF Stonehead Demo
BODY/UI (tutto il resto): Inter

SCALE TIPOGRAFICA — DESKTOP
- display-xl: 96px / 1.0 / -0.02em (hero homepage gigante)
- display-l: 72px / 1.05 / -0.02em (hero pagine spettacolo)
- display-m: 56px / 1.1 / -0.01em
- h1: 48px / 1.15 / -0.01em
- h2: 36px / 1.2 / -0.005em
- h3: 28px / 1.3 / 0
- h4: 22px / 1.4 / 0
- body-l: 18px / 1.6 / 0
- body: 16px / 1.6 / 0 (default)
- body-s: 14px / 1.5 / 0
- caption: 12px / 1.4 / 0.02em
- label: 12px / 1.2 / 0.1em uppercase (etichette categoria, "PROSA", "FUOCO")

SCALE TIPOGRAFICA — MOBILE
- display-xl: 56px
- display-l: 42px
- display-m: 36px
- h1: 32px
- h2: 26px
- h3: 22px
- h4: 18px
- body-l: 17px
- body: 16px
- body-s: 14px
- caption: 12px
- label: 12px
```

**Regole tipografiche:**
- Body text **mai sotto i 16px** (accessibilità)
- Display (Stonehead) usato **solo per titoli grandi** o branding, mai per body
- Inter usato per tutto il resto
- Label sempre **uppercase + tracking 0.1em**

## Spacing system

Token `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128`. In Tailwind sono già `1 / 2 / 3 / 4 / 5 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 32`.

**Regole:**
- Spaziatura interna componenti: 16-32px
- Spaziatura tra sezioni: 64-96px desktop, 48-64px mobile
- Container max-width: 1280px
- Padding orizzontale container: 16px mobile, 24px tablet, 32px desktop

## Border radius

```
- radius-sm: 4px (badge, label)
- radius-md: 8px (card, button)
- radius-lg: 12px (modal, image)
- radius-xl: 24px (hero blocks)
- radius-full: 9999px (chip, avatar)
```

## Shadows

Caraval ha estetica "cinematografica" — niente shadow gentili. Usa shadow drammatiche o nulla.

```
- shadow-sm: 0 2px 8px rgba(0,0,0,0.4)
- shadow-md: 0 8px 24px rgba(0,0,0,0.5)
- shadow-lg: 0 24px 64px rgba(0,0,0,0.6)
- shadow-glow-rosso: 0 0 32px rgba(168,23,74,0.3) (per hover su CTA)
```

## Transizioni

```
- transition-base: all 200ms ease-out (hover standard)
- transition-slow: all 400ms cubic-bezier(0.4, 0, 0.2, 1) (transizioni più cinematografiche)
- transition-fast: all 100ms ease-out (micro-interactions)
```

---

# COMPONENTI DA CREARE

Tutti in TypeScript, props tipizzate, con JSDoc comments brevi. Tutti accessibili (focus visible, semantica corretta, aria labels dove serve).

## Componenti UI Base (`src/components/ui/`)

### `Button.tsx`
Variants:
- `primary` (sfondo rosso, testo crema, hover glow)
- `secondary` (border crema, testo crema, hover fill crema con testo nero)
- `ghost` (no border, testo crema, hover sottolineato)
- `danger` (raro, sfondo rosso scuro)

Sizes: `sm` / `md` / `lg`

Stati: default, hover, active, disabled, loading (con spinner)

Accetta: `as` prop per renderizzare come `<a>` o `<Link>` Next.js, `children`, `icon` opzionale (left/right), eventuali altri props.

### `Card.tsx`
Card generica usata come base per altre card specifiche.
Variants: `default` (nero-soft bg), `bordered` (border crema sottile), `flat` (nessun bg)
Padding: `sm` / `md` / `lg`
Accetta children.

### `Container.tsx`
Wrapper con max-width 1280px e padding orizzontale responsive.
Variants: `narrow` (max 720px per testo lungo), `default` (1280), `wide` (1440 per gallery)

### `Section.tsx`
Wrapper di sezione con padding verticale standard (py-16 mobile, py-24 desktop).
Variants di background: `nero` (default), `nero-soft`, `crema` (per teaser Imaginarium futuro), `transparent`

## Componenti Layout (`src/components/layout/`)

### `Header.tsx`
- Logo Caraval a sinistra (link a `/`)
- Menu desktop a destra: Spettacoli, Imaginarium, Formazione, Chi siamo, Contatti
- Menu mobile: hamburger che apre overlay full-screen
- Sticky con effetto blur/transparente su scroll
- Tema scuro fisso (nero bg con crema text)
- Accessibile: keyboard navigation, focus visible

### `Footer.tsx`
3 colonne desktop, stack mobile:
- **Colonna 1 — Caraval**: dati associazione (presi da `impostazioniSito.datiAssociazione` via Sanity)
- **Colonna 2 — Sito**: link a Spettacoli, Imaginarium, Formazione, Chi siamo, Calendario, Ospita, Archivio
- **Colonna 3 — Contatti**: email + telefono (presi da `impostazioniSito.contattiPubblici`) + social icons

Riga inferiore: `© 2026 Caraval Spettacoli — Privacy — Cookie — Sito di Eddidesign`

I dati sono da Sanity ma usa fallback hardcoded se Sanity non risponde (per non rompere il build).

### `Hero.tsx` (componente template, non hero finale)
Componente template riutilizzabile per gli hero delle pagine. Props:
- `title` (string, usa Stonehead se `displayFont` true)
- `subtitle` (string opz.)
- `backgroundImage` (string opz., URL)
- `cta` (object opz.: { text, href })
- `height` (`sm` 60vh / `md` 80vh / `lg` 100vh)
- `displayFont` (bool, se usare Stonehead per il titolo)

## Componenti Dominio Caraval (`src/components/caraval/`)

### `SpettacoloCard.tsx`
Card per uno spettacolo (usata in indice spettacoli e correlati).
Props: `spettacolo` (tipo da Sanity)
Layout:
- Foto cover 16:9 in alto (con placeholder se assente)
- Etichetta categoria sopra (Prosa/Strada/Fuoco — usa CategoriaBadge)
- Titolo H4 sotto
- Sottotitolo body-s muted
- Anno + premi (se presenti, max 1 mostrato)
- Hover: leggero zoom sull'immagine + glow sul bordo

### `EventoCard.tsx`
Card per un evento del calendario.
Layout orizzontale:
- Data grande a sinistra (giorno + mese in colonna)
- Info a destra: titolo, città + struttura, modalità accesso
- CTA "Vai ai biglietti" se presente
- Categoria/tipo evento come label piccolo

### `PremioBadge.tsx`
Badge inline per i premi.
Props: `nome`, `anno`, `categoria` (opz.)
Stile: piccolo, bordo rosso, testo crema, font mono o uppercase

### `CategoriaBadge.tsx`
Badge per la categoria spettacolo.
Props: `categoria` ("prosa" | "strada" | "fuoco")
Stile: label uppercase tracciato, colore differente per categoria:
- prosa → rosso-base
- strada → crema (su nero) / nero (su crema)
- fuoco → rosso-deep

---

# LAYOUT ROOT

Aggiorna `src/app/layout.tsx` per integrare Header e Footer in modo che:
- Header sia sticky in cima a tutte le pagine
- Footer chiuda tutte le pagine
- Tra i due, lo `<main>` riceva i contenuti delle pagine
- Background `nero-base` di default, font Inter di base
- Smooth scroll attivo
- Lang `it`, charset utf-8, viewport ottimizzato

# PAGINA DESIGN SYSTEM

Crea `/src/app/design-system/page.tsx` come **showcase visiva** dei componenti. Una pagina lunga, ben organizzata in sezioni:

1. **Palette colori**: griglia con tutti i colori (nero, rosso, crema con tonalità) + codice hex
2. **Tipografia**: tutti i livelli (display-xl, display-l, ..., caption) con esempio testo + nome scala
3. **Spacing**: visualizzazione dei token spacing
4. **Buttons**: tutti i variants × tutti i size × tutti gli stati
5. **Cards**: variants + size
6. **Containers**: dimostrazione delle 3 width
7. **Sections**: variants di background
8. **Hero**: showcase del template Hero con vari config
9. **SpettacoloCard**: 3 card di esempio (una per categoria) con dati mock hardcoded
10. **EventoCard**: 3 card di esempio
11. **Badges**: PremioBadge + CategoriaBadge tutti i variants

Questa pagina è **solo per sviluppo/preview**. Non sarà raggiunge dal menu pubblico e va in `noindex`.

---

# ACCESSIBILITY

Tutti i componenti devono rispettare WCAG 2.2 AA:
- Contrasti: testo su sfondo ≥ 4.5:1 (controlla con strumenti tipo `getContrastRatio`)
- Focus state visibile su tutti gli elementi interattivi (outline rosso 2px + offset)
- Touch target ≥ 44×44px su mobile
- Alt text obbligatorio sulle immagini (usa prop `alt` required)
- Aria labels su icone senza testo
- Semantica HTML corretta: `<header>`, `<footer>`, `<main>`, `<nav>`, `<article>`, `<section>` dove appropriato
- Skip link "Salta al contenuto" prima dell'header

# RESPONSIVITÀ

Mobile-first. Breakpoints Tailwind di default:
- `sm` 640px
- `md` 768px
- `lg` 1024px
- `xl` 1280px
- `2xl` 1536px

Testa visivamente tutto il design system su:
- 360px (mobile small)
- 768px (tablet)
- 1280px (desktop)

# COSA NON FARE IN QUESTA SESSIONE

- ❌ NON creare pagine vere (homepage, scheda spettacolo, ecc.) — quelle arrivano in Sessione 3+
- ❌ NON popolare contenuti reali in Sanity
- ❌ NON modificare gli schemi Sanity (sono già definiti)
- ❌ NON installare librerie UI come shadcn, Radix, Headless UI — vogliamo controllo totale sui componenti, niente dipendenze pesanti
- ❌ NON usare immagini esterne placeholder (es. picsum) — usa div colorati con label per i placeholder

# WORKFLOW

1. **Plan Mode**: presenta piano dettagliato prima di partire
2. **Inizio**: leggi `CLAUDE.md` per riprendere il contesto
3. **Esegui in fasi**: tokens → tipografia → UI base → layout → dominio → showcase
4. **Commit frequenti** con messaggi semantici (`feat: add Button component with 4 variants`)
5. **Test visivi**: dopo ogni gruppo di componenti, verifica `localhost:3000/design-system`
6. **Build check**: alla fine, `npm run build` deve passare senza errori
7. **Aggiorna `CLAUDE.md`** con tutti i token + componenti creati
8. **Aggiorna lo stato progetto** in CLAUDE.md ("Sessione 2 completata")
9. **Push finale** su GitHub

# TEST FINALE

Quando hai finito, voglio poter:
1. Aprire `localhost:3000/design-system` e vedere TUTTO il sistema in una pagina
2. Aprire `localhost:3000` e vedere la homepage placeholder con il NUOVO header e footer
3. Verificare contrasti su almeno 3 combinazioni con axe DevTools
4. `npm run build` senza errori
5. Vedere la nuova pagina anche su Vercel preview deploy

# DOMANDE CHE PUOI FARMI

- Se hai dubbi su una scelta di stile (es. "il glow del bottone primary deve essere intenso o sottile?")
- Se vedi che un token nel brief è sbagliato e proponi una modifica
- Se trovi conflitti con CLAUDE.md o il setup esistente

Per il resto, decidi tu e procedi.

---

# PARTI

Mostra il piano dettagliato e poi vai in auto mode. Goal: avere un design system pronto da consumare nelle pagine vere della Sessione 3.
