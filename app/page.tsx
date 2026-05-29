// ---------------------------------------------------------------------------
// Cal Eats — Home / Today page (Phase 5.1)
//
// Server Component: reads real hall + hours data from Supabase via the
// existing data layer (same functions that power GET /api/halls).
// Open/closed status is computed fresh every request — never cached.
// ---------------------------------------------------------------------------

import Link from 'next/link'
import { connection } from 'next/server'
import {
  getCachedHallsAndHours,
  computeHallStatus,
  getPacificNow,
  type HallStatus,
} from './_lib/data/halls'
import { getCurrentMealPeriod } from './_lib/data/menus'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HallCard {
  slug: string
  name: string
  type: string
  status: HallStatus['status']
  currentMeal: string | null
  nextEvent: HallStatus['nextEvent']
}

// ---------------------------------------------------------------------------
// Sub-components (server-safe, no state)
// ---------------------------------------------------------------------------

const STATUS_META = {
  open:   { badge: 'bg-green-50 text-green-700',   dot: 'bg-green-500',  label: 'Open' },
  closed: { badge: 'bg-gray-100 text-gray-400',    dot: 'bg-gray-400',   label: 'Closed' },
  soon:   { badge: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-400',  label: 'Opening Soon' },
}

function StatusBadge({ status }: { status: HallCard['status'] }) {
  const meta = STATUS_META[status]
  return (
    <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.badge}`}>
      {meta.label}
    </span>
  )
}

function HallListCard({ slug, name, type, status, currentMeal, nextEvent }: HallCard) {
  const isCommons = type === 'commons'

  // Sub-line: what to show beneath the name
  let subLine: string
  if (status === 'open' && currentMeal) {
    const meal = currentMeal.charAt(0).toUpperCase() + currentMeal.slice(1)
    subLine = nextEvent
      ? `Serving ${meal} · ${nextEvent.label}`
      : `Serving ${meal}`
  } else if (nextEvent) {
    subLine = nextEvent.label
  } else {
    subLine = isCommons ? 'No more meals today' : 'Closed for the day'
  }

  return (
    <Link
      href={`/halls/${slug}`}
      className={`flex items-center justify-between rounded-2xl border bg-white shadow-sm px-4 py-3.5 transition-colors active:bg-gray-50 ${
        status === 'closed' ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`shrink-0 w-2.5 h-2.5 rounded-full ${STATUS_META[status].dot}`}
        />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{subLine}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <StatusBadge status={status} />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-gray-300">
          <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TodayPage() {
  // ── Signal dynamic rendering — page uses current time for open/closed status
  await connection()

  // ── Fetch halls + hours (cached daily) ──────────────────────────────────
  const hallsData = await getCachedHallsAndHours()

  // ── Runtime: current Pacific time — must stay outside cache ─────────────
  const { dayOfWeek, hour, minute } = getPacificNow()
  const rawMealPeriod = getCurrentMealPeriod()
  const mealPeriodLabel = rawMealPeriod.charAt(0).toUpperCase() + rawMealPeriod.slice(1)

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    timeZone: 'America/Los_Angeles',
  }).format(new Date())

  // ── Compute per-hall status ──────────────────────────────────────────────
  const halls: HallCard[] = hallsData.map((hall) => {
    const todayHours = hall.hours.filter((h) => h.day_of_week === dayOfWeek)
    const { status, currentMeal, nextEvent } = computeHallStatus(todayHours, hour, minute)
    return { slug: hall.slug, name: hall.name, type: hall.type, status, currentMeal, nextEvent }
  })

  if (halls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-center px-6">
        <p className="text-4xl">🍽️</p>
        <p className="font-semibold text-gray-700">No dining halls found</p>
        <p className="text-sm text-gray-400">
          Make sure the database is seeded with dining hall records.
        </p>
      </div>
    )
  }

  const commons     = halls.filter((h) => h.type === 'commons')
  const restaurants = halls.filter((h) => h.type !== 'commons')
  const openCount   = halls.filter((h) => h.status === 'open').length

  return (
    <div className="px-4 py-5 space-y-5">

      {/* ── Date + meal period header ── */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          {dateLabel}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">{mealPeriodLabel}</h2>
      </div>

      {/* ── Open now strip ── */}
      <div
        className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${
          openCount > 0
            ? 'bg-green-50 text-green-800'
            : 'bg-gray-50 text-gray-500'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            openCount > 0 ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        {openCount > 0
          ? `${openCount} location${openCount > 1 ? 's' : ''} open right now`
          : 'All locations are closed right now'}
      </div>

      {/* ── Dining commons ── */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-1">
          Dining Commons
        </h3>
        {commons.map((hall) => (
          <HallListCard key={hall.slug} {...hall} />
        ))}
      </section>

      {/* ── Campus restaurants ── */}
      {restaurants.length > 0 && (
        <section className="space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-1">
            Campus Restaurants
          </h3>
          {restaurants.map((hall) => (
            <HallListCard key={hall.slug} {...hall} />
          ))}
        </section>
      )}
    </div>
  )
}
