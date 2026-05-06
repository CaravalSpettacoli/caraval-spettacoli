# Caraval Spettacoli — sito web

Sito istituzionale di **Caraval Associazione Culturale** (Soncino, CR) e festival **Imaginarium**.

> Per il contesto strategico, gli schemi Sanity, le convenzioni e lo stato del progetto, leggi [`CLAUDE.md`](./CLAUDE.md).

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Sanity v3 (Studio embedded a `/studio`)
- Hosting: Vercel

## Setup locale

```bash
npm install
cp .env.example .env.local   # poi compila i valori Sanity
npm run dev
```

- Sito: http://localhost:3000
- Studio CMS: http://localhost:3000/studio

## Comandi

| Comando | Descrizione |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm run lint` | Lint |
| `npm run seed` | Popola `impostazioniSito` (richiede `SANITY_API_WRITE_TOKEN`) |
