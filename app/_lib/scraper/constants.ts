// ---------------------------------------------------------------------------
// Cal Eats — Scraper configuration constants
//
// If Berkeley Dining changes their WordPress plugin structure, update these
// constants rather than hunting for string literals throughout the code.
// ---------------------------------------------------------------------------

/** WordPress AJAX endpoint for menu data */
export const AJAX_URL = 'https://dining.berkeley.edu/wp-admin/admin-ajax.php'

/** WordPress AJAX action name for menu data */
export const AJAX_ACTION = 'cald_filter_xml'

/**
 * Season prefix that Berkeley Dining prepends to meal period names.
 * Changes between "Summer" and "Academic Year" (or similar) each term.
 * Update this when the dining site's meal period labels change.
 */
export const SEASON_PREFIX = 'Summer'

/**
 * Map from our normalized hall slugs → the WordPress location values
 * used in the AJAX request. Must match the <option value="..."> in the
 * dining site's filter dropdown exactly.
 */
export const HALL_LOCATION_MAP: Record<string, string> = {
  'cafe-3':       'Cafe_3',
  'crossroads':   'Crossroads',
  'foothill':     'Foothill',
  'clark-kerr':   'Clark_Kerr_Campus',
  'golden-bear-cafe': 'Golden_Bear_Cafe',
  'browns':       'Browns_Cafe',
  'student-union': 'Eateries_at_the_Student_Union',
} as const

/**
 * Map from our normalized meal period names → the WordPress meal period
 * values (without the season prefix). The season prefix is prepended at
 * runtime using SEASON_PREFIX.
 */
export const MEAL_PERIOD_MAP: Record<string, string> = {
  'breakfast': 'Breakfast',
  'lunch':     'Lunch',
  'dinner':    'Dinner',
  'all-day':   'All Day',
} as const

/**
 * Tooltip strings that indicate a DIETARY label (not an allergen).
 * Matched case-insensitively against the text in `.allg-tooltip` spans.
 */
export const DIETARY_TOOLTIPS = new Set([
  'vegan option',
  'vegetarian option',
  'halal',
  'kosher',
])

/**
 * Substring that identifies a carbon footprint tooltip.
 * e.g. "Low Carbon Footprint", "Medium Carbon Footprint"
 */
export const CARBON_TOOLTIP_SUBSTRING = 'carbon footprint'

/**
 * Cheerio CSS selectors for parsing the AJAX response HTML.
 * Update these if Berkeley Dining changes their markup.
 */
export const SELECTORS = {
  /** Section (station) name wrapper */
  section: 'div.cat-name',
  /** Section name text element (first <span> child) */
  sectionName: 'span:first-child',
  /** List of items within a section */
  itemList: 'ul.recipe-name',
  /** Individual menu item <li> */
  item: 'li.recip',
  /** Item name (first <span> inside item) */
  itemName: 'span:first-child',
  /** Wrapper for all icon/allergen tooltips */
  iconsWrap: 'span.icons-wrap',
  /** Individual icon+tooltip unit */
  foodIcon: 'span.food-icon',
  /** The tooltip text span */
  tooltip: 'span.allg-tooltip',
} as const
