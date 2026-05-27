// ---------------------------------------------------------------------------
// Cal Eats — Database write layer for scraped menu data
//
// Takes a parsed MenuResult and:
//   1. Upserts all items into menu_items (idempotent on re-scrape)
//   2. Writes one row to scrape_log
// ---------------------------------------------------------------------------

import { getSupabaseServiceClient } from '../supabase/server'
import type { MenuResult } from './types'

/** Look up the UUID for a hall slug — cached across calls in the same process */
const hallIdCache = new Map<string, string>()

async function getHallId(slug: string): Promise<string> {
  if (hallIdCache.has(slug)) return hallIdCache.get(slug)!

  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('dining_halls')
    .select('id')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    throw new Error(`Hall not found in DB: "${slug}". Run schema.sql seed first.`)
  }

  hallIdCache.set(slug, data.id)
  return data.id
}

/**
 * Write a scraped MenuResult to Supabase.
 * - Upserts each item (no-op if same hall+date+meal+section+name already exists)
 * - Logs the result to scrape_log
 *
 * Returns the number of items upserted.
 */
export async function writeMenuResult(result: MenuResult): Promise<number> {
  const db = getSupabaseServiceClient()
  const hallId = await getHallId(result.hall)

  // Flatten sections → items for bulk upsert
  const rows = result.sections.flatMap((section) =>
    section.items.map((item) => ({
      hall_id:          hallId,
      served_date:      result.date,
      meal_period:      result.mealPeriod,
      section:          section.name,
      name:             item.name,
      dietary_labels:   item.dietaryLabels,
      allergens:        item.allergens,
      carbon_footprint: item.carbonFootprint,
    }))
  )

  let itemCount = 0
  let errorMsg: string | null = null

  if (rows.length > 0) {
    const { error } = await db.from('menu_items').upsert(rows, {
      onConflict: 'hall_id,served_date,meal_period,section,name',
      ignoreDuplicates: false, // update existing rows (in case dietary labels changed)
    })

    if (error) {
      errorMsg = error.message
      console.error(`[db-write] Upsert failed for ${result.hall}:`, error.message)
    } else {
      itemCount = rows.length
    }
  }

  // Write scrape log entry regardless of success/failure
  const logStatus =
    errorMsg ? 'error' :
    result.status === 'success' ? 'success' :
    'unavailable'

  const { error: logError } = await db.from('scrape_log').insert({
    hall_id:     hallId,
    served_date: result.date,
    meal_period: result.mealPeriod,
    status:      logStatus,
    item_count:  itemCount,
    error_msg:   errorMsg,
  })

  if (logError) {
    // Non-fatal — just warn
    console.warn(`[db-write] Failed to write scrape_log:`, logError.message)
  }

  return itemCount
}
