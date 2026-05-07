# COPY HOMEPAGE — Caraval Spettacoli

> Documento curato da Edo + Claude.
> Allineato al **Caraval_DesignBrief.md** (wireframe homepage al §227) e a tutte le decisioni di Vera (chat WhatsApp 4/5/2026 + integrazione 7/5/2026).
> **Tutto il contenuto di questo documento è Sanity-driven**, popolato come demo content per la presentazione di lunedì 11/5.
> Tono: fedele al claim ufficiale Caraval, conforme al TOV del brief (caldo, diretto, evocativo asciutto, sicuro).

---

## REGOLA D'ORO PER CLAUDE CODE

**Tutto ciò che è "contenuto" vive in Sanity Studio.** Niente è hardcoded in codice React.
Il codice legge da Sanity e renderizza. Se Vera modifica un campo in Studio, il sito si aggiorna.

**Eccezioni** (restano in codice, NON in Sanity):
- Palette colori, font, design tokens
- Layout strutturale, animazioni, componenti UI
- Routing, slug logic, schema validations

**Per ogni testo presente in questo documento:** Claude Code crea il campo Sanity corrispondente, lo popola con il testo qui scritto come default, e il componente React lo legge da Sanity.

**Strategia placeholder:** dove i dati reali non sono disponibili (foto, programmi Imaginarium passati, membri oltre Vera), popolare con placeholder strutturati che mostrano la forma del contenuto, non lorem ipsum visivo. Il front-end gestisce gracefully sezioni vuote.

---

## STRUTTURA HOMEPAGE (allineata al wireframe del Design Brief §227)

Ordine dei blocchi dall'alto verso il basso:

1. Hero (80vh)
2. Strip Premi (compatta, subito sotto hero per trust B2B)
3. Imaginarium 2026 (festival, identità visiva distinta)
4. Repertorio (2 colonne: prosa / fuoco e strada)
5. Officina Teatrale (teaser formazione)
6. Ospita Caraval (blocco B2B con CTA rossa)
7. CTA finale + footer

---

## 1. HERO

**Sfondo:** foto di scena cinematografica wide (alto contrasto, atmosfera teatrale matura).
Per la demo iniziale: foto placeholder con titolo grande in Cinzel su sfondo nero/rosso.

**Logo "Caraval Spettacoli"** in alto a sinistra (font Stonehead, già nel Header globale).

**Heading principale (Cinzel Decorative, grande):**
> Caraval Spettacoli

**Sub-heading (Inter, 2 righe max):**
> Compagnia teatrale di Soncino. Facciamo prosa, teatro di strada e spettacoli di fuoco.
> Ogni estate, nei borghi della media pianura, c'è Imaginarium.

**CTA primaria (bottone rosso):**
> I nostri spettacoli → /spettacoli

**CTA secondaria (testuale sottolineata):**
> Imaginarium 2026 · 4–18 giugno → /imaginarium

### Schema Sanity per la hero
Singleton `homepageHero`:
- `fotoSfondo` (image, hotspot enabled)
- `heading` (string, default: "Caraval Spettacoli")
- `subheading` (text, default: testo sopra)
- `ctaPrimariaTesto` (string)
- `ctaPrimariaLink` (string, default: "/spettacoli")
- `ctaSecondariaTesto` (string)
- `ctaSecondariaLink` (string, default: "/imaginarium")

---

## 2. STRIP PREMI

**Posizione:** subito sotto hero, fascia orizzontale compatta.
**Razionale (dal Design Brief §271):** "Premi visibili nei primi 5 secondi (per Roberto B2B)".

**Heading (piccolo, in alto a sinistra della strip):**
> Tre premi in quattro anni.

**Layout:** 3 card orizzontali allineate, sfondo nero soft, bordo rosso 1px.

### Card 1
- **Anno:** 2022
- **Premio:** Premio Edallo · CremainScena
- **Spettacolo:** Miseria e Nobiltà
- **Motivazione:** Migliore messa in scena.

### Card 2
- **Anno:** 2023
- **Premio:** Premio Edallo · CremainScena
- **Spettacolo:** La Fine del Mondo
- **Motivazione (estratto, sotto le 15 parole):**
> "Profondità del testo e interpretazione dei due attori."

### Card 3
- **Anno:** 2025
- **Premio:** Miglior Drammaturgia Originale · Atelier Leà Milano
- **Spettacolo:** La Fine del Mondo

### Schema Sanity per i premi
Document `premio` (collection):
- `anno` (number)
- `nomePremio` (string)
- `rassegna` (string, optional)
- `spettacoloAssociato` (reference → spettacolo)
- `motivazione` (text, optional)
- `ordineHomepage` (number)
- `mostraInHomepage` (boolean, default true)

---

## 3. IMAGINARIUM 2026

**Identità visiva DISTINTA dal resto del sito** (Design Brief §256, §194):
- Palette inversa: crema dominante / rosso scuro come accento
- Font display Cinzel più presente
- Texture vintage opzionale

**Logo Imaginarium grande**

**Sotto il logo:**
> Festival di Teatro Itinerante
> Soncino · 4 — 18 giugno 2026

**Body (1-2 righe asciutte):**
> Sei serate, sei spettacoli, ingresso gratuito. Compagnie da tutta Italia. Il teatro torna dove la comunità vive.

**Programma (lista o griglia 2x3):**

| Data | Spettacolo | Compagnia |
|---|---|---|
| Gio 4 giu · ore 21 | Letizia va alla guerra | Teatro degli Incamminati |
| Ven 5 giu · ore 21 | Romeo + Giulietta | Caraval Spettacoli |
| Dom 7 giu · ore 21 | James Brown si metteva i bigodini | Officina Caraval |
| Ven 12 giu · ore 21 | La Mandragola | Stivalaccio Teatro |
| Dom 14 giu · ore 21 | Matti da slegare | Officina Caraval |
| Gio 18 giu · ore 21 | Modì | Cantibhakta |

**Location principale:**
> Rocca Sforzesca, Soncino

**Strip sponsor/partner (loghi piccoli):**
> Con il patrocinio di **Comune di Soncino**
> Sponsor: **Danesi**
> Partner: **I Viaggiastorie** · **Bacco da Seta** · **Pro Loco Soncino**

**CTA:**
> Scopri il festival → /imaginarium

### Schema Sanity per Imaginarium

Document `edizioneImaginarium` (collection):
- `anno` (number, unique)
- `dataInizio` (date)
- `dataFine` (date)
- `locationPrincipale` (string, default: "Rocca Sforzesca, Soncino")
- `descrizione` (text)
- `patrocinio` (array of strings)
- `sponsor` (array of strings)
- `partner` (array of strings)
- `mostraInHomepage` (boolean, default true)
- `slug` (slug, auto-generated from anno)

Document `spettacoloImaginarium` (collection):
- `edizione` (reference → edizioneImaginarium)
- `data` (datetime)
- `titolo` (string)
- `compagnia` (string)
- `descrizione` (text, optional)
- `locationSpecifica` (string, optional)
- `foto` (image, optional)
- `linkCompagniaEsterna` (url, optional)

---

## 4. REPERTORIO

**Eyebrow (label uppercase tracked):**
> IL REPERTORIO

**Heading (Cinzel Decorative):**
> I nostri spettacoli

**Intro (1 riga asciutta):**
> Prosa contemporanea, teatro di fuoco e di strada. Per teatri, piazze, borghi, rievocazioni storiche.

### Layout: 2 colonne

#### Colonna A — Prosa

**Eyebrow colonna:**
> PROSA CONTEMPORANEA

**Lista spettacoli (4):**
- Romeo + Giulietta — L'inferno dell'amore
- La Fine del Mondo
- Arlecchino servo per amore
- La Banalità del Male

#### Colonna B — Fuoco e strada

**Eyebrow colonna:**
> FUOCO E STRADA

**Lista spettacoli (6):**
- Cubiculum Diaboli (fuoco)
- Macbeth (fuoco)
- Skog e la Regina delle creature selvagge (fuoco)
- Legend (fuoco)
- A Christmas Carol (fuoco)
- I Viaggiastorie (teatro di strada)

**CTA finale sezione:**
> Vedi tutto il repertorio → /spettacoli

### Schema Sanity per gli spettacoli
Document `spettacolo` (collection):
- `titolo` (string)
- `sottotitolo` (string, optional)
- `slug` (slug)
- `categoria` (string, enum: "prosa" | "fuoco" | "strada")
- `inRepertorio` (boolean, true = repertorio attivo, false = archivio)
- `mostraInHomepage` (boolean, default false)
- `ordineHomepage` (number)
- `descrizioneBreve` (text, max 200 chars)
- `descrizioneNarrativa` (text)
- `fotoCover` (image)
- `gallery` (array of images, optional)
- `schedaTecnica` (object: durata, attori, spazioMinimo, audio)
- `cast` (array of objects: nome, ruolo)
- `regia` (string)
- `produzione` (string, default: "Caraval Spettacoli")
- `anno` (number)
- `premiAssociati` (array of references → premio)
- `referenteContatto` (reference → membro, optional — per spettacoli di fuoco usa Nicola)

**Nota archivio:** gli spettacoli con `inRepertorio: false` vengono mostrati in `/spettacoli/archivio` come **galleria/timeline** (solo nome + anno + foto), senza scheda dettagliata. Quindi NON serve la route `/spettacoli/archivio/[slug]`.

---

## 5. OFFICINA TEATRALE (teaser)

**Eyebrow:**
> FORMAZIONE

**Heading:**
> Officina Teatrale

**Body (2 righe):**
> Corsi serali per adulti da ottobre a maggio. Spettacolo finale a Imaginarium. Laboratori nelle scuole primarie del territorio.

**Tagline aggiuntiva (dal Design Brief §332):**
> Non serve esperienza. Serve curiosità.

**CTA:**
> Scopri i corsi → /formazione

### Schema Sanity (in singleton homepageCopy)
- `officinaEyebrow` (string, default: "FORMAZIONE")
- `officinaHeading` (string, default: "Officina Teatrale")
- `officinaBody` (text)
- `officinaTagline` (string)
- `officinaCtaTesto` (string)
- `officinaCtaLink` (string, default: "/formazione")

### Schema Sanity per i corsi
Document `corso` (collection):
- `titolo` (string)
- `target` (string, enum: "adulti" | "bambini" | "scuole" | "altro")
- `statoCorso` (string, enum: "in_corso" | "iscrizioni_aperte" | "concluso")
- `dataInizio` (date)
- `dataFine` (date)
- `dataChiusuraIscrizioni` (date, optional)
- `frequenza` (string, es. "Una sera a settimana")
- `descrizione` (text)
- `spettacoloFinaleLinked` (reference → spettacoloImaginarium, optional)
- `referenteIscrizioni` (reference → membro, default: Vera)

---

## 6. OSPITA CARAVAL (blocco B2B)

**Razionale:** pattern "CTA rossa prominente per B2B" (Design Brief §196 punto 7).

**Layout:** sezione a sfondo rosso pieno, testo in crema, CTA bianca.

**Heading (Cinzel Decorative grande):**
> Sei un Comune, una Pro Loco, una dimora storica?

**Body (2-3 righe):**
> Caraval può portare uno spettacolo da te. Prosa per teatri, fuoco per rievocazioni storiche, strada per piazze e borghi. Lavoriamo con Comuni, Pro Loco, dimore storiche e associazioni in tutta la Lombardia e oltre.

**CTA primaria (bottone bianco su sfondo rosso):**
> Scopri come ingaggiarci → /ospita

### Schema Sanity (in singleton homepageCopy)
- `ospitaHeading` (string)
- `ospitaBody` (text)
- `ospitaCtaTesto` (string)
- `ospitaCtaLink` (string, default: "/ospita")

---

## 7. CTA FINALE / CONTATTI PRELUDIO

**Heading (Cinzel Decorative):**
> Restiamo in contatto

**Body (1 riga):**
> Per spettacoli, collaborazioni, formazione o solo per dirci ciao.

**CTA primaria:**
> Scrivici → mailto:caravalspettacoli@gmail.com

**CTA secondaria:**
> Chiamaci → tel:+393791497805

### Schema Sanity (in singleton homepageCopy)
- `contattiHeading` (string)
- `contattiBody` (text)
(Email e telefono già in `impostazioniSito`)

---

## RIFERIMENTI CONTATTI PER AREA (per pagina /contatti)

Importante per Sessione 6 (pagina contatti) e per le schede spettacolo:

| Area | Referente | Telefono | Email |
|---|---|---|---|
| Formazione, regia, generale | Vera Rossini | +39 348 9143189 | caravalspettacoli@gmail.com |
| Spettacoli di fuoco, rievocazioni | Nicola Pignoli | +39 348 3399431 | nicolapignoli8@gmail.com |
| Associativo / amministrativo | — | +39 379 1497805 | caravalspettacoli@gmail.com |

Sulle schede spettacolo di fuoco (Cubiculum Diaboli, Macbeth, Skog, Legend, A Christmas Carol), il `referenteContatto` punta a Nicola e nella scheda compare il pulsante "Per ingaggiarci → contatta Nicola" con i suoi recapiti.

Sulle schede di prosa, di default `referenteContatto` è Vera o non specificato.

---

## SITEMAP DEFINITIVA

```
/                              → Homepage
/spettacoli                    → Indice repertorio attivo (filtri prosa/fuoco/strada)
/spettacoli/[slug]             → Scheda spettacolo singolo
/spettacoli/archivio           → Galleria produzioni passate (no schede dettagliate)
/imaginarium                   → Hub Imaginarium edizione corrente (2026)
/imaginarium/[anno]            → Edizione passata (2024, 2025)
/imaginarium/[anno]/[slug]     → Spettacolo singolo dell'edizione passata
/formazione                    → Officina Teatrale + laboratori scolastici
/calendario                    → Tutte le date eventi (qualsiasi categoria spettacolo)
/calendario/[slug]             → Singolo evento
/chi-siamo                     → Storia + persone + premi + Scuola di Magia (link esterno)
/contatti                      → Recapiti per area (Vera, Nicola, associativo)
/ospita                        → B2B "Ospita Caraval"
/privacy                       → (Iubenda)
/cookie                        → (Iubenda)
```

**Rimossa rispetto al brief originale:** `/spettacoli/archivio/[slug]` (decisione Vera 7/5: solo galleria, no schede).

---

## STRATEGIA POPOLAMENTO DEMO (per Sessione 3 + 4)

Claude Code popola via script Sanity i seguenti document **come demo content iniziale**.
Edo li sostituirà / completerà manualmente in Sanity Studio nel weekend.

### Singleton (1 ciascuno, popolati 100%)

- `impostazioniSito` (già esiste, già popolato)
- `homepageHero` (popolato con copy + foto placeholder)
- `homepageCopy` (popolato con tutti i testi delle sezioni 5, 6, 7)

### Document collection — Demo content

**Spettacoli:**
- `spettacolo` × 1 demo attivo: **Romeo + Giulietta** (popolato 100%)
- `spettacolo` × 1 demo archivio: **Miseria e Nobiltà** (con riferimento al premio Edallo 2022)

**Imaginarium:**
- `edizioneImaginarium` × 3:
  - **2026** (popolata 100%: programma, sponsor, partner, location)
  - **2025** (placeholder: anno + descrizione "Programma in caricamento")
  - **2024** (placeholder: anno + descrizione "Programma in caricamento")
- `spettacoloImaginarium` × 2 (linkati all'edizione 2026): **Romeo + Giulietta @ 5/6** + **La Mandragola @ 12/6**

**Premi:**
- `premio` × 3: tutti e 3 i premi (Edallo 2022, Edallo 2023, Atelier Leà 2025)

**Membri:**
- `membro` × 1 demo: **Vera Rossini** (foto placeholder, nome, ruolo: regista/attrice/formatrice, contatti)
- `membro` × 1: **Nicola Pignoli** (per linkare come `referenteContatto` agli spettacoli di fuoco)

**Corsi:**
- `corso` × 2 demo: rappresentativi dei 2 corsi adulti che finiscono a maggio 2026, ognuno con il proprio spettacolo finale linkato (James Brown / Matti da slegare). Da rivedere e aggiustare in Sanity Studio nel weekend.

### Foto placeholder

Componente React `<PlaceholderImage>` riutilizzabile:
- Sfondo nero o nero soft
- Titolo del contenuto in Cinzel grande
- Sottoscritta "Foto in arrivo" in Inter piccolo
- Tinta rossa muted come accento

Mai usare lorem ipsum visivo o stock photo "tipo Canva".

### Gestione sezioni vuote (front-end)

- Edizione Imaginarium senza spettacoli → "Programma in fase di caricamento. Le date saranno annunciate sui canali ufficiali."
- Spettacolo senza foto → `<PlaceholderImage>` con il titolo
- Categoria repertorio senza spettacoli → la colonna non viene mostrata
- Calendario senza eventi → "Nessuna data in calendario al momento. Per ingaggiarci, contattaci."

---

## NOTE PER CLAUDE CODE — SESSIONE 3 (Homepage + Hub Imaginarium)

### Componenti dominio da creare

In `src/components/caraval/`:
- `<HeroHomepage>` — legge da `homepageHero` singleton
- `<StripPremi>` — legge `premio` con `mostraInHomepage = true`, ordinati per `ordineHomepage`
- `<ImaginariumPreview>` — legge `edizioneImaginarium` corrente + relativi `spettacoloImaginarium`, applica palette inversa
- `<RepertorioPreview>` — legge `spettacolo` con `inRepertorio = true` e `mostraInHomepage = true`, raggruppati per `categoria`
- `<OfficinaTeaser>` — legge da `homepageCopy`
- `<OspitaTeaser>` — legge da `homepageCopy`, sfondo rosso pieno
- `<ContattiPrelude>` — legge da `homepageCopy` + `impostazioniSito`
- `<PlaceholderImage>` — componente UI riutilizzabile

### Hub Imaginarium (`/imaginarium`)

Pagina singola che mostra solo l'edizione corrente (2026):
- Hero con logo Imaginarium grande
- Date + location principale
- Descrizione festival
- Programma completo (griglia 2x3 con foto compagnie ospiti)
- Strip sponsor/partner con loghi
- Sezione "Edizioni passate" in fondo: 2 box compatti con anno + link a `/imaginarium/2025` e `/imaginarium/2024`

### Considerazioni di design

- Spacing tra sezioni: 96px desktop / 64px mobile
- Alternanza sfondi: nero base / nero soft per ritmo
- Imaginarium ha **palette propria** (crema/rosso) — eccezione voluta
- Ospita ha **sfondo rosso pieno** — pattern B2B
- Eyebrow uppercase tracked sopra ogni heading
- Animazioni discrete: fade-in on scroll OK, niente parallax pesanti

---

**Fine documento.**
