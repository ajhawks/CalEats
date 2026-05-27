// ---------------------------------------------------------------------------
// Cal Eats — Full ingestion pipeline script
//
// Runs fetch → parse → DB write for one hall + meal + date.
// Reads SUPABASE_* env vars from .env.local via dotenv.
//
// Usage:
//   npx tsx scripts/ingest.ts
//   npx tsx scripts/ingest.ts --hall crossroads --meal lunch --date 2026-05-27
//   npx tsx scripts/ingest.ts --dry-run   # fetch + parse only, no DB write
// ---------------------------------------------------------------------------

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local before anything else
config({ path: resolve(process.cwd(), '.env.local') })

import { scrapeMenu } from '../app/_lib/scraper/scraper'
import { writeMenuResult } from '../app/_lib/scraper/db-write'

// Parse CLI flags
const args = process.argv.slice(2)
function getFlag(flag: string, fallback: string) {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const HALL      = getFlag('--hall', 'crossroads')
const MEAL      = getFlag('--meal', 'lunch')
const DATE      = getFlag('--date', new Date().toISOString().split('T')[0])
const DRY_RUN   = args.includes('--dry-run')

async function main() {
  console.log('\nCal Eats — Ingestion pipeline')
  console.log(`Hall: ${HALL} | Meal: ${MEAL} | Date: ${DATE}`)
  if (DRY_RUN) console.log('Mode: DRY RUN (no DB writes)')
  console.log('-'.repeat(60))

  // Step 1+2+3: Fetch and parse
  const result = await scrapeMenu(HALL, MEAL, DATE)

  if (result.status === 'unavailable') {
    console.log('⚠️  Menu unavailable for this hall/meal/date combination.')
    if (!DRY_RUN) {
      // Still log the unavailable status to DB
      const count = await writeMenuResult(result)
      console.log(`Logged 'unavailable' status to scrape_log (${count} items).`)
    }
    return
  }

  const totalItems = result.sections.reduce((n, s) => n + s.items.length, 0)
  console.log(
    `✅ Parsed: ${result.sections.length} sections, ${totalItems} items`
  )
  console.log('\nParsed JSON:')
  console.log(JSON.stringify(result, null, 2))

  if (DRY_RUN) {
    console.log('\n[dry-run] Skipping DB write.')
    return
  }

  // Step 4: Write to Supabase
  console.log('\n' + '-'.repeat(60))
  console.log('Writing to Supabase...')
  const count = await writeMenuResult(result)
  console.log(`✅ DB write complete — ${count} items upserted, scrape_log updated.`)
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message ?? err)
  process.exit(1)
})
