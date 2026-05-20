/* eslint-disable */
/**
 * Re-upload viaggiastorie-orizzontale.jpeg (8.5MB locale) e patcha
 * spettacolo.fotoHero. Sanity CDN comprimerà su urlFor(w=1920,q=80,auto=format).
 * Verifica peso servito via HEAD WebP.
 *
 * Esegui: node scripts/fix-viaggiastorie-foto.mjs
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
const projectId = get('NEXT_PUBLIC_SANITY_PROJECT_ID')
const dataset = get('NEXT_PUBLIC_SANITY_DATASET') || 'production'
if (!token) {
  console.error('❌ SANITY_API_WRITE_TOKEN mancante')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const SRC =
  '/Users/edoardobiondi/Desktop/SITO-CARAVAL/MATERIALE-PER-SITO/FOTO PER SITO/viaggiastorie-orizzontale.jpeg'

async function main() {
  const sp = await client.fetch(
    `*[_type == "spettacolo" && slug.current == "viaggiastorie"][0]{ _id, titolo, fotoHero }`
  )
  if (!sp) {
    console.error('❌ Spettacolo viaggiastorie non trovato')
    return
  }

  console.log(`Upload ${SRC}…`)
  const buffer = fs.readFileSync(SRC)
  const asset = await client.assets.upload('image', buffer, {
    filename: 'viaggiastorie-orizzontale.jpeg',
  })
  console.log(`  ✓ asset: ${asset._id} (${Math.round(asset.size / 1024)}KB)`)

  await client
    .patch(sp._id)
    .set({
      fotoHero: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: 'I Viaggiastorie — teatro di strada Caraval',
      },
    })
    .commit()
  console.log('  ✓ fotoHero collegato a asset orizzontale 1920w corretto')

  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset._id.replace('image-', '').replace(/-([a-z]+)$/, '.$1')}`
  const cdnUrl = `${baseUrl}?w=1920&q=80&auto=format`
  console.log(`\nHEAD ${cdnUrl}`)
  try {
    const head = await fetch(cdnUrl, {
      method: 'HEAD',
      headers: { Accept: 'image/webp,image/*,*/*;q=0.8' },
    })
    const cl = head.headers.get('content-length')
    const ct = head.headers.get('content-type')
    console.log(`  status: ${head.status}`)
    console.log(`  content-type: ${ct}`)
    console.log(`  content-length: ${cl ? Math.round(+cl / 1024) + 'KB' : 'n/d'}`)
  } catch (e) {
    console.warn('  HEAD failed:', e.message)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
