# Prompt Chat 1 — Setup Tecnico Caraval Spettacoli

> **Istruzioni per Edo:** copia tutto il contenuto sotto questa riga (dal `# CONTESTO PROGETTO` fino alla fine), poi incollalo come **primo messaggio** di Claude Code dopo aver aperto il terminale e navigato nella cartella del progetto.

---

# CONTESTO PROGETTO

Sei l'agente AI che svilupperà il sito web per **Caraval Spettacoli**, compagnia teatrale italiana di Soncino (CR). 

Lavoreremo per fasi separate distribuite su sessioni distinte di Claude Code. Questa è la **Sessione 1: Setup Tecnico**. Non ti chiederò di fare design o pagine vere in questa sessione. L'obiettivo è creare le fondamenta tecniche del progetto.

## Modalità di lavoro

Lavora in modalità **agentic**: pianifica, esegui, verifica, itera autonomamente. Riduci al minimo le domande all'utente. Quando devi fare scelte tecniche minori, prendile e procedi spiegando brevemente.

Usa **Plan Mode** quando appropriato (specialmente prima di operazioni complesse o cambiamenti strutturali).

Crea **subagent** in parallelo quando puoi accelerare il lavoro (es. mentre uno schema Sanity viene creato, un altro può configurare Tailwind).

Se trovi errori, prova a risolverli autonomamente prima di chiedere aiuto.

---

# OBIETTIVO DELLA SESSIONE 1

Al termine di questa sessione voglio avere:

1. ✅ Progetto Next.js 14 (App Router) + TypeScript + Tailwind CSS + Sanity CMS funzionante
2. ✅ Repository Git inizializzato e collegato a GitHub
3. ✅ File `CLAUDE.md` nella root del progetto con tutto il contesto strategico per le sessioni future
4. ✅ I 8 schemi Sanity completi (li trovi nelle specifiche più sotto)
5. ✅ Sanity Studio configurato e accessibile
6. ✅ Primo commit + push su GitHub
7. ✅ Progetto importato su Vercel + primo deploy preview funzionante
8. ✅ Skeleton del sito: una homepage placeholder che mostra "Caraval Spettacoli" e una pagina demo per validare lo stack
9. ✅ MCP Chrome configurato per testing visivo nelle sessioni future
10. ✅ Variabili d'ambiente configurate correttamente

# AMBIENTE TECNICO

- **Sistema operativo:** macOS
- **Node.js:** v22.19.0 ✅
- **npm:** 10.9.3 ✅
- **Git:** già installato ✅
- **Claude Code:** già installato ✅

## Path della cartella di lavoro

Tutta la cartella del progetto va creata in:
```
/Users/edoardobiondi/Desktop/SITO-CARAVAL/sito/
```

⚠️ **Importante:** la cartella padre `/Users/edoardobiondi/Desktop/SITO-CARAVAL/` esiste già e contiene una sottocartella `MATERIALE-PER-SITO/` (o `ASSETS/`) con loghi, font, brochure, documenti strategici. **Non toccare quella cartella**, è separata dal progetto sviluppo.

Il progetto Next.js + tutti i file di codice vivono in:
```
/Users/edoardobiondi/Desktop/SITO-CARAVAL/sito/
```

## Account già creati

- **GitHub:** username `CaravalSpettacoli`, email `info@caraval.it`
  - Repository: `https://github.com/CaravalSpettacoli/caraval-spettacoli.git` (già creato vuoto)
- **Vercel:** account collegato a GitHub (stessa email)
- **Sanity:** account creato con email `info@caraval.it`

L'utente (Edo) farà i login su queste piattaforme da terminale quando glielo chiederai (es. `vercel login`, `sanity login`).

---

# STACK TECNICO ESATTO

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **CMS:** Sanity v3 (con Sanity Studio integrato in Next.js sotto `/studio`)
- **Hosting:** Vercel (piano Hobby gratuito)
- **Repository:** GitHub
- **Privacy/Cookie:** Iubenda (integrazione hardcoded via env vars)
- **Analytics:** Umami self-hosted su Vercel (configureremo in sessione futura)
- **Font:** Google Fonts (Inter come body, MCF Stonehead Demo come display via @font-face)

## Pacchetti npm da installare

Oltre alle dipendenze base di Next.js + Sanity:
- `@sanity/image-url` per servire immagini ottimizzate dal CDN Sanity
- `@portabletext/react` per renderizzare rich text Sanity
- `next-sanity` per integrazione fluida
- `@sanity/vision` per query GROQ in Studio (utile in development)
- `lucide-react` per icone
- `clsx` per gestire classi condizionali
- `tailwindcss-animate` per animazioni di base

---

# CONTESTO STRATEGICO CARAVAL

Tutto questo va incluso nel file `CLAUDE.md` che creerai, per essere disponibile a tutte le sessioni future di Claude Code.

## Chi è Caraval

Compagnia teatrale di Soncino (CR), media pianura padana lombarda. Fondata gennaio 2020. Tre premi negli ultimi quattro anni:
- Premio Edallo CremainScena 2022 (per "Miseria e Nobiltà")
- Premio Edallo CremainScena 2023 (per "La Fine del Mondo")
- Miglior Drammaturgia Originale Atelier Leà 2025 (per "La Fine del Mondo")

## Tre anime artistiche

1. **Teatro di prosa** — La Fine del Mondo, Arlecchino servo per amore, Romeo+Giulietta L'Inferno dell'Amore, La Banalità del Male
2. **Teatro di strada** — I Viaggiastorie 🎪
3. **Spettacoli di fuoco** — Legend 🔥, Cubiculum Diaboli 🔥, Macbeth 🔥, Origines 🔥

**Totale repertorio attivo: 9 spettacoli (4 prosa + 1 strada + 4 fuoco).**

## Festival Imaginarium

Festival di teatro itinerante nei borghi di Soncino. Alla 3ª edizione (4-18 giugno 2026, 6 serate, ingresso libero). Compagnie ospiti incluse Stivalaccio Teatro, Tournée Da Bar, Compagnia Burambò.

## Officina Teatrale

Corso di teatro per adulti, una sera a settimana da ottobre a maggio, con spettacolo finale a Imaginarium. 2 corsi attualmente attivi. Anche laboratori scolastici nelle elementari.

## Positioning

> Caraval Spettacoli è la compagnia teatrale della media pianura padana che attraversa con la stessa serietà la prosa, il teatro di strada e gli spettacoli di fuoco, e che ogni estate trasforma i borghi del territorio in palcoscenico con il festival Imaginarium.

**Tagline corta:** *Una compagnia. Tre anime. Un festival.*

## Tone of Voice (4 attributi)

1. **Caldo, mai distaccato** — tu/noi, niente passivo impersonale
2. **Diretto, non aulico** — frasi corte, verbi concreti
3. **Evocativo dove serve, asciutto altrove** — narrativo nelle descrizioni spettacolo, telegrafico nelle info pratiche
4. **Sicuro, mai auto-celebrativo** — afferma fatti, non cerca approvazione

**Parole bandite:** magico, indimenticabile, eccellenza, sognante, fiabesco, "vi invitiamo", "realtà" (nel senso di "siamo una realtà").

**Parole da usare:** stupore, sorprendere, borghi, itinerante, officina, comunità, tradizione popolare, insieme.

## Audience (4 personas)

1. **Marta** (47, Soncino, B2C prossimità) — "Quando e dove?"
2. **Stefano e Chiara** (38-42, Brescia, B2C culturale) — "Vale la pena spostarsi?"
3. **Roberto** (54, assessore comunale, B2B) — "È una compagnia seria?"
4. **Anna** (56, aspirante allieva, formazione) — "Posso farlo anch'io?"

---

# PALETTE COLORI E TIPOGRAFIA

Aggiungili come variabili CSS e Tailwind config.

## Colori

```
--color-nero: #0a0a0a (sfondo dominante)
--color-rosso: #a8174a (accenti, CTA, etichette categoria)
--color-crema: #f5e6d3 (testi su nero, sfondi alternati)
```

**Doppia identità:**
- **Caraval principale:** nero dominante + rosso accenti + testo crema
- **Imaginarium (sub-route):** palette inversa, crema dominante su rosso, font Stonehead più presente, texture vintage

## Tipografia

- **Body e UI:** Inter (Google Fonts)
- **Display titoli decorativi:** MCF Stonehead Demo (caricato come @font-face dai file font che si trovano in `/Users/edoardobiondi/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/fonts/`)
- **Body text minimo:** 16px
- **Contrasto:** ≥ 4,5:1 (WCAG AA)
- **Label sezione:** uppercase tracciate

## Spacing

Sistema token: 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96.

---

# SITEMAP

11 percorsi pubblici principali da mappare nel routing Next.js (App Router):

```
/                            → Homepage
/spettacoli                  → Indice repertorio attivo
/spettacoli/[slug]           → Scheda spettacolo singolo
/spettacoli/archivio         → Produzioni passate
/spettacoli/archivio/[slug]  → Scheda produzione passata
/imaginarium                 → Hub festival edizione corrente
/imaginarium/[anno]          → Edizioni passate (es. /imaginarium/2025)
/imaginarium/[anno]/[slug]   → Spettacolo singolo dell'edizione
/formazione                  → Pagina Officina Teatrale + laboratori scolastici
/calendario                  → Tutte le date eventi
/calendario/[slug]           → Singolo evento
/chi-siamo                   → Storia + persone + premi
/contatti                    → Contatti standard
/ospita                      → Pagina B2B "Ospita Caraval"
/privacy                     → (link Iubenda)
/cookie                      → (link Iubenda)
```

---

# CONTENT MODEL SANITY (8 SCHEMI)

Crea questi schemi in `/sanity/schemas/`. Tutti i campi visibili al cliente devono essere in **italiano** (label), nomi tecnici interni in inglese.

## Schema 1 — `spettacolo`

URL: `/spettacoli/[slug]`. Rappresenta gli spettacoli del repertorio + archivio.

Campi:
- `titolo` (string, obbligatorio) — es. "Romeo+Giulietta — L'Inferno dell'Amore"
- `slug` (slug, autogenerato dal titolo, obbligatorio)
- `categoria` (string enum: `prosa` / `strada` / `fuoco`, obbligatorio)
- `inRepertorio` (boolean, default `true`) — se `false` lo spettacolo va in archivio
- `sottotitolo` (string, opzionale)
- `annoCreazione` (number, obbligatorio)
- `immagineCover` (image con alt obbligatorio)
- `gallery` (array of image con alt)
- `videoUrl` (url, opzionale, per YouTube/Vimeo embed)
- `descrizioneBreve` (text max 200 char, obbligatorio per SEO meta)
- `descrizioneNarrativa` (block content / portable text, obbligatorio se `inRepertorio = true`)
- `schedaTecnica` (object con sotto-campi):
  - `durataMinuti` (number)
  - `numeroAttori` (string, es. "2" o "6-10")
  - `spazioScenico` (string)
  - `audio` (string)
  - `pubblicoTarget` (string opz.)
  - `noteTecniche` (text opz.)
- `cast` (array di object con `nome` e `ruolo`)
- `premi` (array di object con `nomePremio`, `anno`, `categoria` opz.)
- `citazioniStampa` (array di object con `testo`, `fonte`, `data` opz.)
- `tag` (array of string opzionale: `con-fuoco`, `adatto-bambini`, `all-aperto`, `in-tour`)
- `seoTitle` (string, opzionale, override SEO)
- `seoDescription` (text, opzionale)

**Validazione condizionale:** se `inRepertorio = false`, solo `titolo`, `annoCreazione`, `immagineCover`, `descrizioneBreve` sono obbligatori.

## Schema 2 — `evento`

URL: `/calendario/[slug]`. Rappresenta una singola data di calendario.

Campi:
- `titolo` (string, obbligatorio)
- `slug` (slug, autogenerato)
- `tipoEvento` (string enum: `spettacolo-repertorio` / `imaginarium` / `officina` / `evento-speciale`, obbligatorio)
- `spettacoloRif` (reference → `spettacolo`, obbligatorio se `tipoEvento = spettacolo-repertorio`)
- `spettacoloImaginariumRif` (reference → `spettacoloImaginarium`, obbligatorio se `tipoEvento = imaginarium`)
- `titoloLibero` (string, per eventi speciali senza scheda spettacolo)
- `dataInizio` (datetime, obbligatorio)
- `dataFine` (datetime, opzionale)
- `luogo` (object):
  - `nomeStruttura` (string)
  - `indirizzo` (string)
  - `citta` (string)
  - `provincia` (string, 2 lettere)
  - `coordinate` (geopoint, opz.)
- `comeParteciapare` (object):
  - `tipo` (enum: `biglietto-pagamento` / `prenotazione-gratuita` / `ingresso-libero` / `botteghino-teatro`, obbligatorio)
  - `urlBiglietti` (url, opz.)
  - `prezzoLibero` (string, opz., es. "8-15€")
  - `noteAccesso` (text, opz.)
- `descrizioneEvento` (text, opz., note specifiche per quella data)
- `immagineCover` (image, opz., override foto spettacolo)

## Schema 3 — `edizioneImaginarium`

URL: `/imaginarium` (corrente) e `/imaginarium/[anno]` (passate).

Campi:
- `anno` (number, obbligatorio, unique)
- `slug` (autogenerato dall'anno)
- `corrente` (boolean, default `false`. Solo una può essere `true` — validazione)
- `titoloEdizione` (string, opz.)
- `tema` (string, opz.)
- `dataInizio` (date, obbligatorio)
- `dataFine` (date, obbligatorio)
- `descrizione` (block content, obbligatorio)
- `immagineCover` (image obbligatoria)
- `locandina` (image, opz.)
- `programmaPdf` (file pdf, opz.)
- `partner` (array di object):
  - `nome` (string)
  - `tipo` (enum: `patrocinio` / `sponsor` / `partner`)
  - `logo` (image, opz.)
  - `url` (url, opz.)
- `seoTitle` (string, opz.)
- `seoDescription` (text, opz.)

## Schema 4 — `spettacoloImaginarium`

URL: `/imaginarium/[anno]/[slug]`. Singolo spettacolo dentro un'edizione.

Campi:
- `titolo` (string, obbligatorio)
- `slug` (slug)
- `edizioneRif` (reference → `edizioneImaginarium`, obbligatorio)
- `compagnia` (object):
  - `nome` (string, obbligatorio)
  - `eCaraval` (boolean) — flag spettacoli di Caraval
  - `eOfficina` (boolean) — flag spettacoli dell'Officina
  - `urlSitoCompagnia` (url, opz.)
  - `descrizioneCompagniaBreve` (text, opz.)
- `dataInizio` (datetime, obbligatorio)
- `luogo` (object stesso di `evento.luogo`)
- `descrizione` (block content, obbligatorio)
- `immagineCover` (image obbligatoria)
- `gallery` (array of image)
- `cast` (text libero)
- `comeParteciapare` (object stesso di `evento.comeParteciapare`)
- `noteSpeciali` (text, opz.)

## Schema 5 — `corso`

Pagina Formazione. Non ha URL singolo ma è elencato in `/formazione`.

Campi:
- `titolo` (string, obbligatorio)
- `slug` (opz., per uso futuro)
- `target` (enum: `adulti` / `bambini` / `adolescenti` / `professionisti`, obbligatorio)
- `descrizione` (block content, obbligatorio)
- `immagineCover` (image, opz.)
- `dataInizio` (date, opz.)
- `dataFine` (date, opz.)
- `frequenza` (string, opz.)
- `sede` (string, opz.)
- `costoVisibile` (boolean, default `false`)
- `costo` (string, opz., visibile solo se `costoVisibile = true`)
- `attivo` (boolean, default `true`)
- `spettacoloFinaleRif` (reference → `spettacoloImaginarium`, opz., per loop formativo)

## Schema 6 — `membro`

Persone della compagnia. Mostrate in pagina Chi Siamo.

Campi:
- `nome` (string, obbligatorio)
- `slug` (opz.)
- `ruoli` (array of string, obbligatorio, es. ["Regia", "Attrice"])
- `bio` (text, **opzionale** — Vera ha detto che non vuole bio elaborate, solo foto + nome + ruolo)
- `foto` (image, obbligatorio con alt)
- `ordinamento` (number, obbligatorio, per controllare ordine)

## Schema 7 — `paginaInfo` (singleton-like)

Pagine statiche con editing minimo. Crea due singleton:
- `paginaChiSiamo`
- `paginaOspita`

Campi (uguali per entrambi):
- `titolo` (string, obbligatorio)
- `heroImmagine` (image, opz.)
- `corpoTesto` (block content, obbligatorio)
- `seoTitle` (string, opz.)
- `seoDescription` (text, opz.)

## Schema 8 — `impostazioniSito` (singleton globale)

Pannello di controllo del sito. Singolo documento.

Campi:
- `homepageHero` (object):
  - `titoloPrincipale` (string)
  - `sottotitolo` (text)
  - `immagineHero` (image)
  - `videoHero` (file, opz.)
  - `ctaPrincipale` (object: `testo`, `link`)
- `homepageBlocchi` (object):
  - `mostraProssimiEventi` (boolean, default `true`)
  - `numeroProssimiEventi` (number, default 4)
  - `spettacoliInEvidenza` (array di reference → `spettacolo`, max 3)
  - `mostraTeaserImaginarium` (boolean, default `true`)
  - `mostraTeaserOspita` (boolean, default `true`)
- `contattiPubblici` (object):
  - `email` (string)
  - `telefono` (string)
  - `telefonoVeraDiretto` (string)
- `socialLinks` (array of object):
  - `piattaforma` (enum: `instagram` / `facebook` / `youtube` / `tiktok`)
  - `url` (url)
  - `mostraInHeader` (boolean)
  - `mostraInFooter` (boolean)
- `datiAssociazione` (object):
  - `ragioneSociale` (string)
  - `partitaIva` (string)
  - `codiceFiscale` (string)
  - `indirizzo` (string)
  - `citta` (string)
  - `cap` (string)
  - `provincia` (string)
  - `pec` (string)
  - `sdi` (string)
- `seoDefault` (object):
  - `defaultTitle` (string)
  - `defaultDescription` (text)
  - `defaultOgImage` (image)

---

# DATI INIZIALI DA INSERIRE NELLE IMPOSTAZIONI SITO

Pre-popola il singleton `impostazioniSito` con questi dati:

**Contatti:**
- Email: `caravalspettacoli@gmail.com` (placeholder per ora, useranno questa)
- Telefono associativo: `+39 379 149 7805`
- Telefono Vera (formazione): `+39 348 9143189`

**Dati associazione:**
- Ragione sociale: `Caraval Associazione Culturale`
- P.IVA / CF: `01720800190`
- Indirizzo: `Via Borgo San Martino 8`
- Città: `Soncino`
- CAP: `26029`
- Provincia: `CR`
- PEC: `caravalspettacoli@pec.it`
- SDI: `SU9YNJA`

**Hero homepage iniziale:**
- Titolo: `Caraval Spettacoli`
- Sottotitolo: `Una compagnia teatrale di Soncino. Facciamo prosa, teatro di strada e spettacoli di fuoco. Ogni estate, nei borghi della media pianura, c'è Imaginarium.`
- CTA: testo `Prossimi spettacoli`, link `#prossimi-spettacoli`

---

# FILE CLAUDE.md DA CREARE

Crea il file `CLAUDE.md` nella root del progetto, scritto in italiano, contenente:

1. **Header**: nome progetto, descrizione, link al repository GitHub
2. **Sezione Strategia**: positioning, TOV, audience (sintesi)
3. **Sezione Tecnica**: stack, struttura cartelle, comandi principali
4. **Sezione Stato Progetto**: cosa è fatto e cosa manca (todolist)
5. **Sezione Convenzioni**: naming files, componenti, commit messages
6. **Sezione Sanity**: come gestire i contenuti, slug rules
7. **Sezione Deploy**: workflow Vercel, gestione environments

Questo file servirà come "memoria" per le sessioni Claude Code future. Tienilo aggiornato a fine sessione.

---

# WORKFLOW DI LAVORO

1. **Inizia con un piano** (Plan Mode): mostrami cosa farai prima di farlo
2. **Esegui in batch**: configurazioni in parallelo dove possibile
3. **Verifica ogni passo**: dopo ogni installazione, controlla che funzioni
4. **Commit frequenti**: usa commit message descrittivi (es. `feat: add Sanity schemas for spettacolo and evento`)
5. **Aggiorna CLAUDE.md** alla fine della sessione con tutto quello che hai fatto
6. **Test finale**: `npm run dev` deve mostrare:
   - Homepage funzionante in `localhost:3000`
   - Sanity Studio accessibile in `localhost:3000/studio`
   - Lista degli 8 schemi visibile nello Studio

---

# RICHIESTA DI INFORMAZIONI ALL'UTENTE

Durante l'esecuzione, l'utente (Edo) dovrà:
1. Fare login su Sanity dal terminale (`sanity login`) — chiediglielo quando serve
2. Fare login su Vercel dal terminale (`vercel login`) — chiediglielo quando serve
3. Confermare i prompt di configurazione (es. nome progetto Sanity, dataset name)

Per Sanity, suggerisci come **project name**: `Caraval Spettacoli` e come **dataset**: `production`.

Per Vercel, il progetto si chiamerà `caraval-spettacoli`.

---

# ULTIMA NOTA — COSA NON FARE

- **Non creare il design vero**: questa sessione è solo setup. Le pagine devono essere skeleton placeholder.
- **Non popolare i contenuti reali in Sanity** (foto spettacoli, descrizioni). Lascia il database vuoto o con 1-2 esempi minimi solo per validare lo stack.
- **Non scrivere CSS personalizzato pesante**: per ora usa Tailwind base + variabili CSS. Il vero design system arriverà in sessione 2.
- **Non installare librerie non richieste**: stick to the stack.

---

# PARTI

Quando sei pronto, mostra il tuo piano dettagliato e poi parti. Ricorda: l'obiettivo è una **base tecnica solida e funzionante** su cui costruiremo le sessioni 2, 3, 4...

Vai.
