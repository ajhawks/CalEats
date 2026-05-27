// ---------------------------------------------------------------------------
// Cal Eats — GET /api/halls
//
// Returns all dining halls with real-time open/closed/soon status.
//
// The hall+hours data is cached (changes once per semester).
// Status computation happens at request time — uses current Pacific clock.
// No query params — always returns the full list.
// ---------------------------------------------------------------------------

import {
  getCachedHallsAndHours,
  computeHallStatus,
  getPacificNow,
} from '../../_lib/data/halls'

export async function GET() {
  // Cached DB read — cheap on repeated calls
  const halls = await getCachedHallsAndHours()

  // Runtime: current Pacific time (must NOT be cached)
  const { dayOfWeek, hour, minute } = getPacificNow()

  const response = halls.map((hall) => {
    // Filter hours to today only before passing to status function
    const todayHours = hall.hours.filter((h) => h.day_of_week === dayOfWeek)
    const status = computeHallStatus(todayHours, hour, minute)

    return {
      slug:        hall.slug,
      name:        hall.name,
      type:        hall.type,
      status:      status.status,
      currentMeal: status.currentMeal,
      nextEvent:   status.nextEvent,
    }
  })

  return Response.json(response)
}
