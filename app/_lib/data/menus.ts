// ---------------------------------------------------------------------------
// Cal Eats — Menu data layer
//
// All DB queries live here; the route handler stays thin.
// getMenuData() is cached with 'use cache' + cacheLife('hours') so that
// the same (hall, date, meal) triple is only fetched from Supabase once
// per hour, regardless of how many concurrent requests hit the API.
//
// IMPORTANT: 'use cache' requires cacheComponents: true in next.config.ts
// ---------------------------------------------------------------------------

import { cacheLife } from 'next/cache'
import { getSupabasePublicClient } from '../supabase/client'

// ---------------------------------------------------------------------------
// API response types (separate from scraper types)
// ---------------------------------------------------------------------------

export interface ApiMenuItem {
  name: string
  dietaryLabels: string[]
  allergens: string[]
  carbonFootprint: 'low' | 'medium' | 'high' | null
}

export interface ApiMenuSection {
  name: string
  items: ApiMenuItem[]
}

export interface ApiMenuResponse {
  hall: string
  date: string
  mealPeriod: string
  sections: ApiMenuSection[]
  lastUpdated: string | null   // ISO timestamp of most recent successful scrape
  status: 'available' | 'unavailable'
}

// ---------------------------------------------------------------------------
// Meal period auto-detection (Pacific time)
// ---------------------------------------------------------------------------

/**
 * Return the current meal period based on Pacific time.
 * Used when the caller doesn't specify ?meal= in the query.
 *
 * Approximate Berkeley Dining schedule:
 *   07:00–10:59  → breakfast
 *   11:00–15:59  → lunch
 *   16:00–23:59  → dinner
 *   00:00–06:59  → dinner  (late night / next morning treated as dinner)
 */
export function getCurrentMealPeriod(): string {
  // Build a Date string in Pacific time and parse the hour from it
  const ptString = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    hour12: false,
  })
  // ptString is like "14" for 2 PM; "00"/"24" for midnight — normalise with %
  const hour = parseInt(ptString, 10) % 24

  if (hour >= 7 && hour < 11) return 'breakfast'
  if (hour >= 11 && hour < 16) return 'lunch'
  return 'dinner'
}

/**
 * Return today's date as an ISO string (YYYY-MM-DD) in Pacific time.
 */
export function getTodayPacific(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Los_Angeles',
  })
  // en-CA locale formats as YYYY-MM-DD
}

// ---------------------------------------------------------------------------
// Cached data query
// ---------------------------------------------------------------------------

/**
 * Fetch and transform menu data for a specific hall, date, and meal period.
 *
 * Arguments become part of the cache key automatically — different
 * (hall, date, meal) triples are cached independently.
 * Cache TTL: 1 hour (menu content changes at most once daily).
 */
export async function getMenuData(
  hall: string,
  date: string,
  mealPeriod: string
): Promise<ApiMenuResponse> {
  'use cache'
  cacheLife('hours')

  const db = getSupabasePublicClient()

  // ── 1. Resolve hall_id ──────────────────────────────────────────────────
  const { data: hallRow, error: hallErr } = await db
    .from('dining_halls')
    .select('id')
    .eq('slug', hall)
    .single()

  if (hallErr || !hallRow) {
    return {
      hall,
      date,
      mealPeriod,
      sections: [],
      lastUpdated: null,
      status: 'unavailable',
    }
  }

  const hallId = hallRow.id

  // ── 2. Fetch menu items ──────────────────────────────────────────────────
  const { data: items, error: itemErr } = await db
    .from('menu_items')
    .select('section, name, dietary_labels, allergens, carbon_footprint, created_at')
    .eq('hall_id', hallId)
    .eq('served_date', date)
    .eq('meal_period', mealPeriod)
    .order('section', { ascending: true })
    .order('name',    { ascending: true })

  if (itemErr || !items || items.length === 0) {
    return {
      hall,
      date,
      mealPeriod,
      sections: [],
      lastUpdated: null,
      status: 'unavailable',
    }
  }

  // ── 3. Group rows into sections ──────────────────────────────────────────
  // Preserve the insertion order of sections by using the first-seen index
  const sectionOrder: string[] = []
  const sectionMap = new Map<string, ApiMenuItem[]>()
  let lastUpdated: string | null = null

  for (const row of items) {
    if (!sectionMap.has(row.section)) {
      sectionMap.set(row.section, [])
      sectionOrder.push(row.section)
    }

    sectionMap.get(row.section)!.push({
      name:            row.name,
      dietaryLabels:   row.dietary_labels  ?? [],
      allergens:       row.allergens       ?? [],
      carbonFootprint: row.carbon_footprint ?? null,
    })

    // Track most recent write timestamp across all rows
    if (!lastUpdated || row.created_at > lastUpdated) {
      lastUpdated = row.created_at
    }
  }

  const sections: ApiMenuSection[] = sectionOrder.map((name) => ({
    name,
    items: sectionMap.get(name)!,
  }))

  return {
    hall,
    date,
    mealPeriod,
    sections,
    lastUpdated,
    status: 'available',
  }
}
