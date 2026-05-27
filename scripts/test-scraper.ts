// ---------------------------------------------------------------------------
// Cal Eats — Scraper smoke test
//
// Runs the scraper for the Phase 2 target (Café 3, lunch, today) and falls
// back to Crossroads when Café 3 has no menu posted.
// Prints structured JSON to stdout — NO database writes.
//
// Usage:
//   npx tsx scripts/test-scraper.ts
//   npx tsx scripts/test-scraper.ts --hall crossroads --meal lunch
// ---------------------------------------------------------------------------

import { scrapeMenu } from '../app/_lib/scraper/scraper'
import type { MenuResult } from '../app/_lib/scraper/types'

// Parse simple CLI flags
const args = process.argv.slice(2)
function getFlag(flag: string, fallback: string) {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const HALL = getFlag('--hall', 'cafe-3')
const MEAL = getFlag('--meal', 'lunch')
const DATE = getFlag('--date', new Date().toISOString().split('T')[0])

function printResult(result: MenuResult) {
  console.log('\n' + '='.repeat(60))
  console.log('RESULT')
  console.log('='.repeat(60))
  console.log(JSON.stringify(result, null, 2))

  if (result.status === 'success') {
    const totalItems = result.sections.reduce((n, s) => n + s.items.length, 0)
    console.log('\n' + '-'.repeat(60))
    console.log(`✅ SUCCESS — ${result.sections.length} sections, ${totalItems} items`)
  } else {
    console.log('\n' + '-'.repeat(60))
    console.log('⚠️  Status: unavailable (menu not posted yet)')
  }
}

async function main() {
  console.log(`\nCal Eats Scraper — Phase 2 smoke test`)
  console.log(`Target: ${HALL} | ${MEAL} | ${DATE}`)
  console.log('-'.repeat(60))

  const primary = await scrapeMenu(HALL, MEAL, DATE)
  printResult(primary)

  // If primary target returned nothing, automatically demo with a
  // hall/meal that is confirmed to have data so we can verify parsing.
  if (primary.status === 'unavailable' && HALL === 'cafe-3') {
    console.log('\n' + '='.repeat(60))
    console.log('NOTE: Café 3 has no menu posted for this date.')
    console.log('Running fallback demo with Crossroads (which has data)...')
    console.log('='.repeat(60))

    const fallback = await scrapeMenu('crossroads', MEAL, DATE)
    printResult(fallback)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
