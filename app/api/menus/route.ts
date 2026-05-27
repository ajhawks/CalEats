// ---------------------------------------------------------------------------
// Cal Eats — GET /api/menus
//
// Query params:
//   hall   (required) — dining hall slug, e.g. "crossroads"
//   date   (optional) — ISO date YYYY-MM-DD, defaults to today (Pacific time)
//   meal   (optional) — "breakfast" | "lunch" | "dinner" | "all-day"
//                       auto-detected from Pacific time if omitted
//
// This handler is intentionally thin. All query logic lives in _lib/data/menus.ts
// ---------------------------------------------------------------------------

import type { NextRequest } from 'next/server'
import {
  getMenuData,
  getCurrentMealPeriod,
  getTodayPacific,
} from '../../_lib/data/menus'

const VALID_HALLS = new Set([
  'cafe-3',
  'crossroads',
  'foothill',
  'clark-kerr',
  'golden-bear-cafe',
  'browns',
  'student-union',
])

const VALID_MEALS = new Set(['breakfast', 'lunch', 'dinner', 'all-day'])

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  // ── Validate required params ─────────────────────────────────────────────
  const hall = params.get('hall')?.toLowerCase().trim()
  if (!hall) {
    return Response.json(
      { error: 'Missing required query param: hall' },
      { status: 400 }
    )
  }
  if (!VALID_HALLS.has(hall)) {
    return Response.json(
      {
        error: `Unknown hall: "${hall}"`,
        validHalls: [...VALID_HALLS],
      },
      { status: 400 }
    )
  }

  // ── Resolve date ─────────────────────────────────────────────────────────
  const rawDate = params.get('date')?.trim()
  let date: string

  if (!rawDate || rawDate === 'today') {
    date = getTodayPacific()
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    date = rawDate
  } else {
    return Response.json(
      { error: 'Invalid date format. Use YYYY-MM-DD or omit for today.' },
      { status: 400 }
    )
  }

  // ── Resolve meal period ───────────────────────────────────────────────────
  const rawMeal = params.get('meal')?.toLowerCase().trim()
  let meal: string

  if (!rawMeal) {
    meal = getCurrentMealPeriod()
  } else if (VALID_MEALS.has(rawMeal)) {
    meal = rawMeal
  } else {
    return Response.json(
      {
        error: `Unknown meal: "${rawMeal}"`,
        validMeals: [...VALID_MEALS],
      },
      { status: 400 }
    )
  }

  // ── Fetch (cached) data ──────────────────────────────────────────────────
  const data = await getMenuData(hall, date, meal)
  return Response.json(data)
}
