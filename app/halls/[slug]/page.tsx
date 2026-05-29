// ---------------------------------------------------------------------------
// Cal Eats — Hall Detail page (Phase 5.2)
//
// Server Component: replaces mock data with real Supabase data.
//   • Hall status — from getCachedHallsAndHours() + computeHallStatus()
//   • Menu items — from getMenuData() (3–4 parallel fetches, each cached 1hr)
//
// No backend changes — uses the existing data layer as-is.
// ---------------------------------------------------------------------------

import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import {
  getCachedHallsAndHours,
  computeHallStatus,
  getPacificNow,
} from '@/app/_lib/data/halls'
import {
  getMenuData,
  getTodayPacific,
  type ApiMenuResponse,
} from '@/app/_lib/data/menus'
import HallDetailClient from './_components/HallDetailClient'
import type { MockHall, MockMealPeriod, MockMenuSection, MockMenuItem } from '@/app/_lib/data/mock-halls'

// ---------------------------------------------------------------------------
// Static metadata that isn't stored in the DB
// ---------------------------------------------------------------------------

const HALL_LOCATIONS: Record<string, string> = {
  'cafe-3':           'Hearst & Euclid Ave',
  'crossroads':       'Unit 1, Northside',
  'foothill':         'Foothill / Stern Hall',
  'clark-kerr':       'Clark Kerr Campus',
  'golden-bear-cafe': 'MLK Student Union',
  'browns':           'Bancroft Way',
  'student-union':    'MLK Student Union',
}

// Meal periods to request per hall type.
// Only the 4 dining commons are scraped; restaurants show empty state.
const COMMONS_PERIODS = ['breakfast', 'lunch', 'dinner'] as const
const RESTAURANT_PERIODS = ['all-day'] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** "breakfast" → "Breakfast", "all-day" → "All Day" */
function toMealLabel(raw: string): MockMealPeriod['period'] {
  if (raw === 'all-day') return 'All Day'
  return (raw.charAt(0).toUpperCase() + raw.slice(1)) as MockMealPeriod['period']
}

/** Extract a closes-at label from the status nextEvent */
function extractClosesAt(
  status: ReturnType<typeof computeHallStatus>
): string | null {
  if (status.status === 'open' && status.nextEvent?.type === 'closes') {
    // nextEvent.label is e.g. "Closes at 2:00 PM" — strip the prefix
    return status.nextEvent.label.replace('Closes at ', '')
  }
  return null
}

/** Transform an API response into a MockMealPeriod, or null if no data. */
function toMealPeriod(resp: ApiMenuResponse): MockMealPeriod | null {
  if (resp.status === 'unavailable' || resp.sections.length === 0) return null

  const sections: MockMenuSection[] = resp.sections.map((s) => ({
    name: s.name,
    items: s.items.map(
      (item): MockMenuItem => ({
        name:             item.name,
        // Cast is safe — scraper normalises to the same string values
        dietaryLabels:    item.dietaryLabels as MockMenuItem['dietaryLabels'],
        allergens:        item.allergens     as MockMenuItem['allergens'],
        carbonFootprint:  item.carbonFootprint,
      })
    ),
  }))

  return { period: toMealLabel(resp.mealPeriod), sections }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HallDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // ── Signal dynamic rendering — page uses current time for open/closed status
  await connection()

  // ── Hall existence + status ──────────────────────────────────────────────
  const allHalls = await getCachedHallsAndHours()
  const hallRow  = allHalls.find((h) => h.slug === slug)
  if (!hallRow) notFound()

  const { dayOfWeek, hour, minute } = getPacificNow()
  const todayHours = hallRow.hours.filter((h) => h.day_of_week === dayOfWeek)
  const hallStatus = computeHallStatus(todayHours, hour, minute)

  // ── Menu data (parallel fetch, each cached 1 hr) ─────────────────────────
  const today      = getTodayPacific()
  const isCommons  = hallRow.type === 'commons'
  const periods    = isCommons ? COMMONS_PERIODS : RESTAURANT_PERIODS

  const responses = await Promise.all(
    periods.map((p) => getMenuData(slug, today, p))
  )

  // Build meals array — only include periods that have real data
  let meals: MockMealPeriod[] = responses
    .map(toMealPeriod)
    .filter((m): m is MockMealPeriod => m !== null)

  // ── Graceful empty state — always show correct tab structure ─────────────
  // If today's scrape hasn't run yet (or hall is restaurant with no data),
  // still show the right tabs but each section list will be empty.
  if (meals.length === 0) {
    meals = periods.map((p) => ({ period: toMealLabel(p), sections: [] }))
  }

  // ── Resolve default tab (active meal period) ─────────────────────────────
  const currentPeriod = hallStatus.currentMeal
    ? toMealLabel(hallStatus.currentMeal)
    : meals[0]?.period ?? null

  // ── Assemble hall object (reusing the client component's expected shape) ──
  const hall: MockHall = {
    slug,
    name:          hallRow.name,
    location:      HALL_LOCATIONS[slug] ?? '',
    type:          isCommons ? 'commons' : 'restaurant',
    isOpen:        hallStatus.status === 'open',
    currentPeriod,
    closesAt:      extractClosesAt(hallStatus),
    meals,
  }

  return <HallDetailClient hall={hall} />
}
