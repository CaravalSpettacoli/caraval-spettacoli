# Sessione 2.7 — Polish Definitivo Design System Caraval

> **Per Claude Code in agentic mode.**
> Cartella di lavoro: `SITO/`
> Branch: nuovo branch `polish/sessione-2-7` da `main`
> Tempo atteso: **2-3 ore vere** (non 25 minuti)
> Verifica visiva OBBLIGATORIA via Chrome MCP per ogni task

---

## 0. Premessa — Perché questa sessione esiste

Le Sessioni 2.5 e 2.6 hanno fallito perché Claude Code ha eseguito troppo velocemente, dichiarato "fatto" senza verificare visivamente il risultato, e ha lasciato problemi gravi:

- Font Stonehead Demo che mostra glifi `@misterchek` su molte lettere maiuscole (vedi screenshot allegati nella chat)
- Ticket non convincenti in nessuna delle 3 varianti (clutter visivo, mobile sembra un quadrato)
- Sipario preloader che sembra "ante che si aprono" e non un tendaggio teatrale
- Cursore decorativo che si sovrappone al cursore standard del browser

**Questa sessione non è "altro polish". È la riparazione finale prima di passare alle pagine vere.**

**Regole di ingaggio:**
1. Ogni task ha **criteri di accettazione binari** (pass/fail). Se anche uno solo non è soddisfatto, il task NON è chiuso.
2. **Chrome MCP è obbligatorio**: dopo ogni implementazione, screenshot desktop + mobile, confronto con criteri, iterazione fino a pass.
3. **Niente nuovi componenti** oltre quelli specificati in questo prompt.
4. **Niente "potrebbe essere meglio così"** in autonomia: se hai un dubbio di design, chiedi prima di scrivere codice.

---

## 1. Setup Chrome MCP (PRIMA DI TUTTO)

### Task 0.A — Verifica/configura Chrome MCP

1. Controlla se Chrome MCP è già configurato nei file:
   - `.claude/settings.local.json` nella root del progetto
   - `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

2. Se NON è configurato, aggiungi questa configurazione al file Claude Desktop config:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

3. Riavvio Claude Desktop richiesto se modificato.

4. Verifica disponibilità tools MCP elencando le funzioni disponibili (es. `navigate_page`, `take_screenshot`, `list_pages`).

5. **Test smoke**: avvia `npm run dev`, attendi che il server sia attivo su `http://localhost:3000`, poi via Chrome MCP:
   - Apri `http://localhost:3000/design-system`
   - Fai screenshot full-page
   - Salva in `SITO/.screenshots/2.7-baseline.png`

### Criteri di accettazione Task 0.A
- [ ] Chrome MCP risponde a comandi base (navigate, screenshot)
- [ ] Screenshot baseline salvato in `.screenshots/2.7-baseline.png`
- [ ] La cartella `.screenshots/` è in `.gitignore`

**Se Chrome MCP non funziona dopo 15 minuti di setup, FERMATI e riporta a Edo. Non procedere ai task successivi senza Chrome MCP.**

---

## 2. Task A — Sostituzione font display

### Obiettivo
Rimuovere Stonehead Demo da tutti gli usi tranne il logo header. Affiancare 3 font Google Fonts candidati per permettere a Edo di scegliere visivamente.

### Implementazione

**A.1 — Mantieni Stonehead solo nel logo**

- File: `src/components/layout/Header.tsx`
- Solo il testo "Caraval Spettacoli" del logo deve usare `font-stonehead` (o classe equivalente)
- Rimuovi l'utility `font-display` da Stonehead nel resto del codebase

**A.2 — Carica 3 font Google candidati**

In `src/app/layout.tsx` (o dove gestisci i font Next.js), aggiungi via `next/font/google`:

```typescript
import { Cinzel_Decorative, Abril_Fatface, Bodoni_Moda } from 'next/font/google'

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

const abril = Abril_Fatface({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-abril',
  display: 'swap',
})

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-bodoni',
  display: 'swap',
})
```

Esponi le 3 variabili CSS sul `<html>` o `<body>`.

**A.3 — Aggiorna `tailwind.config.ts`**

```typescript
fontFamily: {
  // mantieni stonehead per il logo
  stonehead: ['var(--font-stonehead)', 'serif'],
  // 3 candidati per il display
  cinzel: ['var(--font-cinzel)', 'serif'],
  abril: ['var(--font-abril)', 'serif'],
  bodoni: ['var(--font-bodoni)', 'serif'],
  // di default font-display = cinzel (può essere cambiato dopo la scelta)
  display: ['var(--font-cinzel)', 'serif'],
  body: ['var(--font-inter)', 'sans-serif'],
}
```

**A.4 — Sezione di confronto in `/design-system`**

Aggiungi una nuova sezione **"2 — Tipografia (confronto font display)"** che mostra in 3 colonne identiche:

| Cinzel Decorative | Abril Fatface | Bodoni Moda |
|---|---|---|
| `ABCDEFGHIJKLMNOPQRSTUVWXYZ` |  |  |
| `abcdefghijklmnopqrstuvwxyz` |  |  |
| `0123456789 & ! ?` |  |  |
| Heading XL: "La Fine del Mondo" |  |  |
| Heading L: "Romeo + Giulietta" |  |  |
| Una compagnia. Tre anime. |  |  |

Sopra ogni colonna, un'etichetta chiara col nome del font.

### Criteri di accettazione Task A
- [ ] `font-stonehead` appare SOLO in `Header.tsx` per il logo (verifica con `grep -r "font-stonehead" src/`)
- [ ] I 3 font candidati renderizzano correttamente l'intero alfabeto + numeri senza glifi @misterchek o glifi rotti
- [ ] La sezione di confronto è visibile su `/design-system` con 3 colonne affiancate
- [ ] Screenshot Chrome MCP della sezione confronto salvato in `.screenshots/2.7-task-a-fonts.png`
- [ ] Build `npm run build` passa senza errori

---

## 3. Task B — Ticket riprogettato

### Obiettivo
Un solo ticket, pulito, con filigrana ondulata SVG di sfondo. Niente più 3 varianti, niente più clutter, niente più caratteri Stonehead nel ticket.

### Implementazione

**B.1 — Filigrana SVG**

Crea `src/components/caraval/ticket-watermark.svg.tsx` (componente che ritorna SVG inline):

```tsx
export function TicketWatermark() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 400 150"
      aria-hidden="true"
    >
      <defs>
        <pattern id="wave-pattern" x="0" y="0" width="80" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M0,10 Q20,0 40,10 T80,10"
            fill="none"
            stroke="var(--color-rosso-base)"
            strokeWidth="0.5"
            opacity="0.06"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wave-pattern)" />
    </svg>
  )
}
```

L'opacità totale visibile delle onde deve essere tra **0.05 e 0.08** (tara visivamente).

**B.2 — Componente Ticket unico**

Sostituisci le 3 varianti (Stile A, B, C) con un singolo componente `<Ticket>` in `src/components/caraval/Ticket.tsx`:

- Aspect ratio desktop: **larghezza piena della card / 100px circa**
- Aspect ratio mobile (< 640px): **mantenere 3:1** (es. 320px × 107px) — NON un quadrato
- Bordo: linea singola pulita in `var(--color-rosso-base)` 1.5px
- Angoli: leggermente squadrati (border-radius 4px max)
- Perforazione laterale sinistra: serie di puntini verticali (8 dots, ø 3px, gap 8px) in rosso
- Layout interno (left → right):
  - **Colonna stub sinistra** (~80px): scritta "INGRESSO" in Inter uppercase tracked, ruotata 90° antioraria, in rosso. Sopra una piccola stella ★ in rosso.
  - **Divider tratteggiato verticale** in rosso
  - **Colonna principale**: titolo spettacolo (font display scelto), riga sotto luogo · sala (Inter), riga sotto prezzo (Inter, rosso)
  - **Colonna destra** (~60px): mese in Inter uppercase grande (es. "LUG"), sotto numero biglietto piccolo "N° 5388" in Inter mono
- Il **TicketWatermark** è in posizione absolute, dietro tutto il contenuto, dentro il div root del ticket

**B.3 — Sostituzione in `/design-system`**

Nella sezione "10 — Eventi & Ticket", rimuovi le 3 varianti A/B/C. Mostra:
- 1 esempio desktop
- 1 esempio mobile (con classe `max-w-sm`)

**B.4 — Hover e click**

- Hover desktop: `translateY(-4px)` + shadow leggera (no rotazione, no glow)
- Click: animazione 300ms di "strappo" sulla colonna stub sinistra (translateX(-20px) + opacity 0), POI redirect al link

### Criteri di accettazione Task B
- [ ] Esiste UN SOLO componente `<Ticket>`, non 3 varianti
- [ ] Filigrana SVG ondulata visibile in background, opacità misurata tra 0.05 e 0.08
- [ ] Zero glifi `@misterchek` o decorazioni Stonehead nel ticket (verifica visiva)
- [ ] Su mobile (< 640px) il ticket mantiene aspect ratio 3:1 con perforazione laterale visibile
- [ ] Screenshot desktop in `.screenshots/2.7-task-b-ticket-desktop.png`
- [ ] Screenshot mobile (viewport 375px) in `.screenshots/2.7-task-b-ticket-mobile.png`
- [ ] Hover funziona, click anima lo strappo

---

## 4. Task C — Sipario teatrale vero

### Obiettivo
Trasformare il preloader da "ante meccaniche" a "tendaggi teatrali in velluto". Movimento più cinematografico, drappeggio visibile, testo persistente più a lungo.

### Implementazione

**C.1 — File**: `src/components/caraval/CurtainPreloader.tsx`

**C.2 — Struttura**

Due `<div>` (sinistro e destro) che partono al 50% di larghezza ciascuno e si aprono lateralmente. Ogni pannello:

- Background: gradient verticale che simula velluto
  ```css
  background:
    linear-gradient(90deg,
      rgba(0,0,0,0.4) 0%,
      transparent 4%,
      transparent 8%,
      rgba(0,0,0,0.3) 12%,
      transparent 16%,
      /* ... ripeti pattern per simulare pieghe verticali */
    ),
    linear-gradient(180deg, #1a0010, var(--color-rosso-base) 50%, #1a0010);
  ```
  In alternativa SVG con striature verticali a opacità variabile.

- **Bordo interno ondulato (drappeggio)**: il bordo verso il centro NON è dritto. Usa `clip-path` con curva o SVG path:
  ```css
  clip-path: path('M0,0 L100%,0 Q95%,50% 100%,100% L0,100% Z');
  ```
  Il pannello sinistro ha la curva sul bordo destro, il destro l'opposto.

- Ombra interna verso il centro per dare profondità di drappeggio:
  ```css
  box-shadow: inset -20px 0 40px rgba(0,0,0,0.5);
  ```

**C.3 — Animazione**

```typescript
// Sequenza temporale:
// 0ms      → entrambi i pannelli al 50% chiusi, testo visibile
// 0-1500ms → testo "Pronti a entrare in scena?" resta visibile
// 1500ms   → fade out testo (400ms)
// 1900ms   → inizio apertura tendaggi
// 1900-4400ms → apertura completa (2500ms)
// Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

```css
.curtain-left {
  transition: transform 2500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.curtain-left.open {
  transform: translateX(-100%);
}
```

**C.4 — Testo centrale**

- Font: il display scelto (per ora Cinzel di default)
- Colore: `var(--color-crema)`
- Size: 2.5rem desktop / 1.75rem mobile
- Testo: "Pronti a entrare in scena?"
- Posizione: centrato assoluto nel viewport
- Fade in 600ms al mount, persistenza 1500ms, fade out 400ms

**C.5 — Prop opzionale `withSound`**

```typescript
interface CurtainPreloaderProps {
  withSound?: boolean // default false, predisposto per audio futuro
  onComplete?: () => void
}
```

Se `withSound` è true, predisponi un `<audio>` nascosto con `src="/sounds/curtain.mp3"` (file non presente, ma il riferimento sì). Non riprodurre nulla finché il file non viene caricato in pubblico.

**C.6 — prefers-reduced-motion**

Se l'utente ha `prefers-reduced-motion: reduce`, il preloader fa fade-out semplice di 400ms senza il movimento dei tendaggi.

### Criteri di accettazione Task C
- [ ] Apertura tendaggi dura 2500ms (verifica con Chrome MCP `performance.now()` o video)
- [ ] Bordo interno dei pannelli è ondulato/curvo, NON dritto (verifica visiva)
- [ ] Texture verticale di velluto visibile sui pannelli
- [ ] Testo persiste 1500ms prima di iniziare il fade
- [ ] Screenshot della fase iniziale in `.screenshots/2.7-task-c-curtain-closed.png`
- [ ] Screenshot della fase a metà apertura in `.screenshots/2.7-task-c-curtain-mid.png`
- [ ] Screenshot della fase finale in `.screenshots/2.7-task-c-curtain-open.png`
- [ ] Con `prefers-reduced-motion`, comportamento fallback fade è attivo

---

## 5. Task D — Cursore decorativo

### Obiettivo
Solo un punto rosso che segue il mouse. Niente cursore di sistema sopra.

### Implementazione

**D.1 — File**: `src/components/ui/CustomCursor.tsx` (client component)

```tsx
'use client'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [clicking, setClicking] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Solo desktop con hover e pointer fine
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mq.matches || reduced.matches) return

    setEnabled(true)
    document.body.style.cursor = 'none'

    const move = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
    const down = () => setClicking(true)
    const up = () => setClicking(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999] rounded-full"
      style={{
        width: 8,
        height: 8,
        background: 'var(--color-rosso-base)',
        left: position.x - 4,
        top: position.y - 4,
        transform: clicking ? 'scale(1.5)' : 'scale(1)',
        transition: 'transform 150ms ease-out, left 80ms ease-out, top 80ms ease-out',
      }}
    />
  )
}
```

**D.2 — Montaggio**

Aggiungi `<CustomCursor />` in `src/app/layout.tsx` dentro `<body>`, fuori dal `<main>`.

**D.3 — CSS globale**

In `src/app/globals.css`:

```css
@media (hover: hover) and (pointer: fine) {
  body:not([data-reduced-motion="true"]) {
    cursor: none;
  }
  body:not([data-reduced-motion="true"]) a,
  body:not([data-reduced-motion="true"]) button {
    cursor: none;
  }
}
```

Anche tutti gli elementi interattivi devono avere `cursor: none`, altrimenti il cursore standard riappare hovering link e bottoni.

### Criteri di accettazione Task D
- [ ] Sul desktop NON appare mai il cursore standard del sistema (verifica via screenshot Chrome MCP)
- [ ] Solo il punto rosso ø 8px è visibile
- [ ] Il cursore standard riappare hovering form input (input/textarea/select) — questo è OK e voluto per UX
- [ ] Su touch device il cursore custom è disabilitato
- [ ] Con `prefers-reduced-motion: reduce`, il cursore custom è disabilitato e torna quello standard
- [ ] Screenshot in `.screenshots/2.7-task-d-cursor.png` mostra il punto rosso senza freccia sovrapposta

---

## 6. Workflow Chrome MCP per ogni task

Per ogni task A, B, C, D — DOPO aver scritto il codice:

1. `npm run dev` (se non già attivo)
2. Via Chrome MCP:
   - `navigate` a `http://localhost:3000/design-system`
   - `take_screenshot` full-page in `.screenshots/2.7-task-X-result.png`
   - Resize viewport a 375px per mobile, screenshot in `.screenshots/2.7-task-X-mobile.png`
3. Confronta screenshot con criteri di accettazione del task
4. Se anche UN solo criterio fallisce → itera, NON marcare come done
5. Solo quando TUTTI i criteri passano → commit con messaggio chiaro:
   ```
   feat(design-system): task A - 3 candidate display fonts
   feat(design-system): task B - clean ticket with watermark
   feat(design-system): task C - theatrical curtain preloader
   feat(design-system): task D - custom decorative cursor
   ```

---

## 7. Chiusura sessione

Al termine di tutti i task:

1. Aggiorna `CLAUDE.md` nella root con:
   - Stato Sessione 2.7: completata
   - Decisione font display: **da prendere con Edo** dopo aver visto le 3 colonne live
   - Lista screenshot generati in `.screenshots/`
2. Push del branch `polish/sessione-2-7` su GitHub
3. Apri PR su GitHub con titolo: `Polish 2.7 — Definitivo (font + ticket + sipario + cursore)`
4. Body della PR: incolla i 4 screenshot principali (uno per task)
5. Riporta a Edo nel terminale:
   - Tempo impiegato totale
   - Lista task completati con check ✅
   - Eventuali punti dove hai dovuto fare scelte autonome (con motivazione)
   - Link al deploy preview Vercel

---

## 8. Cosa NON fare

- ❌ Non aggiungere altri micro-fix non richiesti ("già che c'ero ho aggiustato anche...")
- ❌ Non chiudere un task senza screenshot Chrome MCP
- ❌ Non scegliere tu il font display tra i 3 — quella scelta è di Edo
- ❌ Non riportare "fatto" se anche un solo criterio di accettazione è incerto
- ❌ Non superare le 3 ore senza fermarti e chiedere a Edo

---

## 9. Quando hai dubbi

Se durante l'esecuzione trovi qualcosa di ambiguo o incoerente con il design system esistente, **fermati e chiedi a Edo** invece di decidere in autonomia. Esempi di domande legittime:

- "Il bordo del ticket lo voglio 1px o 1.5px? Il design system attuale usa 1px ovunque."
- "La filigrana funziona meglio con onde orizzontali o verticali?"
- "Su mobile il sipario fa effetto strano per via del viewport piccolo, vuoi che lo skippi sotto 640px?"

Meglio una domanda in più che una sessione 2.8.

---

**Buon lavoro.**
