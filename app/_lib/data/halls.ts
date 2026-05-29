// ---------------------------------------------------------------------------
// Cal Eats — Halls data layer
//
// getCachedHallsAndHours()  — cached DB read (halls + operating hours)
// computeHallStatus()       — pure function, uses current Pacific time
// getPacificNow()           — extract Pacific time components from Date
// ---------------------------------------------------------------------------

import { cacheLife, cacheTag } from 'next/cache'
import { getSupabasePublicClient } from '../supabase/client'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OperatingHour {
  meal_period: string  // 'breakfast' | 'lunch' | 'dinner' | 'all-day'
  opens_at:   string   // Postgres time: "07:00:00"
  closes_at:  string   // Postgres time: "10:00:00"
  day_of_week: number  // 0=Sun … 6=Sat
}

export interface HallRow {
  slug: string
  name: string
  type: string
  hours: OperatingHour[]  // all days for this hall
}

export interface NextEvent {
  type:  'opens' | 'closes'
  at:    string   // "HH:MM" 24h  e.g. "15:00"
  label: string   // human-readable e.g. "Closes at 3:00 PM"
}

export interface HallStatus {
  status:      'open' | 'closed' | 'soon'
  currentMeal: string | null  // e.g. "lunch" if open
  nextEvent:   NextEvent | null
}

export interface ApiHallResponse extends HallRow, HallStatus {}

// Minutes until a "soon" banner shows before opening
const SOON_THRESHOLD_MINUTES = 30

// ---------------------------------------------------------------------------
// Time utilities
// ---------------------------------------------------------------------------

/** Convert Postgres time string "HH:MM:SS" → minutes since midnight */
function pgTimeToMinutes(pgTime: string): number {
  const [h, m] = pgTime.split(':').map(Number)
  return h * 60 + m
}

/** Format Postgres time "HH:MM:SS" → "7:00 AM" / "3:00 PM" */
function formatPgTime(pgTime: string): string {
  const [h, m] = pgTime.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 || 12
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
}

/** Extract Pacific time components from a Date (works regardless of server TZ) */
export function getPacificNow(date: Date = new Date()): {
  dayOfWeek: number
  hour:      number
  minute:    number
} {
  // toLocaleString returns a locale-formatted string in the given timezone.
  // Parsing it back gives a Date in local server time whose H/M/DOW match PT.
  const ptString = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  const ptDate = new Date(ptString)
  return {
    dayOfWeek: ptDate.getDay(),
    hour:      ptDate.getHours(),
    minute:    ptDate.getMinutes(),
  }
}

// ---------------------------------------------------------------------------
// Status computation  (pure — no I/O)
// ---------------------------------------------------------------------------

/**
 * Given a hall's hours for today and the current Pacific time, compute:
 *   status       — "open" | "closed" | "soon"
 *   currentMeal  — which meal is active right now (or null)
 *   nextEvent    — next open/close action (or null if no more events today)
 */
export function computeHallStatus(
  todayHours: OperatingHour[],
  hour: number,
  minute: number
): HallStatus {
  if (todayHours.length === 0) {
    return { status: 'closed', currentMeal: null, nextEvent: null }
  }

  const currentMinutes = hour * 60 + minute

  // ── 1. Is a meal currently open? ────────────────────────────────────────
  for (const h of todayHours) {
    const opens  = pgTimeToMinutes(h.opens_at)
    const closes = pgTimeToMinutes(h.closes_at)

    if (currentMinutes >= opens && currentMinutes < closes) {
      return {
        status:      'open',
        currentMeal: h.meal_period,
        nextEvent: {
          type:  'closes',
          at:    h.closes_at.slice(0, 5),     // "HH:MM"
          label: `Closes at ${formatPgTime(h.closes_at)}`,
        },
      }
    }
  }

  // ── 2. Is a meal opening soon (within threshold)? ────────────────────────
  const upcoming = todayHours
    .map((h) => ({ ...h, opensAt: pgTimeToMinutes(h.opens_at) }))
    .filter((h) => h.opensAt > currentMinutes)
    .sort((a, b) => a.opensAt - b.opensAt)

  if (upcoming.length === 0) {
    // No more meals today
    return { status: 'closed', currentMeal: null, nextEvent: null }
  }

  const next = upcoming[0]
  const minutesUntilOpen = next.opensAt - currentMinutes

  if (minutesUntilOpen <= SOON_THRESHOLD_MINUTES) {
    return {
      status:      'soon',
      currentMeal: null,
      nextEvent: {
        type:  'opens',
        at:    next.opens_at.slice(0, 5),
        label: `Opens at ${formatPgTime(next.opens_at)}`,
      },
    }
  }

  // ── 3. Closed — show when next meal opens ────────────────────────────────
  return {
    status:      'closed',
    currentMeal: null,
    nextEvent: {
      type:  'opens',
      at:    next.opens_at.slice(0, 5),
      label: `Opens at ${formatPgTime(next.opens_at)}`,
    },
  }
}

// ---------------------------------------------------------------------------
// Cached DB read  — hours data changes at most once per semester
// ---------------------------------------------------------------------------

/**
 * Fetch all dining halls and their complete operating_hours from Supabase.
 * Cached for 24 hours — schedules change at most once per semester.
 *
 * Optimised: was 3 queries (dining_halls twice + operating_hours once).
 * Now 2 queries: dining_halls once (with id) + operating_hours once.
 */
export async function getCachedHallsAndHours(): Promise<HallRow[]> {
  'use cache'
  cacheLife('days')
  cacheTag('halls-and-hours')

  const db = getSupabasePublicClient()

  // Single query — include id so we can join with operating_hours client-side
  const { data: halls, error: hallErr } = await db
    .from('dining_halls')
    .select('id, slug, name, type')
    .order('name')

  if (hallErr || !halls) return []

  // Fetch all operating hours in one query
  const { data: allHours, error: hoursErr } = await db
    .from('operating_hours')
    .select('hall_id, day_of_week, meal_period, opens_at, closes_at')

  if (hoursErr) return []

  // Build map: hall_id → OperatingHour[]
  const hoursByHall = new Map<string, OperatingHour[]>()
  for (const row of allHours ?? []) {
    if (!hoursByHall.has(row.hall_id)) hoursByHall.set(row.hall_id, [])
    hoursByHall.get(row.hall_id)!.push({
      meal_period: row.meal_period,
      opens_at:    row.opens_at,
      closes_at:   row.closes_at,
      day_of_week: row.day_of_week,
    })
  }

  // Join halls with their hours using the id we already have — no second query
  return halls.map((hall) => ({
    slug:  hall.slug,
    name:  hall.name,
    type:  hall.type,
    hours: hoursByHall.get(hall.id) ?? [],
  }))
}
