# Polish Definitivo Caraval — Mega-blocco unificato

> **Per Claude Code in agentic mode.**
> Cartella di lavoro: `SITO/`
> Branch: nuovo branch `feat/polish-definitivo` da `main` aggiornato (post merge PR #8)
> Tempo atteso: 6-9 ore di lavoro intenso

**Riferimenti obbligatori (leggi nell'ordine PRIMA di iniziare):**
1. `CLAUDE.md`
2. `MATERIALE-PER-SITO/Caraval_DesignBrief.md`
3. `COPY_HOMEPAGE.md`

**Regole non negoziabili:**
- Tutto Sanity-driven, niente testo hardcoded
- Niente "miglioramenti spontanei" oltre i task elencati
- Anti-loop Chrome MCP: max 2 retry per screenshot, poi annota e procedi
- Niente merge automatico, attendi review Edo

---

## PREMESSA STRATEGICA

Questo prompt sostituisce i mini-blocchi 2.5a/b/c che avevamo programmato. Risolve tutti i feedback Edo raccolti il pomeriggio della domenica:

1. Cursore custom non adattivo (errori già diagnosticati nel 2.5a)
2. Header non adattivo (errori già diagnosticati)
3. Palette del sito da uniformare (tutto scuro + Imaginarium invertito)
4. Ritmo sezioni assente (alternanza dark/dark-soft, accent solo CTA)
5. CTA finali ogni pagina la sua → componente unico
6. Accordion homepage non allineato
7. Card formazione senza CTA "Contattaci"
8. Card membri /chi-siamo da arricchire (NO cliccabili per ora)
9. Pagina /contatti scarna → arricchire con social + numero + info mancanti
10. Pagina /chi-siamo con solo 2 membri → tutti 6 + alternanza media-text
11. Spettacoli senza descrizioni → import da sito attuale per gli spettacoli corrispondenti
12. Bio Caraval mancante → import da sito attuale per /chi-siamo
13. Footer da rifinire definitivamente
14. Social Caraval (Facebook + Instagram + YouTube) → footer + sezione dedicata /contatti

---

## TASK 1 — Fix sistemi adattivi (cursore + header)

**Stato attuale:** già implementati in PR #8 ma con bug residui (cambiamenti "ogni tanto" non coerenti col background).

**Diagnosi causa root nota:**
- React App Router non rimonta layout al client-side navigation (già fixato con usePathname)
- Possibile bug residuo: la mappa `sectionBgToTheme` derivata dal background del componente Section può non corrispondere al colore visivo reale
- Possibile race condition tra primo paint e setTimeout 50ms

### 1.1 Diagnosi prima di fixare

Prima di toccare codice, fai diagnosi runtime (NON statica). Step:

1. Aggiungi log temporanei in `CustomCursor.tsx` dentro IntersectionObserver callback:
```typescript
console.log('[CustomCursor] section change:', {
  theme: mostVisible.target.getAttribute('data-theme'),
  bg: window.getComputedStyle(mostVisible.target).backgroundColor,
  ratio: mostVisible.intersectionRatio,
  pathname
})
```

2. Stessa cosa in `Header.tsx`.

3. Avvia dev server, naviga /imaginarium, scrolla lentamente. Osserva la console.

4. **Verifica empiricamente:**
   - Il theme nei log corrisponde al background **visivo** della sezione?
   - L'observer scatta al momento giusto (sezione attiva al centro viewport)?
   - C'è "ping-pong" tra theme (cursore che oscilla)?

### 1.2 Fix mirati basati su diagnosi

In base a quello che vedi, applica UNO dei seguenti fix:

**Fix A — Se il `data-theme` non corrisponde al colore visivo:**
Probabile causa: il componente `Section.tsx` deriva il theme dal background prop, ma alcuni component (es. Hero, CTA) usano sfondo inline o gradient, non rilevati. Soluzione: invece di derivare automaticamente dal background, **forza il theme esplicitamente** dove c'è discrepanza. Per le sezioni Hero/CTA: passa `theme` come prop esplicita dal call-site.

**Fix B — Se l'observer scatta sulle sezioni sbagliate:**
Probabile causa: il rootMargin -40% non funziona bene su viewport piccoli (mobile) o sezioni alte. Soluzione: cambia da `rootMargin` a osservare quale sezione contiene il **centro del viewport**:

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    const viewportCenter = window.innerHeight / 2
    for (const entry of entries) {
      const rect = entry.target.getBoundingClientRect()
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        const theme = entry.target.getAttribute('data-theme') as SectionTheme
        if (theme) setCurrentTheme(theme)
        return
      }
    }
  },
  { threshold: [0, 0.1, 0.5, 0.9, 1] }
)
```

**Fix C — Se c'è ping-pong/flickering:**
Aggiungi debounce sul setState:
```typescript
let lastTheme: SectionTheme | null = null
// dentro callback
if (theme !== lastTheme) {
  lastTheme = theme
  setCurrentTheme(theme)
}
```

### 1.3 Rimuovi log dopo verifica

Dopo che cursore+header funzionano CORRETTAMENTE in tutti i casi (vedi test plan finale), rimuovi tutti i `console.log` temporanei. Grep finale:
```bash
grep -rn "console.log" src/components/effects/ src/components/layout/
```
Risultato atteso: zero match (escluso eventuali log legittimi pre-esistenti).

---

## TASK 2 — Palette sito uniformata (tutto scuro + Imaginarium invertito)

### 2.1 Definizione palette globale

In `src/lib/theme-system.ts` (già esistente da 2.5a), conferma/aggiorna:

```typescript
export const themeStyles = {
  dark: {
    bg: '#0a0a0a',           // nero pieno (default sito)
    bgSoft: '#161616',        // nero soft (per alternanza ritmo intra-pagina)
    text: '#f5e6d3',          // crema
    textMuted: 'rgba(245, 230, 211, 0.7)',
    accent: '#a8174a',        // cremisi (accenti, CTA, hover)
    cursorColor: '#f5e6d3',
    headerVariant: 'dark'
  },
  light: {
    bg: '#f5e6d3',            // crema (solo Imaginarium hero/programma/sponsor)
    bgSoft: '#ebd9c0',
    text: '#5c0d2a',          // rosso scuro come testo principale (palette inversa)
    textMuted: 'rgba(92, 13, 42, 0.75)',
    accent: '#a8174a',        // cremisi accenti
    cursorColor: '#5c0d2a',
    headerVariant: 'light'
  },
  accent: {
    bg: '#a8174a',            // cremisi pieno (solo CTA finali)
    bgSoft: '#8a1340',
    text: '#f5e6d3',
    textMuted: 'rgba(245, 230, 211, 0.85)',
    accent: '#f5e6d3',
    cursorColor: '#f5e6d3',
    headerVariant: 'dark'     // header dark anche su accent (testo chiaro contrasta)
  }
}
```

### 2.2 Mappa sezioni → theme per ogni pagina

**Homepage `/`:**
1. Hero → `dark` (foto sfondo + overlay nero gradient + testi crema)
2. Strip premi → `dark` con bg `#0a0a0a`
3. Counter "I numeri" → `dark` ma con bg `#161616` (alternanza intra-pagina)
4. Imaginarium preview → `light` (palette inversa)
5. Spettacoli accordion → `dark` con bg `#0a0a0a`
6. Officina teaser → `dark` con bg `#161616` (alternanza)
7. CTA "Sei un Comune" → `accent` (rosso pieno)
8. Restiamo in contatto → `dark` con bg `#0a0a0a`
9. Footer → `dark` con bg `#161616`

**Pagina `/spettacoli`:**
1. Hero → `dark`
2. Filtri → `dark` bg `#0a0a0a`
3. Grid Produzioni in repertorio → `dark` bg `#161616`
4. Grid Archivio (sezione `#archivio`) → `dark` bg `#0a0a0a`
5. CTA finale → `accent`

**Pagina `/spettacoli/[slug]`:**
1. Hero spettacolo → `dark`
2. Descrizione narrativa → `dark` bg `#0a0a0a`
3. Scheda tecnica → `dark` bg `#161616`
4. Cast e crediti → `dark` bg `#0a0a0a`
5. Galleria foto → `dark` bg `#161616`
6. Citazioni stampa → `dark` bg `#0a0a0a`
7. Spettacoli correlati → `dark` bg `#161616`
8. Ticket prenotazione → resta come ora (debito tecnico noto)
9. CTA finale → `accent`

**Pagina `/imaginarium`:**
1. Hero (logo IMAGINARIUM grande) → `light`
2. Counter Imaginarium → `light` bg `bgSoft` (#ebd9c0) per alternanza
3. Video YouTube → `light`
4. Programma 6 spettacoli → `light` bg `#f5e6d3`
5. Sponsor strip → `light` bg `#ebd9c0`
6. Edizioni passate → `light`
7. CTA finale → `accent`

**Pagina `/calendario`:**
1. Hero → `dark`
2. Filtri → `dark`
3. Lista cronologica → `dark` bg `#161616`
4. CTA finale → `accent`

**Pagina `/formazione`:**
1. Hero → `dark`
2. Sezione corsi → `dark` bg `#161616`
3. Sezione laboratori scuole → `dark` bg `#0a0a0a`
4. CTA finale → `accent`

**Pagina `/chi-siamo`:**
1. Hero → `dark`
2. Sezione Storia → `dark` bg `#161616`
3. Sezione Membri → `dark` bg `#0a0a0a`
4. Premi → `dark` bg `#161616`
5. Box Scuola di Magia → `light` (eccezione per spezzare il ritmo)
6. CTA finale → `accent`

**Pagina `/contatti`:**
1. Hero → `dark`
2. Sezione "Dove siamo" → `dark` bg `#161616`
3. Sezione 4 aree contatto → `dark` bg `#0a0a0a`
4. Sezione social (NUOVA) → `dark` bg `#161616`
5. CTA finale → `accent`

**Pagina `/ospita`:**
1. Hero → `dark`
2. Valore proposto → `dark` bg `#161616`
3. Processo ingaggio → `dark` bg `#0a0a0a`
4. Testimonianze → `dark` bg `#161616`
5. Hanno ingaggiato → `dark` bg `#0a0a0a`
6. CTA finale → `accent`

### 2.3 Refactor componente Section

In `src/components/ui/Section.tsx`:

- Aggiungi prop esplicita `theme: 'dark' | 'light' | 'accent'` (override del derivato automatico)
- Aggiungi prop `bgVariant: 'base' | 'soft'` per alternanza intra-pagina
- Il `data-theme` viene calcolato:
  - Se prop `theme` esplicita → usa quella
  - Altrimenti → deriva da background come oggi
- Background applicato:
  - `theme=dark, bgVariant=base` → `bg-[#0a0a0a]`
  - `theme=dark, bgVariant=soft` → `bg-[#161616]`
  - `theme=light, bgVariant=base` → `bg-[#f5e6d3]`
  - `theme=light, bgVariant=soft` → `bg-[#ebd9c0]`
  - `theme=accent` → `bg-[#a8174a]` (sempre, no varianti)

### 2.4 Applicazione su tutte le pagine

Per ogni pagina, applica le mappature dichiarate al punto 2.2.

Niente alternanza automatica complicata: ogni sezione dichiara esplicitamente `theme` e `bgVariant`.

---

## TASK 3 — Componente CTA finale uniforme

### 3.1 Creazione `CtaFinale.tsx`

Esiste già da Blocco 2 ma probabilmente con varianti. Refactor per renderlo davvero uniforme.

```typescript
interface CtaFinaleProps {
  eyebrow?: string                        // opzionale, default null
  heading: string                          // titolo principale Cinzel
  sottotitolo?: string                     // 1-2 righe Inter
  ctaPrimaria: { label: string, href: string, esterno?: boolean }
  ctaSecondaria?: { label: string, href: string, esterno?: boolean }
  variant?: 'dark' | 'accent'              // accent = rosso pieno, dark = nero con accenti rossi
  fotoSfondo?: SanityImage                 // opzionale, foto come background con overlay
}
```

### 3.2 Layout

**Variant `dark` (default):**
- Sfondo: nero `#0a0a0a` o foto sfondo con overlay nero opacity 0.7
- Eyebrow (se presente): Cinzel uppercase tracked, color cremisi
- Heading: Cinzel Decorative grande, color crema
- Sottotitolo: Inter, color crema opacity 0.85
- CTA primaria: bottone rosso `#a8174a` pieno, hover lift
- CTA secondaria: link testuale crema con freccia
- Padding verticale generoso (--space-section-y)

**Variant `accent`:**
- Sfondo: rosso `#a8174a` pieno (con eventuale striscia ondulata SVG decorativa già esistente)
- Heading: Cinzel Decorative grande, color crema
- Sottotitolo: Inter, color crema opacity 0.9
- CTA primaria: bottone crema `#f5e6d3` pieno con testo rosso scuro, hover lift
- CTA secondaria: link testuale crema con freccia bianca

### 3.3 Applicazione su tutte le pagine

Sostituisci tutte le CTA finali esistenti (homepage, /spettacoli, /imaginarium, /calendario, /formazione, /chi-siamo, /contatti, /ospita) con il nuovo `<CtaFinale>` uniforme.

**Mappa contenuti per pagina:**

| Pagina | Variant | Heading | Sottotitolo | CTA Primaria | CTA Secondaria |
|---|---|---|---|---|---|
| `/` | accent | "Sei un Comune, una Pro Loco o una dimora storica?" | "Caraval può portare uno spettacolo da te." | "Scopri come ingaggiarci" → /ospita | — |
| `/spettacoli` | accent | "Ti interessa uno dei nostri spettacoli?" | "Contattaci per parlarne." | "Contattaci" → /contatti | "Vedi tutti gli spettacoli" → ancora nella stessa pagina (rimuovi se ridondante) |
| `/spettacoli/[slug]` | accent | "Vuoi portare questo spettacolo da te?" | "Caraval può venire ovunque." | "Scrivici" → mailto | "Vedi altri spettacoli" → /spettacoli |
| `/imaginarium` | accent | "Imaginarium è un progetto della comunità." | "Ti aspettiamo dal 4 al 18 giugno 2026." | "Vedi il programma" → ancora #programma | "Scopri Caraval" → / |
| `/calendario` | accent | "Sei un Comune, una Pro Loco o una dimora storica?" | "Caraval può portare uno spettacolo da te." | "Scopri come ingaggiarci" → /ospita | — |
| `/formazione` | accent | "Vuoi iscriverti all'Officina Teatrale?" | "Chiama Vera per informazioni." | "Chiama Vera" → tel:+39 348 9143189 | "Scrivici" → mailto |
| `/chi-siamo` | accent | "Vuoi conoscerci meglio?" | "Spettacoli, formazione, eventi: parliamoci." | "Vedi i nostri spettacoli" → /spettacoli | "Contattaci" → /contatti |
| `/contatti` | accent | "Pronto a iniziare?" | "Scrivici. Ti rispondiamo entro 24 ore." | "Manda una mail" → mailto | "Chiama" → tel |
| `/ospita` | accent | "Pronto a portare Caraval da te?" | "Vera o Nicola ti rispondono entro 24 ore con una proposta su misura." | "Scrivici" → mailto:caravalspettacoli@gmail.com?subject=Richiesta ingaggio | — |

Tutti i testi vanno in singleton Sanity rispettivi (homepageCopy, paginaSpettacoliCopy, ecc) con default come tabella sopra.

---

## TASK 4 — Accordion homepage allineato

In `SpettacoliAccordionHomepage.tsx` (esistente):

**Problema attuale:** le voci accordion delle 2 colonne hanno altezze diverse perché i titoli vanno su 1 o 2 righe.

**Fix:**
- Imposta `min-height` fissa sulla voce header dell'accordion (es. `min-height: 5rem` desktop, `4rem` mobile)
- Allinea verticalmente il titolo al centro con `display: flex; align-items: center;`
- Le frecce/+ a destra restano sempre allineate sul lato destro con `margin-left: auto`

Risultato atteso: tutte e 8 le voci accordion hanno la stessa altezza visiva, sia che il titolo stia su 1 o 2 righe. Le colonne sono perfettamente parallele.

---

## TASK 5 — Card formazione con CTA "Contattaci"

In `CorsoCard.tsx`:

Sotto i recapiti referente, aggiungi una CTA testuale:
- Label: "Contattaci per informazioni" oppure "Iscriviti al corso"
- Link: `/contatti?corso={slug-corso}` (così la pagina contatti può eventualmente pre-popolare il subject email)
- Stile: stesso pattern delle CTA secondarie del sito (link testuale con freccia → )

Aggiungi al singleton `homepageCopy` (o `paginaFormazioneCopy` se esiste):
- `corsoCardCtaLabel` (default: "Contattaci per informazioni")

---

## TASK 6 — Pagina /chi-siamo arricchita

### 6.1 Tutti i 6 membri visibili

Verifica che il seed contenga tutti i 6 membri (Vera, Alessio, Nicola, Lorenzo, Marco, Ilaria). Se mancano, aggiungi via seed con i dati definiti nel Blocco 2.

Verifica che la query GROQ in `/chi-siamo` faccia fetch di TUTTI i membri attivi, non solo Vera e Nicola:
```typescript
const membri = await client.fetch(`*[_type == "membro"] | order(ordineDisplay asc) {
  ...
}`)
```

### 6.2 Alternanza media-text per i membri

Per dare ritmo visivo alla sezione membri:
- Layout su 2 colonne desktop, 1 colonna mobile
- Card alternate: prima a sinistra, seconda a destra, terza a sinistra, ecc.
- Ogni card ha: foto (placeholder grafico se manca, NON icona generica), nome Cinzel, ruoli, bio breve

**Placeholder grafico** se manca foto: rettangolo con sfondo cremisi muted `rgba(168, 23, 74, 0.15)` + iniziali del membro in Cinzel grande al centro (es. "VR" per Vera Rossini). NO icone generiche bambino/laurea/ecc.

### 6.3 Sezione Storia con bio importata da caraval.it

Estendi `paginaChiSiamoCopy.storiaBody` (richText o blockContent se possibile, altrimenti text lungo) con il contenuto importato dal sito attuale. **Solo questo testo, niente aggiunte tue:**

```
Caraval Spettacoli è una compagnia teatrale che vanta tra le sue fila attori esperti, giocolieri e scenografi in grado di realizzare spettacoli di successo. Dal 2016 portiamo sul palco diverse storie e personaggi, passando dalla commedia dell'arte al teatro di prosa fino a quello più sperimentale, senza mai dimenticare l'arte di strada che è dove affondano le nostre radici.

Mettiamo in scena sia i testi di grandi autori teatrali che copioni nuovi scritti da noi, per il teatro ma non solo. Infatti, abbiamo partecipato a festival e feste locali in cui i committenti ci hanno chiesto di scrivere uno spettacolo ad hoc, che parlasse di una tematica particolare o rappresentasse un evento storico importante per il luogo.

Il teatro non è quindi l'unico spazio in cui operiamo: piazze, dimore storiche e castelli sono spesso cornici delle nostre performance. Curiamo ogni dettaglio occupandoci anche della scenografia e dei costumi, creati su misura per ogni spettacolo, così da rendere qualsiasi location il palcoscenico perfetto.

Da diversi anni partecipiamo al Carnevale di Venezia, portando per le calle della città costumi realizzati interamente da noi e figure fantastiche frutto della nostra creatività.

#inviaggioconcaraval è il nostro hashtag ufficiale, perché amiamo viaggiare sia sulla strada che sulle ali della fantasia.
```

**Nota importante:** il sito attuale dice "Dal 2016" ma la memoria a noi disponibile dice "dal 2020". Lascia il testo come da sito attuale (2016) perché è la versione approvata da Vera. Edo verificherà con Vera in seguito.

### 6.4 Foto storia placeholder

Per la sezione Storia, usa come foto placeholder: link assoluto a `https://www.caraval.it/wp-content/uploads/2023/10/IMG_1897-scaled.jpeg` se il fetch è permesso, altrimenti placeholder grafico Caraval logo low opacity su sfondo nero.

In Sanity Studio, Vera potrà sostituirla con foto interna.

---

## TASK 7 — Pagina /contatti arricchita

### 7.1 Aggiungi sezione "Seguici sui social"

Nuova sezione tra le 4 aree contatto e CTA finale:
- Eyebrow: "SUI SOCIAL"
- Heading: "Seguici"
- 3 link con icone (Facebook, Instagram, YouTube):
  - Facebook: https://www.facebook.com/Caraval-Spettacoli-101656231430635/
  - Instagram: https://www.instagram.com/caravalspettacoli/
  - YouTube: https://www.youtube.com/channel/UC-9aDMm5MfweZP7Weq881EA?view_as=subscriber

Icone: usa lucide-react se installato (`Facebook`, `Instagram`, `Youtube`), altrimenti SVG inline. Stilizzate coerenti col resto del sito (color crema, hover color cremisi).

Layout: 3 colonne desktop con icona + label + link, 1 colonna mobile con stack verticale.

### 7.2 Aggiungi telefono associativo nelle 4 aree

Verifica che la sezione "CONTATTI GENERALI" mostri telefono `+39 379 149 7805` + email `caravalspettacoli@gmail.com` cliccabili.

Se non mostra il telefono, sistemalo.

### 7.3 Verifica indirizzo

Sezione "DOVE SIAMO": deve mostrare indirizzo + P.IVA. Verifica testo:
- "Via Borgo San Martino 8, 26029 Soncino (CR)"
- "P.IVA 01720800190"

---

## TASK 8 — Footer ristrutturato finale

### 8.1 Layout 4 colonne

- **Colonna 1 — Brand**:
  - "CARAVAL" in Cinzel Decorative grande
  - "Associazione Culturale" in Inter regular piccolo sotto
  - Indirizzo: "Via Borgo San Martino 8, 26029 Soncino (CR)"
  - P.IVA: "01720800190"
- **Colonna 2 — Sito**:
  - Spettacoli
  - Imaginarium
  - Calendario
  - Formazione
- **Colonna 3 — Chi siamo**:
  - Chi siamo
  - Ospita Caraval (in evidenza)
  - Contatti
- **Colonna 4 — Sociale**:
  - Email: caravalspettacoli@gmail.com (cliccabile mailto:)
  - Telefono: +39 379 149 7805 (cliccabile tel:)
  - Icone social (Facebook, Instagram, YouTube) cliccabili

### 8.2 Riga finale

In fondo al footer, riga separata da line top:
- Sinistra: "© 2026 Caraval Spettacoli — Sito di Eddidesign"
- Destra: link Privacy + Cookie (per ora placeholder, Iubenda sarà nel Blocco 5 setup tecnici)

### 8.3 Background footer

Theme `dark` con `bgVariant=soft` (#161616) per distinguerlo visivamente dall'ultima sezione di contenuto.

---

## TASK 9 — Schede spettacoli popolate (import da caraval.it)

### 9.1 Identifica corrispondenze

I 10 spettacoli attivi + 8 archivio già seedati hanno questi slug (esempi):
- `romeo-giulietta-inferno-amore`
- `la-fine-del-mondo`
- `arlecchino-servo-per-amore`
- `la-banalita-del-male`
- `cubiculum-diaboli`
- `macbeth`
- `skog-regina-creature-selvagge`
- `legend`
- `christmas-carol`
- `i-viaggiastorie`
- ... e archivio: `miseria-nobilta`, `giovanna-d-arco`, `inferno-di-dante`, `i-folli-notre-dame`, `servitore-due-padroni`, `sogno-notte-mezza-estate`, `ezzelino-romano`, `battute-fuori-scena`

Sul sito attuale `https://www.caraval.it` ci sono schede dettagliate per:
- `https://www.caraval.it/romeo-giulietta/` → Romeo + Giulietta (corrispondenza con `romeo-giulietta-inferno-amore`)
- `https://www.caraval.it/sognodunanottedimezzaestate/` → Sogno di una Notte di Mezza Estate (corrispondenza con `sogno-notte-mezza-estate`)
- `https://www.caraval.it/servitorediduepadroni/` → Servitore di Due Padroni (corrispondenza con `servitore-due-padroni`)
- `https://www.caraval.it/christmascarol/` → A Christmas Carol (corrispondenza con `christmas-carol`)
- `https://www.caraval.it/infernodidante/` → L'Inferno di Dante (corrispondenza con `inferno-di-dante`)
- `https://www.caraval.it/2-4/` → Miseria e Nobiltà (corrispondenza con `miseria-nobilta`)

### 9.2 Esecuzione

Per ognuno dei 6 spettacoli con corrispondenza:

1. Fai `curl` (o web_fetch) della pagina dettaglio sul sito attuale
2. Estrai SOLO la descrizione testuale (paragrafo principale che racconta lo spettacolo, NIENTE immagini, NIENTE info pratiche tipo "biglietti")
3. Patcha il campo `descrizioneNarrativa` (o equivalente) dello spettacolo Sanity corrispondente

**REGOLA NON NEGOZIABILE:** se trovi una corrispondenza chiara, importa la descrizione. **Se non trovi corrispondenza, IGNORA lo spettacolo (non inventare testi).**

Aggiungi al seed `seed-demo-content.ts` una nuova sezione `patchDescrizioniDalSitoAttuale()` che fa questa operazione in modo idempotente (run multipli non duplicano).

### 9.3 Verifica

Dopo il seed, naviga su:
- `/spettacoli/romeo-giulietta-inferno-amore` → deve mostrare descrizione importata
- `/spettacoli/christmas-carol` → deve mostrare descrizione importata
- ... per gli altri 4 con corrispondenza

Per gli spettacoli senza corrispondenza (Cubiculum Diaboli, Macbeth, ecc.) la descrizione resta come è ora.

---

## TASK 10 — Verifica e chiusura

### 10.1 Build e lint

- `npm run build` deve passare pulito
- `npm run lint` zero errori
- `npx tsc --noEmit` zero errori TS

### 10.2 Screenshot Chrome MCP

Per ogni pagina, desktop (1440px) + mobile (375px), max 2 retry per screenshot:
- `.screenshots/polish-homepage-{desktop,mobile}.png`
- `.screenshots/polish-spettacoli-{desktop,mobile}.png`
- `.screenshots/polish-spettacoli-slug-{desktop,mobile}.png` (es. romeo-giulietta)
- `.screenshots/polish-imaginarium-{desktop,mobile}.png`
- `.screenshots/polish-calendario-{desktop,mobile}.png`
- `.screenshots/polish-formazione-{desktop,mobile}.png`
- `.screenshots/polish-chi-siamo-{desktop,mobile}.png`
- `.screenshots/polish-contatti-{desktop,mobile}.png`
- `.screenshots/polish-ospita-{desktop,mobile}.png`

Se Chrome MCP fallisce dopo 2 retry, annota nella PR "Chrome MCP non disponibile, verifica visiva manuale su Vercel preview".

### 10.3 Aggiornamento CLAUDE.md

Sezione nuova "Polish Definitivo" con:
- File creati/modificati (lista sintetica)
- Schemi Sanity estesi
- Nuovi singleton creati
- Decisioni autonome documentate
- Bug noti residui (se ce ne sono)

### 10.4 PR

- Push branch `feat/polish-definitivo`
- Apri PR `Polish Definitivo — sistemi adattivi + palette + CTA + contenuti`
- Body PR:
  - Checklist 10 task con check ✅/❌
  - Screenshot principali (max 6, le più rappresentative)
  - Link Vercel preview
  - Test plan per Edo (vedi sezione successiva)
  - Eventuali bug noti
- **Niente merge automatico**, attendi review Edo

---

## TEST PLAN PER EDO

Da inserire nel body della PR per Edo:

### Test cursore adattivo (5 min)
1. Apri homepage, muovi mouse sopra hero scura → cursore crema visibile ✓
2. Scrolla fino sezione CTA "Sei un Comune" rosso pieno → cursore resta crema visibile (non rosso, sarebbe invisibile) ✓
3. Clicca link "Imaginarium" nell'header (NON refresh!) → navigazione client-side → su hero crema cursore diventa rosso scuro ✓
4. Scrolla giù su /imaginarium → quando arrivi alla CTA finale rossa, cursore torna crema ✓
5. Hover sul video YouTube → cursore custom sparisce (vedi solo cursore sistema sopra il video) ✓
6. Esci dal video → cursore custom riappare ✓

### Test header adattivo (3 min)
1. Su homepage hero → header con logo bianco, testi crema ✓
2. Vai su /imaginarium (click su link header) → header diventa logo nero, testi neri sulla hero crema ✓
3. Scrolla su /imaginarium fino sezione accent (CTA rosso) → header torna dark ✓
4. Su /ospita CTA finale rossa → header resta dark (testo chiaro contrasta con rosso) ✓
5. Mobile: apri drawer hamburger → sempre nero pieno ✓

### Test palette e ritmo sezioni (5 min)
1. Homepage: vedi alternanza sezioni nero/nero-soft? Sezione Imaginarium è crema invertita? CTA finale è rossa pieno? ✓
2. /spettacoli: ritmo sezioni alternato visibile? ✓
3. /imaginarium: tutto crema con accenti rosso scuro? CTA finale rossa? ✓
4. /chi-siamo: box Scuola di Magia è crema (spezza il ritmo)? ✓

### Test CTA uniforme (3 min)
Apri ogni pagina e scrolla alla CTA finale. Tutte devono avere lo stesso pattern grafico (sfondo rosso pieno, heading Cinzel crema, sottotitolo Inter, 1-2 bottoni). Solo i testi cambiano.

### Test accordion homepage (2 min)
Vai homepage, scrolla alla sezione "I nostri spettacoli". Le 2 colonne hanno la stessa altezza? Le voci accordion sono allineate orizzontalmente tra colonna sinistra e destra? ✓

### Test card formazione (2 min)
Vai /formazione. Su ogni card corso, vedi la CTA "Contattaci per informazioni"? Cliccandola va a /contatti? ✓

### Test /chi-siamo (3 min)
Vai /chi-siamo. Vedi tutti i 6 membri (Vera, Alessio, Nicola, Lorenzo, Marco, Ilaria)? Layout alternato media-text? Bio Caraval lunga importata visibile nella sezione Storia? ✓

### Test /contatti (3 min)
Vai /contatti. Vedi indirizzo + P.IVA + 4 aree contatto + sezione social (Facebook+Instagram+YouTube)? Tutti i link cliccabili (tel:, mailto:, social esterni)? ✓

### Test footer (2 min)
Footer di qualsiasi pagina. Vedi 4 colonne (Brand, Sito, Chi siamo, Sociale)? Social icone visibili e cliccabili? Riga finale con copyright + Privacy/Cookie? ✓

### Test schede spettacoli importate (3 min)
Vai /spettacoli/romeo-giulietta-inferno-amore, /spettacoli/christmas-carol, /spettacoli/sogno-notte-mezza-estate (se esistono). Vedi descrizioni reali importate dal sito attuale, non placeholder? ✓

### Test mobile (5 min)
Tutto sopra ma su 375px (DevTools mobile mode). Niente overflow, tutto leggibile, drawer hamburger funziona, social icone visibili. ✓

---

## COSA NON FARE

- Niente refactor architetturali oltre i task elencati
- Niente "miglioramenti spontanei" (es. ottimizzazioni performance, nuove animazioni)
- Niente mobile bottom nav (è il prossimo blocco)
- Niente SEO/sitemap/Iubenda (è il blocco finale)
- Niente form di contatto (decisione Edo)
- Niente mappa Google Maps (decisione Edo)
- Niente loghi clienti su /ospita (placeholder testuale)

## Domande legittime durante il lavoro

- "Trovo discrepanza tra `data-theme` derivato e background visivo: forzo theme esplicito o rifaccio derivazione?" → forza theme esplicito tramite prop, è più affidabile
- "La descrizione di Romeo+Giulietta sul sito attuale è di 2000 parole, importo tutto?" → sì, importa tutto. Vera potrà accorciare in Sanity Studio se vuole
- "Il singleton `paginaImaginariumCopy` ha già un campo `counterElenco` dal Blocco 1, lascio com'è?" → sì, non toccarlo

Mostrami il piano breve aggiornato (10 task con dipendenze) prima di partire, poi procedi.

---

**Fine prompt.**
