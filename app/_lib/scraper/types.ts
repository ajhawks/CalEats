// ---------------------------------------------------------------------------
// Cal Eats — Scraper type definitions
// ---------------------------------------------------------------------------

/** A single menu item with its dietary/allergen metadata */
export interface MenuItem {
  name: string
  dietaryLabels: string[]  // e.g. ["vegan", "halal"]
  allergens: string[]      // e.g. ["milk", "wheat", "gluten"]
  carbonFootprint: 'low' | 'medium' | 'high' | null
}

/** A named station / section within a meal period (e.g. "Grill", "Pizza") */
export interface MenuSection {
  name: string
  items: MenuItem[]
}

/** The fully parsed result for one hall + date + meal period */
export interface MenuResult {
  hall: string          // app slug, e.g. "cafe-3"
  date: string          // ISO date, e.g. "2026-05-26"
  mealPeriod: string    // normalized, e.g. "lunch"
  sections: MenuSection[]
  status: 'success' | 'unavailable'
}

/** Raw AJAX parameters sent to Berkeley Dining */
export interface AjaxParams {
  location: string    // WordPress value, e.g. "Cafe_3"
  mealperiod: string  // WordPress value, e.g. "Summer - Lunch"
  date: string        // YYYYMMDD, e.g. "20260526"
}
