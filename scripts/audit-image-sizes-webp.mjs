/* eslint-disable */
/** Audit con Accept header browser-realistic (image/webp,image/avif).
 *  Mostra il peso effettivamente servito al browser moderno. */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const get = (k) => env.split('\n').find((l) => l.startsWith(k + '='))?.split('=')[1]?.replace(/["']/g, '').trim()

const client = createClient({
  projectId: get('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: get('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const assets = await client.fetch(
  `*[_type == "sanity.imageAsset" && size > 500000]{
    _id, originalFilename, size, url
  } | order(size desc)`
)

function fmt(n) {
  if (n > 1e6) return (n / 1e6).toFixed(2) + ' MB'
  if (n > 1e3) return (n / 1e3).toFixed(0) + ' KB'
  return n + ' B'
}

const BROWSER_HEADERS = {
  Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
}

async function headWithBrowser(url) {
  try {
    const r = await fetch(url, { method: 'GET', headers: BROWSER_HEADERS })
    const cl = r.headers.get('content-length')
    const ct = r.headers.get('content-type')
    // Consume body to free socket
    await r.arrayBuffer()
    return { bytes: cl ? parseInt(cl, 10) : null, contentType: ct }
  } catch (e) {
    return { bytes: null, contentType: null, error: e.message }
  }
}

console.log(`\n========== Audit pesi serviti a browser moderno (${assets.length} asset > 500 KB) ==========\n`)
console.log(`URL: ?w=1920&q=80&auto=format`)
console.log(`Accept: image/avif,image/webp,image/apng,*/*\n`)
console.log(`  ${'ORIG'.padStart(8)}  ${'WEBP/AVIF'.padStart(10)}  ${'RATIO'.padStart(6)}  ${'CTYPE'.padEnd(12)}  FILENAME`)
console.log(`  ${'─'.repeat(8)}  ${'─'.repeat(10)}  ${'─'.repeat(6)}  ${'─'.repeat(12)}  ${'─'.repeat(40)}`)

let totalOrig = 0, totalServed = 0

for (const a of assets) {
  const optimizedUrl = `${a.url}?w=1920&q=80&auto=format`
  const r = await headWithBrowser(optimizedUrl)
  const orig = a.size ?? 0
  const served = r.bytes ?? 0
  const ratio = served && orig ? `${Math.round((served / orig) * 100)}%` : '?'
  totalOrig += orig
  totalServed += served
  console.log(
    `  ${fmt(orig).padStart(8)}  ${fmt(served).padStart(10)}  ${ratio.padStart(6)}  ${(r.contentType ?? '?').padEnd(12)}  ${a.originalFilename}`
  )
}

console.log(`\n  ${'─'.repeat(8)}  ${'─'.repeat(10)}`)
console.log(
  `  ${fmt(totalOrig).padStart(8)}  ${fmt(totalServed).padStart(10)}  TOTALE`
)
console.log(`\n  Riduzione media: ${
  totalOrig ? Math.round((1 - totalServed / totalOrig) * 100) : 0
}%`)
console.log(`  Risparmio: ${fmt(totalOrig - totalServed)}\n`)
