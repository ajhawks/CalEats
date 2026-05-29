// ---------------------------------------------------------------------------
// Cal Eats — Scrape schedule orchestrator
//
// Runs the full daily ingestion: all SCRAPE_TARGETS × one date.
// Calls scrapeMenu() and writeMenuResult() from the existing scraper module.
// Executes targets with bounded parallelism to avoid flooding Berkeley Dining.
// ---------------------------------------------------------------------------

import { revalidateTag } from 'next/cache'
import { scrapeMenu } from './scraper'
import { writeMenuResult } from './db-write'
import { SCRAPE_TARGETS } from './constants'

export interface ScrapeResultEntry {
  hall:   string
  meal:   string
  status: 'success' | 'unavailable' | 'error'
  items:  number
  error?: string
}

export interface ScheduleRunSummary {
  date:        string
  duration_ms: number
  results:     ScrapeResultEntry[]
  summary: {
    success:     number
    unavailable: number
    error:       number
  }
}

/** Maximum number of concurrent scrape requests to Berkeley Dining */
const CONCURRENCY = 4

/**
 * Run the full ingestion for all SCRAPE_TARGETS on a given date.
 *
 * @param date   ISO date string (e.g. "2026-05-27"). Defaults to today.
 * @param dryRun If true, fetch+parse but do NOT write to Supabase.
 */
export async function runSchedule(
  date?: string,
  dryRun = false
): Promise<ScheduleRunSummary> {
  const targetDate =
    date ?? new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })

  const startMs = Date.now()

  // Flatten targets into individual (hall, meal) pairs
  const pairs = SCRAPE_TARGETS.flatMap(({ hall, meals }) =>
    meals.map((meal) => ({ hall, meal }))
  )

  const results: ScrapeResultEntry[] = []

  // Process in batches of CONCURRENCY
  for (let i = 0; i < pairs.length; i += CONCURRENCY) {
    const batch = pairs.slice(i, i + CONCURRENCY)

    const batchResults = await Promise.all(
      batch.map(async ({ hall, meal }): Promise<ScrapeResultEntry> => {
        try {
          const menuResult = await scrapeMenu(hall, meal, targetDate)

          if (!dryRun) {
            await writeMenuResult(menuResult)
            // Bust the Next.js menu cache so the freshly ingested data is
            // visible immediately — don't wait for the 1-hour TTL to expire.
            if (menuResult.status === 'success') {
              // Second arg matches cacheLife('hours') used in getMenuData()
              revalidateTag(`menu:${hall}:${targetDate}:${meal}`, 'hours')
            }
          }

          return {
            hall,
            meal,
            status: menuResult.status === 'success' ? 'success' : 'unavailable',
            items:  menuResult.sections.reduce((n, s) => n + s.items.length, 0),
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.error(`[schedule] Error scraping ${hall}/${meal}:`, message)
          return { hall, meal, status: 'error', items: 0, error: message }
        }
      })
    )

    results.push(...batchResults)
  }

  const duration_ms = Date.now() - startMs

  return {
    date: targetDate,
    duration_ms,
    results,
    summary: {
      success:     results.filter((r) => r.status === 'success').length,
      unavailable: results.filter((r) => r.status === 'unavailable').length,
      error:       results.filter((r) => r.status === 'error').length,
    },
  }
}
