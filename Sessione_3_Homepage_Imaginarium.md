# Sessione 3 — Homepage + Hub Imaginarium (Sanity-driven)

> **Per Claude Code in agentic mode.**
> Cartella di lavoro: `SITO/`
> Branch: nuovo branch `feat/sessione-3-homepage-imaginarium` da `main`
> Tempo atteso: **2-3 ore vere**
> Verifica visiva via Chrome MCP per ogni pagina

---

## 0. PREMESSA

Le sessioni 1 e 2 hanno creato il fondamento (Next.js + Sanity + design system). La sessione 2.7 ha rifinito font, ticket, sipario, cursore. Adesso costruiamo le **prime due pagine reali Sanity-driven**: homepage e hub Imaginarium.

**Regola d'oro non negoziabile:** tutto il contenuto deve venire da Sanity, niente hardcoded. Il singolo eccezionale è l'identità visiva (colori, font, layout, animazioni).

**Riferimenti obbligatori** che Claude Code deve aver letto prima di iniziare:
- `CLAUDE.md` nella root (memoria persistente progetto)
- `Caraval_DesignBrief.md` in `MATERIALE-PER-SITO/` (wireframe homepage al §227, identità visiva, TOV)
- `COPY_HOMEPAGE.md` in `SITO/` (questo è il documento operativo per il copy + schemi Sanity)

---

## 1. SETUP

### Task 0.A — Branch e baseline

1. Da `main` (aggiornato dopo merge PR sessione 2.7), crea branch `feat/sessione-3-homepage-imaginarium`
2. Verifica che `npm run dev` parta pulito su `localhost:3000`
3. Screenshot baseline `/design-system` in `.screenshots/3.0-baseline.png` per conferma stato pre-sessione

### Task 0.B — Verifica schemi Sanity esistenti

Il progetto ha già 8 schemi Sanity. Verifica quali esistono e quali campi hanno:

```bash
ls -la sanity/schemas/
```

Schemi attesi (dal brief sessione 1):
- `spettacolo`
- `evento`
- `edizioneImaginarium`
- `spettacoloImaginarium`
- `corso`
- `membro`
- `paginaInfo`
- `impostazioniSito`

**Per ogni schema esistente, verifica i campi e segnala discrepanze rispetto al `COPY_HOMEPAGE.md`.** Non modificare ancora — fai un report.

---

## 2. TASK A — Estensione/creazione schemi Sanity

### A.1 — Singleton da creare/aggiornare

#### `homepageHero` (NUOVO singleton)
Campi esatti come da `COPY_HOMEPAGE.md` §1.

#### `homepageCopy` (NUOVO singleton)
Contiene tutti i testi delle sezioni 5 (Officina), 6 (Ospita), 7 (Contatti) + qualsiasi altro testo della homepage che non ha un suo schema dedicato.

Campi:
- `officinaEyebrow`, `officinaHeading`, `officinaBody`, `officinaTagline`, `officinaCtaTesto`, `officinaCtaLink`
- `ospitaHeading`, `ospitaBody`, `ospitaCtaTesto`, `ospitaCtaLink`
- `contattiHeading`, `contattiBody`
- `repertorioEyebrow`, `repertorioHeading`, `repertorioIntro`, `repertorioCtaTesto`, `repertorioCtaLink`
- `premiHeading` (es. "Tre premi in quattro anni.")
- `imaginariumPreviewBody`, `imaginariumPreviewCtaTesto`

### A.2 — Document collection da estendere

#### `spettacolo`
Aggiungi se mancanti:
- `mostraInHomepage` (boolean, default false)
- `ordineHomepage` (number)
- `descrizioneBreve` (text, max 200 chars)
- `referenteContatto` (reference → membro, optional)
- `premiAssociati` (array of references → premio)

#### `premio` (verifica/crea)
Schema completo come da `COPY_HOMEPAGE.md` §2.

#### `edizioneImaginarium` (verifica)
Campi esatti come da `COPY_HOMEPAGE.md` §3.

#### `spettacoloImaginarium` (verifica)
Campi esatti come da `COPY_HOMEPAGE.md` §3.

#### `membro`
Aggiungi se mancante:
- `referenteAreaTesto` (string, optional, es. "Spettacoli di fuoco e rievocazioni")
- `telefonoPubblico` (string, optional)
- `emailPubblica` (string, optional)

#### `corso`
Aggiungi se mancanti (vedi `COPY_HOMEPAGE.md` §5):
- `statoCorso` (string with enum)
- `dataInizio`, `dataFine`, `dataChiusuraIscrizioni`
- `frequenza`
- `spettacoloFinaleLinked` (reference → spettacoloImaginarium)
- `referenteIscrizioni` (reference → membro)

### Criteri di accettazione Task A
- [ ] Tutti gli schemi compilano senza errori (`npm run build` su Sanity Studio)
- [ ] Sanity Studio (`/studio`) mostra tutti i singleton e collection senza errori
- [ ] Nessun campo obbligatorio bloccante per la fase demo (tutti `validation: optional` tranne `titolo`/`slug` dove serve)

---

## 3. TASK B — Popolamento demo content via script

Crea uno script Node che popola Sanity con il demo content definito in `COPY_HOMEPAGE.md` §"STRATEGIA POPOLAMENTO DEMO".

**Posizione file:** `sanity/scripts/seed-demo-content.ts`

**Esecuzione:** `npm run sanity:seed` (aggiungi script in `package.json`)

### Contenuto da popolare

**Singleton:**
- `homepageHero` con copy completo (foto: usa placeholder asset Sanity esistente o uno generico, vedi sotto)
- `homepageCopy` con tutti i testi delle sezioni
- `impostazioniSito` se mancante (recapiti, dati legali da `CLAUDE.md`)

**Document:**
- `spettacolo` × 2: Romeo+Giulietta (attivo, foto placeholder) + Miseria e Nobiltà (archivio)
- `edizioneImaginarium` × 3: 2026 (popolata 100%), 2025 (placeholder), 2024 (placeholder)
- `spettacoloImaginarium` × 2: Romeo+Giulietta @ 5/6 + La Mandragola @ 12/6 (linkati a edizione 2026)
- `premio` × 3: Edallo 2022, Edallo 2023, Atelier Leà 2025
- `membro` × 2: Vera Rossini, Nicola Pignoli (con recapiti pubblici per i pulsanti contatto)
- `corso` × 2: i 2 corsi adulti che finiscono maggio 2026, ognuno con spettacolo finale linkato

### Foto placeholder

NON usare stock photo. Crea/usa un asset Sanity placeholder:
- Pattern semplice: sfondo nero soft (`#1a1a1a`) con testo crema centrato
- Se Sanity non permette upload da script, usa `_type: "image", _ref: "image-..."` con un asset placeholder generico già caricato (uploadalo manualmente una volta in Studio se serve)
- Alternativa: campo `fotoCover` lasciato `undefined` e il front-end usa `<PlaceholderImage>` (vedi Task D)

### Criteri di accettazione Task B
- [ ] Script eseguibile con `npm run sanity:seed`
- [ ] Idempotente: rieseguendo non duplica i document (controlla se esistono prima di crearli)
- [ ] Sanity Studio mostra tutti i document creati con campi popolati visibili
- [ ] Edo (utente non-tech) può aprire un document in Studio e modificare un campo, salvare, e vedere il cambio nel sito (testato manualmente)

---

## 4. TASK C — Homepage (`/`)

Costruisci la homepage seguendo il wireframe del Design Brief §227 + il copy di `COPY_HOMEPAGE.md`.

### File da creare

- `src/app/page.tsx` (riscrivi quella esistente)
- `src/components/caraval/HeroHomepage.tsx`
- `src/components/caraval/StripPremi.tsx`
- `src/components/caraval/ImaginariumPreview.tsx`
- `src/components/caraval/RepertorioPreview.tsx`
- `src/components/caraval/OfficinaTeaser.tsx`
- `src/components/caraval/OspitaTeaser.tsx`
- `src/components/caraval/ContattiPrelude.tsx`
- `src/components/ui/PlaceholderImage.tsx`

### Logica fetch dati

In `src/app/page.tsx` (Server Component):

```tsx
import { client } from '@/sanity/lib/client'

async function getHomepageData() {
  const [hero, copy, premi, edizioneCorrente, spettacoliCorrente, repertorio] = await Promise.all([
    client.fetch(`*[_type == "homepageHero"][0]`),
    client.fetch(`*[_type == "homepageCopy"][0]`),
    client.fetch(`*[_type == "premio" && mostraInHomepage == true] | order(ordineHomepage asc) {
      ..., spettacoloAssociato->{titolo, slug}
    }`),
    client.fetch(`*[_type == "edizioneImaginarium" && mostraInHomepage == true] | order(anno desc)[0]`),
    client.fetch(`*[_type == "spettacoloImaginarium" && edizione->mostraInHomepage == true] | order(data asc)`),
    client.fetch(`*[_type == "spettacolo" && inRepertorio == true && mostraInHomepage == true] | order(ordineHomepage asc)`)
  ])
  return { hero, copy, premi, edizioneCorrente, spettacoliCorrente, repertorio }
}

export default async function HomePage() {
  const data = await getHomepageData()
  return (
    <>
      <HeroHomepage data={data.hero} />
      <StripPremi premi={data.premi} heading={data.copy?.premiHeading} />
      <ImaginariumPreview edizione={data.edizioneCorrente} spettacoli={data.spettacoliCorrente} body={data.copy?.imaginariumPreviewBody} />
      <RepertorioPreview spettacoli={data.repertorio} copy={data.copy} />
      <OfficinaTeaser copy={data.copy} />
      <OspitaTeaser copy={data.copy} />
      <ContattiPrelude copy={data.copy} />
    </>
  )
}
```

### Specifiche per componente

#### `<HeroHomepage>`
- 80vh altezza
- Foto sfondo coperta da overlay nero gradient (alto contrasto sui testi)
- Heading in Cinzel Decorative grande (clamp 3rem-6rem)
- Sub-heading in Inter, max 700px larghezza
- 2 CTA: primaria (bottone rosso) + secondaria (testuale sottolineata)
- Niente carosello (anti-pattern dal Design Brief §198)

#### `<StripPremi>`
- Sfondo nero soft
- Heading piccolo a sinistra, 3 card a destra in fila
- Card: bordo rosso 1px, anno in Cinzel grande, premio in Inter, motivazione opzionale piccola
- Mobile: stack verticale

#### `<ImaginariumPreview>`
- **PALETTE INVERSA**: sfondo crema (`#f5e6d3`), testi rosso scuro
- Logo Imaginarium grande in alto (per ora placeholder Cinzel "IMAGINARIUM")
- Programma in griglia 2x3 (mobile: 1 colonna)
- Strip sponsor/partner sotto il programma
- CTA rossa scura "Scopri il festival"

#### `<RepertorioPreview>`
- Sfondo nero base
- Eyebrow + heading + intro centrati
- 2 colonne: Prosa (sinistra) / Fuoco e strada (destra)
- Mobile: stack verticale, prima Prosa
- Lista item: titolo in Cinzel + descrizione breve in Inter (se presente)
- CTA finale "Vedi tutto il repertorio"

#### `<OfficinaTeaser>`
- Sfondo nero soft
- Layout asimmetrico: testo a sinistra, immagine/decorazione a destra (mobile: stack)
- Tagline "Non serve esperienza. Serve curiosità." come sub-heading

#### `<OspitaTeaser>`
- **SFONDO ROSSO PIENO** (`#a8174a`)
- Testi in crema
- CTA bianca su rosso
- Pattern visivo distintivo (è il blocco B2B più importante)

#### `<ContattiPrelude>`
- Sfondo nero base
- 2 CTA grandi affiancate: scrivici (mailto) + chiamaci (tel)

#### `<PlaceholderImage>`
Componente UI riutilizzabile:
- Props: `title` (string), `aspectRatio` (default "16/9"), `className`
- Sfondo nero soft, titolo in Cinzel grande crema, sottoscritta "Foto in arrivo" in Inter piccolo, accento rosso muted

### Considerazioni di design (dal Design Brief)

- Spacing tra sezioni: 96px desktop, 64px mobile
- Eyebrow uppercase tracked sopra ogni heading (`text-xs uppercase tracking-widest text-rosso-base`)
- Animazioni: `fade-in on scroll` discreto via Intersection Observer o CSS
- Mobile-first: testa a 375px prima del desktop
- Niente parallax pesanti

### Criteri di accettazione Task C
- [ ] Tutte e 7 le sezioni renderizzate in ordine corretto
- [ ] Tutti i testi vengono da Sanity (verificato modificando un campo in Studio e ricaricando)
- [ ] Sezione Imaginarium ha palette inversa visibilmente diversa
- [ ] Sezione Ospita ha sfondo rosso pieno
- [ ] Mobile responsive a 375px senza overflow orizzontale
- [ ] Screenshot Chrome MCP desktop in `.screenshots/3-homepage-desktop.png`
- [ ] Screenshot Chrome MCP mobile (375px) in `.screenshots/3-homepage-mobile.png`
- [ ] Build `npm run build` passa senza errori
- [ ] Lighthouse mobile > 80 su Performance e Accessibility (test rapido)

---

## 5. TASK D — Hub Imaginarium (`/imaginarium`)

Pagina dedicata al festival, edizione corrente (2026) in primo piano + box per edizioni passate in fondo.

### File da creare

- `src/app/imaginarium/page.tsx`
- `src/components/imaginarium/HeroImaginarium.tsx`
- `src/components/imaginarium/ProgrammaCompleto.tsx`
- `src/components/imaginarium/SponsorPartnerStrip.tsx`
- `src/components/imaginarium/EdizioniPassate.tsx`

### Identità visiva DISTINTA

Tutta la pagina `/imaginarium` usa la **palette inversa**:
- Sfondo dominante: crema (`#f5e6d3`)
- Accenti e CTA: rosso scuro (`#8e1240`)
- Testi: nero profondo (`#0a0a0a`) per leggibilità

Crea un wrapper `<ImaginariumThemeProvider>` o usa una classe CSS che applica la palette a tutta la pagina.

### Logica fetch

```tsx
async function getImaginariumData() {
  const [edizioneCorrente, spettacoliCorrente, edizioniPassate] = await Promise.all([
    client.fetch(`*[_type == "edizioneImaginarium"] | order(anno desc)[0]`),
    client.fetch(`*[_type == "spettacoloImaginarium" && edizione->anno == $anno] | order(data asc)`, { anno: edizioneCorrente.anno }),
    client.fetch(`*[_type == "edizioneImaginarium" && anno < $annoCorrente] | order(anno desc)`, { annoCorrente: edizioneCorrente.anno })
  ])
  return { edizioneCorrente, spettacoliCorrente, edizioniPassate }
}
```

### Specifiche componenti

#### `<HeroImaginarium>`
- 60vh altezza
- Sfondo crema con eventuale texture vintage (pattern carta spaccata, opzionale)
- Logo Imaginarium grande centrato (placeholder Cinzel "IMAGINARIUM" se non c'è asset)
- Sotto: "Festival di Teatro Itinerante" + "Soncino · 4 — 18 giugno 2026" (date dinamiche da Sanity)
- Body: descrizione festival da `edizione.descrizione`
- Location principale visibile

#### `<ProgrammaCompleto>`
- Griglia 2x3 desktop (3x2 tablet, 1 colonna mobile)
- Ogni card: data grande in Cinzel, titolo spettacolo, compagnia (con link esterno se `linkCompagniaEsterna` presente), foto opzionale (`<PlaceholderImage>` se mancante)
- Hover: lift card + shadow rossa muted

#### `<SponsorPartnerStrip>`
- Strip orizzontale in fondo all'edizione corrente
- 3 sezioni: "Con il patrocinio di" / "Sponsor" / "Partner"
- Per ora solo testi (loghi caricati in Sanity dopo)

#### `<EdizioniPassate>`
- In fondo alla pagina, sotto sponsor strip
- Heading: "Edizioni passate"
- 2 box compatti: 2025 e 2024
- Ogni box: anno grande in Cinzel + descrizione breve + CTA "Scopri" → `/imaginarium/[anno]`
- Per le edizioni placeholder, mostra messaggio "Programma in caricamento"

### Routing edizioni passate

Crea route dinamica `src/app/imaginarium/[anno]/page.tsx` che:
- Fa fetch dell'edizione con `anno == params.anno`
- Se l'edizione esiste ma è placeholder (no spettacoli linkati) → pagina mostra "Programma in caricamento" + link torna a `/imaginarium`
- Se l'edizione non esiste → 404
- Se popolata → mostra programma stesso layout dell'edizione corrente ma con palette ridotta (es. titolo "Edizione 2025" in alto)

**Per la sessione 3**, basta che la route esista e gestisca il caso placeholder. Le pagine complete delle edizioni passate sono per quando arriveranno i dati.

### Criteri di accettazione Task D
- [ ] `/imaginarium` renderizza con palette inversa visibilmente diversa dalla homepage
- [ ] Programma completo 2026 (6 spettacoli) visibile in griglia
- [ ] Box edizioni passate in fondo, link cliccabili
- [ ] `/imaginarium/2025` mostra messaggio placeholder elegante
- [ ] `/imaginarium/2024` mostra messaggio placeholder elegante
- [ ] `/imaginarium/9999` (anno inesistente) restituisce 404
- [ ] Mobile responsive
- [ ] Screenshot Chrome MCP in `.screenshots/3-imaginarium-desktop.png` e `.screenshots/3-imaginarium-mobile.png`

---

## 6. WORKFLOW CHROME MCP

Per ogni Task C e D, dopo aver scritto il codice:

1. `npm run dev` (se non già attivo)
2. Via Chrome MCP:
   - `navigate` a URL pertinente
   - `take_screenshot` desktop full-page
   - Resize viewport a 375px
   - `take_screenshot` mobile full-page
3. Confronta con criteri di accettazione
4. Itera se serve

**Regola anti-loop:** se Chrome MCP fallisce o va in timeout, fai max 2 tentativi e poi procedi senza screenshot. Annota il problema nel commit message. Edo verificherà visivamente sul preview Vercel.

---

## 7. CHIUSURA SESSIONE

1. Aggiorna `CLAUDE.md` con sezione Sessione 3:
   - Schemi Sanity creati/estesi
   - Demo content popolato (lista document creati)
   - Componenti React aggiunti
   - Decisioni di design prese in autonomia (con motivazione)
2. Push branch su GitHub
3. Apri PR con titolo `Sessione 3 — Homepage + Hub Imaginarium (Sanity-driven)`
4. Body PR: lista task con check, screenshot principali, link al deploy preview Vercel, checklist test plan per Edo
5. **Niente merge automatico**, attende review di Edo

---

## 8. COSA NON FARE

- ❌ Hardcodare testi nel codice (tutto in Sanity)
- ❌ Aggiungere componenti non previsti ("già che c'ero...")
- ❌ Modificare design system esistente (font, palette, spacing)
- ❌ Creare schemi Sanity con campi obbligatori bloccanti per la demo
- ❌ Usare stock photo per placeholder (solo `<PlaceholderImage>` o foto Caraval reali)
- ❌ Aggiungere parallax pesanti, carousel, embed Facebook (anti-pattern dal Design Brief)
- ❌ Loop di screenshot Chrome MCP — max 2 tentativi per pagina

---

## 9. QUANDO HAI DUBBI

Se trovi qualcosa di ambiguo o incoerente, **fermati e chiedi a Edo** invece di decidere. Esempi di domande legittime:

- "Lo schema `evento` esistente ha già un campo `categoria` che può confliggere con quello di `spettacolo`?"
- "Nello script seed, se Sanity richiede asset image obbligatori, posso lasciare i campi foto vuoti?"
- "Il logo Imaginarium come asset non c'è ancora, uso testo Cinzel grande come fallback?"

Meglio una domanda in più che una sessione 3.1 di rifacimento.

---

**Buon lavoro.**
