// ---------------------------------------------------------------------------
// Cal Eats — Menu scraper
// Fetches the AJAX menu for one (hall, meal, date) triple and returns a
// parsed MenuResult. All logic is pure functions — no side effects here.
// ---------------------------------------------------------------------------

import {
  AJAX_URL,
  AJAX_ACTION,
  SEASON_PREFIX,
  HALL_LOCATION_MAP,
  MEAL_PERIOD_MAP,
} from './constants'
import { parseMenuHtml } from './parse'
import type { AjaxParams, MenuResult } from './types'

/**
 * Convert an ISO date string (2026-05-26) to the YYYYMMDD format that
 * Berkeley Dining's AJAX endpoint expects (20260526).
 */
export function isoToAjaxDate(isoDate: string): string {
  return isoDate.replace(/-/g, '')
}

/**
 * Build the AJAX POST parameters for a given hall + meal + date.
 * Returns null if the hall or meal period is not recognized.
 */
export function buildAjaxParams(
  hall: string,
  mealPeriod: string,
  date: string // ISO date
): AjaxParams | null {
  const location = HALL_LOCATION_MAP[hall]
  if (!location) {
    console.warn(`[scraper] Unknown hall slug: "${hall}"`)
    return null
  }

  const mealSuffix = MEAL_PERIOD_MAP[mealPeriod]
  if (!mealSuffix) {
    console.warn(`[scraper] Unknown meal period: "${mealPeriod}"`)
    return null
  }

  return {
    location,
    mealperiod: `${SEASON_PREFIX} - ${mealSuffix}`,
    date: isoToAjaxDate(date),
  }
}

/**
 * POST to the Berkeley Dining AJAX endpoint and return the raw HTML string.
 * Throws on network errors or non-200 responses.
 */
async function fetchMenuHtml(params: AjaxParams): Promise<string> {
  const body = new URLSearchParams({
    action: AJAX_ACTION,
    location: params.location,
    mealperiod: params.mealperiod,
    date: params.date,
  })

  const response = await fetch(AJAX_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      Referer: 'https://dining.berkeley.edu/menus/',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from Berkeley Dining AJAX`)
  }

  return response.text()
}

/**
 * Scrape the menu for one hall, one meal period, on one date.
 * Returns a structured MenuResult — never throws; logs warnings instead.
 *
 * @param hall        App slug, e.g. "cafe-3"
 * @param mealPeriod  Normalized period, e.g. "lunch"
 * @param date        ISO date string, e.g. "2026-05-26". Defaults to today.
 */
export async function scrapeMenu(
  hall: string,
  mealPeriod: string,
  date?: string
): Promise<MenuResult> {
  const targetDate = date ?? new Date().toISOString().split('T')[0]

  const params = buildAjaxParams(hall, mealPeriod, targetDate)
  if (!params) {
    return { hall, date: targetDate, mealPeriod, sections: [], status: 'unavailable' }
  }

  console.log(
    `[scraper] Fetching ${hall} / ${mealPeriod} / ${targetDate} ` +
      `(${params.location} | ${params.mealperiod} | ${params.date})`
  )

  const html = await fetchMenuHtml(params)
  return parseMenuHtml(html, hall, targetDate, mealPeriod)
}
