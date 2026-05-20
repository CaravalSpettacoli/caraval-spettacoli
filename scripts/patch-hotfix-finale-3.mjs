/* eslint-disable */
/**
 * Hotfix Finale 3 — patch Sanity:
 *  1) paginaSpettacoliCopy.heroFotoSfondo ← fotoHero Romeo+Giulietta (se mancante)
 *  2) Ordina membri: Vera Rossini = 1, Nicola Pignoli = 3, ecc.
 *  3) Diagnosi/fix asset I Viaggiastorie (fotoHero orizzontale).
 *
 * Idempotente.
 * Esegui: node scripts/patch-hotfix-finale-3.mjs
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const get = (k) =>
  env
    .split('\n')
    .find((l) => l.startsWith(k + '='))
    ?.split('=')[1]
    ?.replace(/["']/g, '')
    .trim()

const token = get('SANITY_API_WRITE_TOKEN')
if (!token) {
  console.error('❌ SANITY_API_WRITE_TOKEN mancante in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: get('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: get('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function task1HeroSpettacoli() {
  console.log('\n[T1] paginaSpettacoliCopy.heroFotoSfondo')
  const copy = await client.fetch(
    `*[_type == "paginaSpettacoliCopy"][0]{ _id, heroFotoSfondo }`
  )
  if (!copy) {
    console.log('  ⚠ paginaSpettacoliCopy singleton non esiste — skip')
    return
  }
  if (copy.heroFotoSfondo?.asset) {
    console.log('  ✓ già popolato, skip')
    return
  }
  const romeo = await client.fetch(
    `*[_type == "spettacolo" && slug.current match "*romeo*"][0]{ titolo, slug, fotoHero }`
  )
  if (!romeo?.fotoHero?.asset?._ref) {
    console.log('  ⚠ Romeo+Giulietta fotoHero non disponibile — provo Arlecchino…')
    const fallback = await client.fetch(
      `*[_type == "spettacolo" && defined(fotoHero) && categoria == "prosa"][0]{ titolo, fotoHero }`
    )
    if (!fallback?.fotoHero?.asset?._ref) {
      console.log('  ❌ Nessuna foto disponibile — skip')
      return
    }
    await client
      .patch(copy._id)
      .set({
        heroFotoSfondo: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: fallback.fotoHero.asset._ref,
          },
          alt: `${fallback.titolo} — repertorio Caraval`,
        },
      })
      .commit()
    console.log(`  ✓ patched con fallback "${fallback.titolo}"`)
    return
  }
  await client
    .patch(copy._id)
    .set({
      heroFotoSfondo: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: romeo.fotoHero.asset._ref,
        },
        alt: 'Romeo e Giulietta — repertorio Caraval',
      },
    })
    .commit()
  console.log('  ✓ patched con Romeo+Giulietta fotoHero')
}

async function task8MembriOrdine() {
  console.log('\n[T8] ordineDisplay membri')
  const ordineCorretto = [
    { slug: 'vera-rossini', ordine: 1 },
    { slug: 'alessio-rosin', ordine: 2 },
    { slug: 'nicola-pignoli', ordine: 3 },
    { slug: 'ilaria-cavalli', ordine: 4 },
    { slug: 'aurora-rossini', ordine: 5 },
    { slug: 'francesco-trunfio', ordine: 6 },
    { slug: 'antonio-botti', ordine: 7 },
  ]

  const membri = await client.fetch(
    `*[_type == "membro"]{ _id, nome, "slug": slug.current, ordineDisplay, ordinamento }`
  )
  console.log(
    '  Membri attuali:',
    membri
      .map((m) => `${m.ordineDisplay ?? m.ordinamento ?? '?'}=${m.nome}`)
      .join(' | ')
  )

  for (const { slug, ordine } of ordineCorretto) {
    const m = membri.find(
      (x) =>
        x.slug === slug ||
        x.nome?.toLowerCase().replace(/\s+/g, '-') === slug
    )
    if (!m) {
      console.log(`  ⚠ ${slug} non trovato`)
      continue
    }
    await client
      .patch(m._id)
      .set({ ordineDisplay: ordine, ordinamento: ordine })
      .commit()
    console.log(`  ✓ ${m.nome} → ${ordine}`)
  }
}

async function task9Viaggiastorie() {
  console.log('\n[T9] I Viaggiastorie diagnosi')
  const sp = await client.fetch(
    `*[_type == "spettacolo" && slug.current match "*viaggia*"][0]{ _id, titolo, "slug": slug.current, fotoHero, immagineCover }`
  )
  if (!sp) {
    console.log('  ❌ Nessuno spettacolo "viaggia*" trovato')
    return
  }
  console.log(`  Spettacolo: ${sp.titolo} (slug=${sp.slug})`)
  console.log(`  fotoHero: ${sp.fotoHero?.asset?._ref ?? 'MANCANTE'}`)
  console.log(`  immagineCover: ${sp.immagineCover?.asset?._ref ?? 'MANCANTE'}`)

  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename match "*viaggia*"]{ _id, originalFilename, size, "kb": round(size / 1024) } | order(size desc)`
  )
  console.log('  Assets Sanity con "viaggia":')
  assets.forEach((a) =>
    console.log(`    - ${a.originalFilename} (${a.kb}KB) → ${a._id}`)
  )

  if (!sp.fotoHero?.asset?._ref) {
    const orizzontale =
      assets.find((a) => /orizz/i.test(a.originalFilename)) ||
      assets.find((a) => !/vert|anteprima/i.test(a.originalFilename))
    if (orizzontale) {
      await client
        .patch(sp._id)
        .set({
          fotoHero: {
            _type: 'image',
            asset: { _type: 'reference', _ref: orizzontale._id },
            alt: `${sp.titolo}`,
          },
        })
        .commit()
      console.log(`  ✓ collegato fotoHero ← ${orizzontale.originalFilename}`)
    } else {
      console.log('  ⚠ nessun asset orizzontale candidato')
    }
  } else {
    console.log('  ✓ fotoHero già collegata')
  }
}

async function main() {
  await task1HeroSpettacoli()
  await task8MembriOrdine()
  await task9Viaggiastorie()
  console.log('\n✅ Done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
