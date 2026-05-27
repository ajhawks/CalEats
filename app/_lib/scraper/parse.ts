// ---------------------------------------------------------------------------
// Cal Eats — HTML parsing logic
// Takes the raw AJAX response HTML and returns a structured MenuResult
// ---------------------------------------------------------------------------

import * as cheerio from 'cheerio'
import {
  SELECTORS,
  DIETARY_TOOLTIPS,
  CARBON_TOOLTIP_SUBSTRING,
} from './constants'
import type { MenuItem, MenuResult, MenuSection } from './types'

/** Carbon footprint label extraction from tooltip text */
function parseCarbonFootprint(
  tooltipText: string
): MenuItem['carbonFootprint'] {
  const lower = tooltipText.toLowerCase()
  if (!lower.includes(CARBON_TOOLTIP_SUBSTRING)) return null
  if (lower.startsWith('low')) return 'low'
  if (lower.startsWith('medium')) return 'medium'
  if (lower.startsWith('high')) return 'high'
  return null
}

/**
 * Parse a single `li.recip` element into a MenuItem.
 * Dietary labels, allergens, and carbon footprint are extracted from the
 * `.allg-tooltip` text spans rather than the `li` class attribute, so the
 * parser is robust to class name changes.
 */
function parseItem($: cheerio.CheerioAPI, el: cheerio.Element): MenuItem {
  const $el = $(el)

  // Item name — first <span> child of the <li>
  const name = $el.children('span').first().text().trim()

  const dietaryLabels: string[] = []
  const allergens: string[] = []
  let carbonFootprint: MenuItem['carbonFootprint'] = null

  // Walk each food-icon span and classify its tooltip
  $el.find(SELECTORS.foodIcon).each((_, iconEl) => {
    const tooltipText = $(iconEl).find(SELECTORS.tooltip).text().trim()
    if (!tooltipText) return

    const lower = tooltipText.toLowerCase()

    if (lower.includes(CARBON_TOOLTIP_SUBSTRING)) {
      carbonFootprint = parseCarbonFootprint(tooltipText)
    } else if (DIETARY_TOOLTIPS.has(lower)) {
      // Normalize: "Vegan Option" → "vegan"
      const normalized = lower.replace(' option', '').trim()
      dietaryLabels.push(normalized)
    } else {
      // Anything else is an allergen — normalize to lowercase
      allergens.push(lower)
    }
  })

  return { name, dietaryLabels, allergens, carbonFootprint }
}

/**
 * Parse a `div.cat-name` section element into a MenuSection.
 */
function parseSection(
  $: cheerio.CheerioAPI,
  el: cheerio.Element
): MenuSection {
  const $el = $(el)
  const name = $el.children(SELECTORS.sectionName).text().trim()

  const items: MenuItem[] = []
  $el.find(`${SELECTORS.itemList} > ${SELECTORS.item}`).each((_, itemEl) => {
    const item = parseItem($, itemEl)
    if (item.name) items.push(item)
  })

  return { name, items }
}

/**
 * Parse the raw AJAX HTML response into a MenuResult.
 *
 * @param html   The raw HTML string returned by the AJAX endpoint
 * @param hall   App slug (e.g. "cafe-3")
 * @param date   ISO date string (e.g. "2026-05-26")
 * @param mealPeriod  Normalized meal period (e.g. "lunch")
 */
export function parseMenuHtml(
  html: string,
  hall: string,
  date: string,
  mealPeriod: string
): MenuResult {
  const empty = html.trim() === '<ul class="cafe-location"></ul>'
  if (empty) {
    return { hall, date, mealPeriod, sections: [], status: 'unavailable' }
  }

  const $ = cheerio.load(html)
  const sections: MenuSection[] = []

  $(SELECTORS.section).each((_, sectionEl) => {
    const section = parseSection($, sectionEl)
    if (section.items.length > 0) sections.push(section)
  })

  return {
    hall,
    date,
    mealPeriod,
    sections,
    status: sections.length > 0 ? 'success' : 'unavailable',
  }
}
