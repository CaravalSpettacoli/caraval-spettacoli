# Sessione 4 — Spettacoli (Indice + Scheda + Archivio + Ticket finale)

> **Per Claude Code in agentic mode.**
> Cartella di lavoro: `SITO/`
> Branch: nuovo branch `feat/sessione-4-spettacoli` da `main`
> Tempo atteso: **2-3 ore vere**
> Verifica visiva via Chrome MCP per ogni pagina (max 2 retry per screenshot)

---

## 0. PREMESSA

Le sessioni 1, 2, 2.7, 3 hanno costruito le fondamenta + homepage + hub Imaginarium. Adesso costruiamo il **cuore del sito**: tutto quello che gira intorno agli spettacoli del repertorio.

**Riferimenti obbligatori da leggere prima di iniziare:**
- `CLAUDE.md` (memoria persistente)
- `MATERIALE-PER-SITO/Caraval_DesignBrief.md` (wireframe pagina spettacolo §279, decisioni UX §319)
- `COPY_HOMEPAGE.md` (schema `spettacolo`, riferimenti contatti per area)

**Regola d'oro:** tutto Sanity-driven, niente hardcoded.

---

## 1. SETUP

### Task 0.A — Branch e baseline

1. Da `main` (aggiornato dopo merge PR sessione 3 + fix bug homepage), crea branch `feat/sessione-4-spettacoli`
2. Verifica `npm run dev` parta pulito
3. Verifica che lo script seed sia ancora idempotente: rilancialo se serve, deve passare senza creare duplicati

---

## 2. TASK A — Estensione schemi Sanity

### A.1 — Estensione schema `spettacolo`

Aggiungi questi campi (se mancanti):

- `gallery` (array of images, optional, fieldset "Contenuti consigliati")
- `trailerYoutube` (url, optional, validation: must be YouTube URL — `youtube.com/watch?v=` o `youtu.be/`)
- `citazioniStampa` (array of objects: `testo`, `fonte`, `data`, optional)

### A.2 — Schema ticket / prenotazione (cuore della Sessione 4)

Aggiungi al document `spettacolo` un oggetto `prenotazione` con:

- `modalita` (string, enum required, default "richiestaContatto"):
  - `"linkEsterno"` — biglietteria online (es. Vivaticket, Eventbrite)
  - `"emailTelefono"` — prenotazione diretta a Caraval via mail/telefono
  - `"ingressoLibero"` — niente azione, solo info
  - `"botteghino"` — biglietto al teatro
  - `"richiestaContatto"` — default per spettacoli senza date fisse, rimanda a contatti

- `urlBiglietti` (url, optional, visible only if `modalita == "linkEsterno"`)
- `etichettaCustom` (string, optional, es. "Prenota su Vivaticket" — override del testo CTA)
- `noteAggiuntive` (text, optional, es. "Ridotto under 26: 8€")

### A.3 — Estensione `paginaInfo` o singleton dedicato

Se non esiste, crea singleton `paginaSpettacoliCopy` per il copy della pagina indice `/spettacoli`:

- `eyebrow` (string, default: "IL REPERTORIO")
- `heading` (string, default: "I nostri spettacoli")
- `intro` (text, default: "Prosa contemporanea, teatro di fuoco e di strada. Per teatri, piazze, borghi, rievocazioni storiche.")
- `archivioHeading` (string, default: "Produzioni passate")
- `archivioIntro` (text, default: "Spettacoli che hanno fatto parte del nostro percorso. Per scoprire da dove veniamo.")

### Criteri di accettazione Task A
- [ ] Schemi compilano senza errori
- [ ] Sanity Studio mostra i nuovi campi nel document `spettacolo` raggruppati in fieldset chiari
- [ ] Campo `prenotazione.modalita` è required ma con default ragionevole (`"richiestaContatto"`)

---

## 3. TASK B — Aggiornamento seed con dati Romeo+Giulietta completi

Estendi `sanity/scripts/seed-demo-content.ts` per popolare **Romeo+Giulietta** (`spettacolo` demo principale) con tutti i dati disponibili nel PDF brochure.

### Dati da inserire per Romeo+Giulietta

(Tutti i dati sono nel file `MATERIALE-PER-SITO/BROCHURE SPETTACOLI/` — Claude Code legge il PDF e estrae)

- `titolo`: "Romeo + Giulietta"
- `sottotitolo`: "L'inferno dell'amore"
- `slug`: "romeo-giulietta-inferno-amore"
- `categoria`: "prosa"
- `inRepertorio`: true
- `mostraInHomepage`: true
- `ordineHomepage`: 1
- `descrizioneBreve`: estrai 200 chars dalla descrizione narrativa
- `descrizioneNarrativa`: testo completo dal PDF (l'inferno, i due personaggi-diavoli, il copione trovato, l'alternanza ironia-tragedia, riflessione su odio e rimorso)
- `regia`: "Vera Rossini"
- `produzione`: "Caraval Spettacoli"
- `anno`: 2026
- `schedaTecnica`:
  - `durata`: "70 minuti senza intervallo"
  - `dimensioniPalco`: "8x6m (H 5.50m), adattabile a 5x4m"
  - `tempoMontaggio`: "120 minuti"
  - `tempoSmontaggio`: "60 minuti"
  - `requisitiTecnici`: "1 camerino con acqua corrente, allaccio 220V"
- `cast`: array con
  - { nome: "Vera Rossini", ruolo: "Regia, attrice" }
  - { nome: "Nicola Pignoli", ruolo: "Attore, musiche" }
  - { nome: "Giacomo Andrico", ruolo: "Scene" }
  - { nome: "Antonio Botti", ruolo: "Luci" }
  - { nome: "Aurora Rossini", ruolo: "Costumi" }
- `prenotazione.modalita`: "richiestaContatto"
- `referenteContatto`: reference a Vera Rossini

Per **Miseria e Nobiltà** (archivio), popola minimo:
- `titolo`, `categoria` ("prosa"), `inRepertorio: false`, `anno`: 2022, `regia`: "Lorenzo Samanni"
- Linka il `premio` Edallo CremainScena 2022

Per **gli spettacoli di fuoco** (Cubiculum Diaboli, Macbeth, Skog, Legend, A Christmas Carol):
- Imposta `prenotazione.modalita: "richiestaContatto"`
- Imposta `referenteContatto` a Nicola Pignoli (così la scheda mostra i suoi recapiti)

Per **I Viaggiastorie**:
- `prenotazione.modalita: "richiestaContatto"`, `referenteContatto`: Vera

### Criteri di accettazione Task B
- [ ] Seed rilanciabile senza errori
- [ ] Romeo+Giulietta in Sanity Studio ha tutti i campi popolati visibili
- [ ] Spettacoli di fuoco hanno Nicola come referente

---

## 4. TASK C — Pagina indice `/spettacoli`

### File da creare

- `src/app/spettacoli/page.tsx`
- `src/components/caraval/SpettacoliFilter.tsx` (filtri categoria)
- `src/components/caraval/SpettacoloCardLarge.tsx` (card per pagina indice, più grande di quella homepage)

### Logica

Server Component che fa fetch di tutti gli spettacoli con `inRepertorio: true`:

```tsx
const spettacoli = await client.fetch(`*[_type == "spettacolo" && inRepertorio == true] | order(ordineHomepage asc) {
  ..., premiAssociati[]->, referenteContatto->
}`)
```

### Layout pagina

1. **Hero compatto** (40vh): eyebrow "IL REPERTORIO" + heading "I nostri spettacoli" + intro
2. **Strip filtri**: 4 bottoni — "Tutti" | "Prosa" | "Fuoco" | "Strada"
   - Attivo: bottone con sfondo rosso, testo crema
   - Inattivo: bordo rosso 1px, testo crema
   - Logica filtro **client-side** (con `useState`) — niente reload pagina
   - Per il client-side, isola la logica filter in un Client Component figlio `<SpettacoliGrid>` mentre il fetch resta nel parent server
3. **Griglia spettacoli**: 3 colonne desktop, 2 tablet, 1 mobile
   - Card `<SpettacoloCardLarge>`:
     - Foto cover (o `<PlaceholderImage>` con il titolo)
     - Badge categoria in alto a sinistra (rosso per prosa, fuoco arancione/dorato per fuoco, viola per strada)
     - Eventuale badge premio in alto a destra ("Premio Edallo 2023")
     - Titolo in Cinzel Decorative
     - Sottotitolo se presente
     - Descrizione breve (max 2 righe, line-clamp)
     - CTA implicita: tutto il card è cliccabile → `/spettacoli/[slug]`
   - Hover: lift -4px + shadow rosso muted
4. **CTA finale a fondo pagina**: link a `/spettacoli/archivio` con titolo "Vuoi vedere il nostro storico? Esplora le produzioni passate →"

### Criteri di accettazione Task C
- [ ] `/spettacoli` mostra tutte e 10 le card del repertorio attivo
- [ ] Filtri funzionano client-side senza reload
- [ ] Click su card naviga a `/spettacoli/[slug]` corretta
- [ ] Mobile responsive (375px) con stack verticale
- [ ] Screenshot Chrome MCP desktop + mobile in `.screenshots/4-spettacoli-index-{desktop,mobile}.png`

---

## 5. TASK D — Template scheda spettacolo `/spettacoli/[slug]`

### File da creare

- `src/app/spettacoli/[slug]/page.tsx` (Server Component dinamico)
- `src/components/caraval/HeroSpettacolo.tsx`
- `src/components/caraval/DescrizioneNarrativa.tsx`
- `src/components/caraval/GalleriaFoto.tsx` (lightbox semplice)
- `src/components/caraval/TrailerVideo.tsx` (embed YouTube)
- `src/components/caraval/SchedaTecnica.tsx`
- `src/components/caraval/CastECrediti.tsx`
- `src/components/caraval/CitazioniStampa.tsx`
- `src/components/caraval/TicketSpettacolo.tsx` (NUOVO ticket finale, vedi Task E)
- `src/components/caraval/SpettacoliCorrelati.tsx`

### Layout (allineato al wireframe Design Brief §279)

1. **Hero 70vh**:
   - Foto cover full-bleed con overlay nero gradient
   - Etichetta categoria (badge in alto)
   - Titolo grande in Cinzel Decorative
   - Sottotitolo (se presente)
   - Eventuale badge premio
   - Anno produzione sotto il titolo
2. **Descrizione narrativa**: testo evocativo, max 700px larghezza centrato, sfondo nero base
3. **Galleria foto** (se `gallery.length > 0`): 6 foto in griglia 3x2, click apre lightbox semplice
4. **Trailer video** (se `trailerYoutube` presente): embed YouTube in container 16:9
5. **Scheda tecnica** (sezione visivamente distinta, sfondo nero soft):
   - Layout a 2 colonne: label a sinistra in uppercase tracked, valore a destra
   - Durata, palco, montaggio, smontaggio, requisiti
6. **Cast e crediti**: lista pulita stile credit film, regia evidenziata
7. **Citazioni stampa** (se presenti): card con virgolette grandi rosso muted, testo + fonte
8. **Sezione "Per ingaggiarci" (Ticket)**:
   - Background nero soft
   - A sinistra: il `<TicketSpettacolo>` con info spettacolo + CTA dipendente da `prenotazione.modalita`
   - A destra: paragrafo "Per portare questo spettacolo nel tuo evento, contatta [referenteContatto]" + recapiti referente (telefono cliccabile, email cliccabile)
   - Layout responsive: stack su mobile
9. **Spettacoli correlati**: 3 card della stessa categoria (escludendo quello corrente), `<SpettacoloCardLarge>` size ridotta

### Logica Server Component

```tsx
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const spettacoli = await client.fetch(`*[_type == "spettacolo" && inRepertorio == true]{ "slug": slug.current }`)
  return spettacoli.map(s => ({ slug: s.slug }))
}

export default async function SpettacoloPage({ params }: { params: { slug: string } }) {
  const spettacolo = await client.fetch(`*[_type == "spettacolo" && slug.current == $slug][0]{
    ...,
    premiAssociati[]->,
    referenteContatto->,
    "correlati": *[_type == "spettacolo" && categoria == ^.categoria && _id != ^._id && inRepertorio == true][0..2]
  }`, { slug: params.slug })
  
  if (!spettacolo) notFound()
  
  return (
    <>
      <HeroSpettacolo data={spettacolo} />
      <DescrizioneNarrativa testo={spettacolo.descrizioneNarrativa} />
      {spettacolo.gallery && <GalleriaFoto immagini={spettacolo.gallery} />}
      {spettacolo.trailerYoutube && <TrailerVideo url={spettacolo.trailerYoutube} />}
      <SchedaTecnica scheda={spettacolo.schedaTecnica} />
      <CastECrediti cast={spettacolo.cast} regia={spettacolo.regia} />
      {spettacolo.citazioniStampa && <CitazioniStampa citazioni={spettacolo.citazioniStampa} />}
      <SezionePrenotazione spettacolo={spettacolo} referente={spettacolo.referenteContatto} />
      <SpettacoliCorrelati correlati={spettacolo.correlati} />
    </>
  )
}
```

### Gestione campi vuoti

Per gli spettacoli non popolati (8 spettacoli oltre Romeo+Giulietta e Miseria e Nobiltà):
- Hero: usa `<PlaceholderImage>` con il titolo grande in Cinzel
- Descrizione narrativa: se vuota, mostra "Descrizione in arrivo"
- Galleria, trailer, citazioni: se vuoti, sezione non viene renderizzata
- Scheda tecnica: se vuota, non renderizzare la sezione
- Cast: se vuoto, non renderizzare
- Sezione prenotazione: SEMPRE presente, anche se solo con CTA generica

### Criteri di accettazione Task D
- [ ] `/spettacoli/romeo-giulietta-inferno-amore` mostra tutti i contenuti popolati correttamente
- [ ] `/spettacoli/macbeth` (vuoto) mostra il template con placeholder eleganti, niente errori
- [ ] `/spettacoli/non-esiste` restituisce 404
- [ ] Trailer YouTube si embedda correttamente (testa con un URL valido nel seed di Romeo+Giulietta)
- [ ] Scheda tecnica leggibile, ben formattata
- [ ] Mobile responsive
- [ ] Screenshot di Romeo+Giulietta scheda completa in `.screenshots/4-scheda-completa-{desktop,mobile}.png`

---

## 6. TASK E — Ticket finale (verticale, simmetria centrale)

Questo è il **ridisegno del ticket** rimandato dalla Sessione 2.7. Reference visivo: ticket teatro nera con simmetria centrale (sfondo scuro, lettering filettato, perforazione centrale verticale).

### File: `src/components/caraval/TicketSpettacolo.tsx`

### Specifiche visive

- **Orientamento**: verticale, aspect ratio circa 2:5 (es. 280x700px desktop, scalabile su mobile)
- **Sfondo**: nero deep (`#050505`) con texture sottile (filigrana SVG ondulata opacity 0.06, riusa quella della Sessione 2.7)
- **Bordo**: rosso base 1.5px, radius 12px
- **Struttura simmetrica**: divisore tratteggiato verticale al centro che separa 2 metà speculari

### Contenuto interno

**Metà superiore (alto):**
- "INGRESSO" in Inter uppercase tracked piccolo, in alto a sinistra, ruotato 90° antiorario
- Titolo spettacolo in Cinzel Decorative, centrato, max 3 righe con line-clamp
- Sottotitolo se presente, in Inter italic crema muted

**Divisore centrale:**
- Linea tratteggiata orizzontale (8 dash, color rosso)
- Sui lati: 2 piccole "perforazioni" semicircolari (semicircle clip, sfondo del padre per simulare il foro)
- Stella ★ piccola al centro della linea

**Metà inferiore (basso):**
- Categoria spettacolo in uppercase (PROSA / FUOCO / STRADA) con colore dedicato
- Anno produzione in Cinzel piccolo
- **CTA dinamica** in base a `prenotazione.modalita`:
  - `"linkEsterno"` → bottone rosso "Vai ai biglietti" con link esterno (target="_blank")
  - `"emailTelefono"` → bottone rosso "Prenota" → apre `mailto:` o `tel:` (vedi sotto)
  - `"ingressoLibero"` → label "INGRESSO LIBERO" in box dorato/oro, niente bottone
  - `"botteghino"` → label "Biglietto al teatro" in box neutro
  - `"richiestaContatto"` (default) → bottone rosso "Per ingaggiarci" → ancora interna alla sezione "Per portare questo spettacolo da te" della stessa pagina
- "N° SERIE" in mono piccolo in basso a destra (decorativo, non un vero numero — usa lo slug spettacolo come identifier)

### CTA "Prenota" — logica `mailto:` / `tel:`

Se `modalita == "emailTelefono"`:
- Mostra 2 bottoni piccoli affiancati: "Email" e "Chiama"
- Email link: `mailto:caravalspettacoli@gmail.com?subject=Prenotazione%20{titolo}`
- Tel link: `tel:+393791497805`

### Animazioni

- **Hover desktop**: lift -6px + shadow rossa muted morbida (no rotazione)
- **Click sulla CTA**: animazione 300ms di pressed (scale 0.97), poi esegui azione
- **Apertura modal opzionale**: SE l'utente clicca al di fuori della CTA ma sul ticket, apri un modal con info estese (sinossi breve, scheda tecnica veloce, recapiti). Per ora **skip questa feature** — il ticket non deve essere cliccabile in toto, solo le CTA dentro
- **prefers-reduced-motion**: skip animazioni

### Criteri di accettazione Task E
- [ ] Ticket renderizzato con simmetria visibile, divisore centrale, perforazioni laterali
- [ ] CTA cambia correttamente in base a `prenotazione.modalita` (testa Romeo+Giulietta = richiestaContatto, e poi cambia manualmente in Sanity Studio per testare gli altri stati)
- [ ] Mobile: ticket si scala mantenendo aspect ratio 2:5 (max-w-[280px], h auto)
- [ ] Screenshot ticket desktop in `.screenshots/4-ticket-finale-{desktop,mobile}.png`
- [ ] Click su "Prenota" apre correttamente mailto/tel
- [ ] Click su "Vai ai biglietti" apre URL esterno in nuova tab

---

## 7. TASK F — Pagina archivio `/spettacoli/archivio`

Pagina semplice come da decisione di Vera (no schede, solo elenco).

### File: `src/app/spettacoli/archivio/page.tsx`

### Logica

```tsx
const archivio = await client.fetch(`*[_type == "spettacolo" && inRepertorio == false] | order(anno desc)`)
```

### Layout

1. **Hero compatto** (40vh): eyebrow "ARCHIVIO" + heading "Produzioni passate" + intro
2. **Galleria a griglia**: 4 colonne desktop, 2 tablet, 1 mobile
   - Ogni item:
     - Foto cover (o placeholder) in formato 4:5 verticale
     - Sotto la foto: titolo in Cinzel + anno in Inter piccolo + eventuale badge premio
     - Nessun link cliccabile (le schede dettagliate non esistono per l'archivio, come deciso)

### Spettacoli da popolare nell'archivio (placeholder, almeno per la struttura)

Nel seed, oltre a Miseria e Nobiltà, aggiungi questi document `spettacolo` con `inRepertorio: false`:

- Skog e la Regina delle Creature Selvagge (categoria fuoco, anno 2018)
- A Christmas Carol (Charles Dickens) (categoria fuoco, anno 2019)
- Giovanna D'Arco (categoria prosa, anno 2021)
- L'Inferno di Dante (categoria prosa, anno 2021)
- I Folli di Notre Dame (categoria fuoco, anno 2021)
- Servitore di due padroni (categoria prosa, anno 2019)
- Sogno di una notte di mezza estate (categoria prosa, anno 2019)
- Ezzelino da Romano (categoria prosa, anno 2018)
- Battute fuori scena (categoria prosa, anno 2018)

Tutti con `mostraInHomepage: false`, niente foto (placeholder), regia presa dai dati nel PDF brochure.

### Criteri di accettazione Task F
- [ ] `/spettacoli/archivio` mostra una galleria con almeno 10 produzioni passate
- [ ] Ogni item ha titolo + anno visibili
- [ ] Card NON cliccabili (no hover lift, no cursor pointer)
- [ ] Mobile responsive
- [ ] Screenshot in `.screenshots/4-archivio-{desktop,mobile}.png`

---

## 8. WORKFLOW CHROME MCP

Per ogni Task C, D, E, F, dopo aver scritto il codice:

1. `npm run dev` (se non già attivo)
2. Via Chrome MCP: navigate + screenshot desktop + resize 375px + screenshot mobile
3. Confronta con criteri di accettazione
4. **Anti-loop:** max 2 retry per pagina. Se Chrome MCP fallisce, procedi e annota nel commit.

---

## 9. CHIUSURA SESSIONE

1. Aggiorna `CLAUDE.md` con sezione Sessione 4
2. Push branch su GitHub
3. Apri PR con titolo `Sessione 4 — Spettacoli (Indice + Scheda + Archivio + Ticket finale)`
4. Body PR: lista task con check, screenshot principali, link al deploy preview Vercel, checklist test plan per Edo
5. **Niente merge automatico**, attende review

---

## 10. COSA NON FARE

- ❌ Hardcodare testi (tutto Sanity)
- ❌ Aggiungere componenti non previsti
- ❌ Modificare schemi non menzionati in Task A
- ❌ Toccare le pagine già fatte (homepage, hub Imaginarium)
- ❌ Loop di screenshot Chrome MCP (max 2 retry)
- ❌ Costruire un calendario eventi qui — è scope Sessione 5

---

## 11. QUANDO HAI DUBBI

Se trovi incoerenze o decisioni ambigue, fermati e chiedi a Edo. Esempi:
- "Il PDF brochure di Romeo+Giulietta menziona un trailer YouTube ma non c'è il link — cosa metto?"
- "I Viaggiastorie nel PDF ha categoria 'strada' ma referente non è chiaro — uso Vera o lascio vuoto?"
- "Il ticket verticale a 2:5 su mobile (375px wide) diventa molto stretto — vado a 3:5 forzato?"

---

**Buon lavoro.**
