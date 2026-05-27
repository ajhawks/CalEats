# Cal Eats — Planning Document

> **Status:** Planning phase — no implementation until this document is approved.
> Extends [DesignDoc.md](./DesignDoc.md) §10 with concrete decisions for all 8 planning areas.

---

## 1. Information Architecture

### Content Hierarchy

```
Cal Eats
├── Home (/)
│   ├── "Open Now" strip — halls currently serving
│   ├── Active meal period label ("Lunch · until 2:00 PM")
│   └── Hall cards — name, status, meal period summary
│
├── Dining Halls (/halls)
│   ├── Hall card list with open/closed indicator
│   └── Sort by: open now, alphabetical
│
├── Hall Detail (/halls/[slug])
│   ├── Meal period tabs: Breakfast · Lunch · Dinner · All Day
│   ├── Menu sections (Grill, Pizza, Salad Bar, Plant Forward, Soup, etc.)
│   ├── Item cards (name + dietary icons)
│   └── Hours callout for this hall
│
├── Item Detail (modal overlay on /halls/[slug])
│   ├── Full name
│   ├── Section / station
│   ├── Dietary labels (vegan, vegetarian, kosher, halal)
│   ├── Allergens list
│   └── Carbon footprint indicator
│
└── Hours (/hours)
    └── All halls, all meal periods, weekly schedule
```

### Navigation Model

**Mobile (primary):** Fixed bottom tab bar, 3 tabs max
- 🏠 Today — home/overview
- 🍽️ Halls — browse all locations
- 🕐 Hours — schedules

**Desktop:** Side nav with same three sections.

### URL Design

| URL | Content |
|---|---|
| `/` | Today's overview, open-now strip |
| `/halls` | All dining hall cards |
| `/halls/cafe-3` | Café 3 full menu (auto-selects current meal period) |
| `/halls/crossroads` | Crossroads menu |
| `/halls/foothill` | Foothill menu |
| `/halls/clark-kerr` | Clark Kerr menu |
| `/halls/golden-bear-cafe` | Golden Bear Café (semi-static) |
| `/halls/browns` | Brown's (semi-static) |
| `/halls/student-union` | Student Union Eateries |
| `/hours` | All operating hours |

---

## 2. UI/UX Wireframes (ASCII)

### Screen 1: Home `/`

```
┌─────────────────────────────────┐
│  Cal Eats          Mon, May 26  │  ← top bar (no nav clutter)
├─────────────────────────────────┤
│  🟢 OPEN NOW · Lunch until 2pm  │  ← meal period status strip
├─────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐   │
│  │ Café 3    │  │Crossroads │   │  ← hall cards (2-col grid)
│  │ 🟢 Open   │  │ 🟢 Open   │   │
│  │ Lunch     │  │ Lunch     │   │
│  │ 24 items  │  │ 31 items  │   │
│  └───────────┘  └───────────┘   │
│  ┌───────────┐  ┌───────────┐   │
│  │ Foothill  │  │Clark Kerr │   │
│  │ 🟡 Opens  │  │ 🔴 Closed │   │
│  │   4:30pm  │  │ Dinner    │   │
│  │           │  │   5pm     │   │
│  └───────────┘  └───────────┘   │
├─────────────────────────────────┤
│  🏠 Today   🍽️ Halls  🕐 Hours  │  ← bottom tab bar
└─────────────────────────────────┘
```

### Screen 2: Hall Detail `/halls/cafe-3`

```
┌─────────────────────────────────┐
│  ← Café 3               🟢 Open │
│     Hearst & Euclid             │
├─────────────────────────────────┤
│ [Breakfast][Lunch][Dinner]      │  ← tab strip, active underlined
├─────────────────────────────────┤
│  GRILL                          │
│  ┌─────────────────────────┐    │
│  │ Grilled Chicken Breast  │    │
│  │ 🌱 GF  ⊗ Dairy-Free     │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Beyond Burger Patty     │    │
│  │ 🌱 VE  🌿 VG            │    │
│  └─────────────────────────┘    │
│  PIZZA                          │
│  ┌─────────────────────────┐    │
│  │ Margherita Flatbread    │    │
│  │ 🌿 VG                   │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  🏠 Today   🍽️ Halls  🕐 Hours  │
└─────────────────────────────────┘
```

### Screen 3: Item Detail (bottom sheet / modal)

```
┌─────────────────────────────────┐
│                          ╳      │
│  Grilled Chicken Breast         │
│  Grill · Café 3                 │
│  ─────────────────────────────  │
│  Dietary                        │
│  ✅ Gluten Free   ✅ Halal       │
│  ─────────────────────────────  │
│  Contains Allergens             │
│  🥛 Milk  🌾 Wheat             │
│  ─────────────────────────────  │
│  Carbon Footprint               │
│  🟡 Medium                      │
│                                 │
└─────────────────────────────────┘
```

### Screen 4: Hours `/hours`

```
┌─────────────────────────────────┐
│  ← Hours                        │
├─────────────────────────────────┤
│  CAFÉ 3                🟢 Open  │
│  Breakfast   7:00 – 10:00 AM    │
│  Lunch      11:00 AM – 2:00 PM  │
│  Dinner      5:00 – 9:00 PM     │
├─────────────────────────────────┤
│  CROSSROADS            🟢 Open  │
│  Breakfast   7:00 – 10:30 AM    │
│  Lunch      11:00 AM – 2:30 PM  │
│  Dinner      5:00 – 9:30 PM     │
├─────────────────────────────────┤
│  FOOTHILL             🔴 Closed │
│  Dinner      4:30 – 9:00 PM     │
├─────────────────────────────────┤
│  🏠 Today   🍽️ Halls  🕐 Hours  │
└─────────────────────────────────┘
```

### Design Tokens (Tailwind 4)

| Token | Value | Usage |
|---|---|---|
| Brand primary | UC Berkeley Blue `#003262` | Nav, active states, links |
| Brand accent | California Gold `#FDB515` | Highlights, badges |
| Open green | `#22c55e` | Open status indicator |
| Closed red | `#ef4444` | Closed status |
| Soon yellow | `#eab308` | Opening soon |
| Background | `zinc-50` / `white` | Page / card background |
| Text primary | `zinc-900` | Body text |
| Text muted | `zinc-500` | Subtitles, meta |

---

## 3. Data Ingestion Strategy

### Source Analysis

Berkeley Dining (`dining.berkeley.edu`) is a WordPress site running the proprietary `cal-dining` plugin. Menu data is rendered server-side by WordPress — the page HTML contains the full menu content. **No public JSON API exists.**

### Ingestion Approach: Server-Side HTML Scraping

**Method:** Scheduled HTTP fetch → HTML parse → normalize → Supabase upsert.

**Technology:** Node.js (`fetch` built-in) + `cheerio` for HTML parsing. No headless browser needed since the page renders server-side.

**Target URLs:**
```
https://dining.berkeley.edu/menus/?location={hall-slug}&meal={meal-slug}&date={YYYY-MM-DD}
```

Hall slugs (inferred from the site's dropdown):
- `cafe-3`, `crossroads`, `foothill`, `clark-kerr`
- `golden-bear-cafe`, `browns`, `student-union`

Meal slugs:
- `breakfast`, `lunch`, `dinner`, `all-day`

**Scrape matrix per day:** 4 halls × 3–4 meal periods = ~14 requests/day (well within rate limits).

### Ingestion Schedule

- **Primary:** Vercel Cron trigger at `05:00 AM Pacific` daily
- **Retry:** One automatic retry 30 minutes later on failure
- **On-demand:** Protected `POST /api/ingest?secret={TOKEN}` for manual re-trigger

### Parsing Strategy

1. Fetch page HTML for each `(hall, meal, date)` triple
2. Use Cheerio to select menu section headings and item cards
3. Extract per item: name, dietary labels, allergens, carbon footprint, station/section
4. Normalize dietary label text → enum values
5. Upsert into Supabase (conflict on `hall_id + date + meal_period + item_name`)

### Failure Handling

- If a hall's menu returns "We are currently working on the menu" → mark `status: 'unavailable'` for that slot; do not delete prior data
- Store `last_scraped_at` timestamp per hall/date/meal
- Surface `unavailable` state gracefully in the UI ("Menu not yet posted")

### Scraper Location

`app/_lib/scraper/` — private Next.js folder (not routable), contains:
- `scraper.ts` — fetch + parse logic
- `normalize.ts` — dietary label / allergen normalization
- `schedule.ts` — orchestration called by `/api/ingest`

---

## 4. Berkeley Dining Menu Structure Analysis

### Confirmed Data Available (from site inspection)

**Per menu item:**
- Item name (text)
- Station/section label (Grill, Pizza, Plant Forward, Soup, Salad Bar, Sides, Entrees, Allergen Friendly)
- Dietary labels: `vegan`, `vegetarian`, `kosher`, `halal`
- Allergens: `milk`, `egg`, `fish`, `shellfish`, `tree nuts`, `wheat`, `peanuts`, `soybeans`, `sesame`, `gluten`, `pork`, `alcohol`
- Carbon footprint: `low`, `medium`, `high`

**Per meal page:**
- Meal period: `breakfast`, `lunch`, `dinner`, `all-day`
- Date
- Hall name
- Sections (ordered list of stations)

**Operating hours:**
Available as static text on the dining site's location pages — likely scraped once and stored as seed data, updated manually or monthly.

### Dining Hall Slugs → Official Names

| App Slug | Official Name | Type |
|---|---|---|
| `cafe-3` | Café 3 | Dining Commons |
| `crossroads` | Crossroads | Dining Commons |
| `foothill` | Foothill | Dining Commons |
| `clark-kerr` | Clark Kerr | Dining Commons |
| `golden-bear-cafe` | Golden Bear Café | Campus Restaurant |
| `browns` | Brown's | Campus Restaurant |
| `student-union` | Eateries at Student Union | Campus Restaurant |

### Data Gaps / Risks

| Risk | Mitigation |
|---|---|
| WordPress HTML structure changes | Lock scraper to specific CSS selectors; alert on parse failure |
| Menu not posted by 5 AM | Retry at 6 AM and 8 AM; show "checking soon" in UI |
| Seasonal menu changes (Summer vs. Academic Year) | Store raw meal period label; normalize to enum at display time |
| Static menus for Browns/GBC | Seed manually; scrape monthly to catch updates |

---

## 5. Database Schema

### Tables (Supabase / PostgreSQL)

#### `dining_halls`
Seeded once, rarely updated.

```sql
CREATE TABLE dining_halls (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,        -- 'cafe-3'
  name        text NOT NULL,               -- 'Café 3'
  type        text NOT NULL,               -- 'commons' | 'restaurant' | 'cafe'
  address     text,
  latitude    double precision,
  longitude   double precision,
  created_at  timestamptz DEFAULT now()
);
```

#### `operating_hours`
Seeded manually; updated when dining changes schedules.

```sql
CREATE TABLE operating_hours (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id      uuid REFERENCES dining_halls(id),
  day_of_week  smallint NOT NULL,    -- 0=Sun … 6=Sat
  meal_period  text NOT NULL,        -- 'breakfast' | 'lunch' | 'dinner' | 'all-day'
  opens_at     time NOT NULL,
  closes_at    time NOT NULL,
  UNIQUE (hall_id, day_of_week, meal_period)
);
```

#### `menu_items`
Written by the daily scraper. Core data table.

```sql
CREATE TABLE menu_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id         uuid REFERENCES dining_halls(id),
  served_date     date NOT NULL,
  meal_period     text NOT NULL,            -- 'breakfast' | 'lunch' | 'dinner' | 'all-day'
  section         text NOT NULL,            -- 'Grill' | 'Pizza' | etc.
  name            text NOT NULL,
  dietary_labels  text[] DEFAULT '{}',      -- ['vegan', 'vegetarian', ...]
  allergens       text[] DEFAULT '{}',      -- ['milk', 'wheat', ...]
  carbon_footprint text,                    -- 'low' | 'medium' | 'high' | null
  created_at      timestamptz DEFAULT now(),
  UNIQUE (hall_id, served_date, meal_period, section, name)
);

CREATE INDEX ON menu_items (hall_id, served_date, meal_period);
CREATE INDEX ON menu_items (served_date);
```

#### `scrape_log`
Audit trail for the ingestion pipeline.

```sql
CREATE TABLE scrape_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id      uuid REFERENCES dining_halls(id),
  served_date  date NOT NULL,
  meal_period  text NOT NULL,
  status       text NOT NULL,        -- 'success' | 'unavailable' | 'error'
  item_count   integer,
  error_msg    text,
  scraped_at   timestamptz DEFAULT now()
);
```

### Row-Level Security (Supabase)

- `dining_halls`, `operating_hours`, `menu_items`, `scrape_log` — **public read**, no write (all writes via service-role key in server-side route handler)
- No user accounts in MVP; RLS is permissive for read, blocked for write from anon key

### Supabase Client Setup

Two clients:
1. **Public client** (`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — used by Server Components for reads
2. **Service client** (`SUPABASE_SERVICE_ROLE_KEY`) — used exclusively in `/api/ingest` route handler for writes

---

## 6. Page Hierarchy Definition

### Route Tree

```
app/
├── layout.tsx                        # Root layout: font, metadata, bottom nav
├── page.tsx                          # / → Home (today's overview)
│
├── halls/
│   ├── page.tsx                      # /halls → All halls list
│   └── [slug]/
│       ├── page.tsx                  # /halls/cafe-3 → Hall detail
│       └── loading.tsx               # Skeleton while menu loads
│
├── hours/
│   └── page.tsx                      # /hours → All operating hours
│
├── api/
│   ├── halls/
│   │   └── route.ts                  # GET /api/halls
│   ├── menus/
│   │   └── route.ts                  # GET /api/menus?hall=&date=&meal=
│   └── ingest/
│       └── route.ts                  # POST /api/ingest (cron-protected)
│
└── _lib/                             # Private — not routable
    ├── supabase/
    │   ├── client.ts                 # Public Supabase client
    │   └── server.ts                 # Service-role Supabase client
    ├── scraper/
    │   ├── scraper.ts                # Fetch + Cheerio parse
    │   ├── normalize.ts              # Label/allergen normalization
    │   └── schedule.ts               # Orchestrates all halls/meals
    ├── data/
    │   ├── halls.ts                  # Query: fetch all halls + status
    │   ├── menus.ts                  # Query: fetch menu items
    │   └── hours.ts                  # Query: fetch operating hours
    └── types.ts                      # Shared TypeScript interfaces
```

### Component Folder

```
components/
├── ui/
│   ├── HallCard.tsx                  # Card on home + halls list
│   ├── StatusBadge.tsx               # Open/Closed/Soon pill
│   ├── MealTabs.tsx                  # Breakfast/Lunch/Dinner tab strip
│   ├── MenuSection.tsx               # Section heading + item list
│   ├── MenuItem.tsx                  # Single item card + dietary icons
│   ├── ItemModal.tsx                 # Bottom sheet detail view
│   ├── BottomNav.tsx                 # Fixed tab bar
│   └── SkeletonCard.tsx              # Loading placeholder
└── layout/
    ├── PageHeader.tsx                # Back button + hall name + status
    └── MealPeriodBanner.tsx          # "Lunch · until 2:00 PM" strip
```

---

## 7. API Architecture

### Route Handlers (Next.js 16 App Router)

All route handlers live in `app/api/`. They are thin — they call `_lib/data/*.ts` functions and return JSON.

#### `GET /api/halls`

Returns all halls with real-time open/closed status derived from operating hours + current time.

**Response:**
```json
[
  {
    "id": "uuid",
    "slug": "cafe-3",
    "name": "Café 3",
    "type": "commons",
    "status": "open",
    "currentMeal": "lunch",
    "nextEvent": { "type": "closes", "at": "14:00" }
  }
]
```

**Caching:** Dynamic (reads current time) — no static prerender. Use `'use cache'` with `cacheLife('minutes')` extracted to a helper once status is computed.

---

#### `GET /api/menus`

Query params: `hall` (slug), `date` (ISO date, defaults to today), `meal` (optional, defaults to current period).

**Response:**
```json
{
  "hall": "cafe-3",
  "date": "2026-05-26",
  "mealPeriod": "lunch",
  "sections": [
    {
      "name": "Grill",
      "items": [
        {
          "name": "Grilled Chicken Breast",
          "dietaryLabels": ["halal"],
          "allergens": ["milk"],
          "carbonFootprint": "medium"
        }
      ]
    }
  ],
  "lastUpdated": "2026-05-26T05:12:00Z",
  "status": "available"
}
```

**Caching:** `'use cache'` with `cacheLife('hours')` — menu data changes once daily. Cache key = `hall + date + meal`.

---

#### `POST /api/ingest`

Protected endpoint invoked by Vercel Cron. Requires `Authorization: Bearer {CRON_SECRET}` header.

1. Validates auth header
2. Calls `schedule.ts` to iterate all halls × meal periods
3. Each hall/meal: fetch HTML → parse → upsert to Supabase → write to `scrape_log`
4. Returns summary JSON

**Not cached.** Always dynamic.

---

### Data Access Pattern

Server Components fetch data directly using Supabase client (no intermediate HTTP hop):

```
Server Component (page.tsx)
  → _lib/data/menus.ts (Supabase query)
  → Supabase (PostgreSQL)
```

Route Handlers (`/api/*`) exist for:
- Client-side revalidation when needed
- Cron ingestion endpoint

### No Client-Side Data Fetching in MVP

All pages render as Server Components using direct Supabase queries. This gives:
- Zero client JS for data loading
- SSR-correct open/closed status per request time
- Fast mobile performance

---

## 8. Caching & Update Strategy

### Menu Data Lifecycle

```
5:00 AM Pacific     →  Vercel Cron fires → /api/ingest
5:00–5:05 AM        →  Scraper fetches all halls/meals (~14 requests)
5:05 AM             →  Supabase updated with today's menus
5:05 AM onward      →  Requests hit cached Supabase data
12:00 AM next day   →  Old date entries remain; new scrape overwrites
```

### Caching Layers

| Layer | Mechanism | TTL | Scope |
|---|---|---|---|
| Page render | Next.js 16 `'use cache'` + `cacheLife('hours')` | 1 hour | Per route |
| Menu API response | `'use cache'` + `cacheLife('hours')` in data helper | 1 hour | Per hall+date+meal |
| Hall status | Dynamic (reads clock) — NOT cached | 0 | Per request |
| Supabase query result | Supabase built-in connection pool | n/a | DB layer |

**Key rule:** Hall open/closed status is always computed server-side at request time (uses current time) and never cached. Menu item content is cached for 1 hour since it only changes once daily.

### Cache Invalidation

- **Daily scrape completes** → next request after cache TTL expires picks up fresh data automatically
- **Manual re-trigger** → POST to `/api/ingest` → new Supabase rows → next request auto-revalidates
- No manual `revalidatePath` needed because `cacheLife('hours')` + daily scrape cadence align correctly

### Next.js 16 `use cache` Implementation Notes

Per Next.js 16 docs, `use cache` must be extracted to a helper function — it **cannot be used directly in a Route Handler body**:

```ts
// ✅ correct
async function getMenuItems(hall: string, date: string, meal: string) {
  'use cache'
  cacheLife('hours')
  return await supabase.from('menu_items').select('*')...
}

// ❌ wrong — 'use cache' in route handler body is not supported
export async function GET() {
  'use cache'  // this will not work
  ...
}
```

### Data Retention

- Keep `menu_items` rows for **30 days** (for potential future "yesterday's menu" feature)
- Keep `scrape_log` rows for **90 days** for debugging
- No automatic purge in MVP; add Supabase scheduled function later

---

## Pre-Implementation Checklist

Before any code is written, confirm:

- [ ] Berkeley Dining HTML selectors verified by manual inspection of live page source
- [ ] Supabase project created + tables provisioned with SQL above
- [ ] Environment variables defined: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`
- [ ] Vercel project connected to GitHub repo
- [ ] Vercel Cron configured in `vercel.json`
- [ ] `cheerio` added as a dependency (`npm install cheerio`)
- [ ] Design tokens (Berkeley Blue + Gold) added to Tailwind 4 config
- [ ] `CLAUDE.md` / `AGENTS.md` reviewed — Next.js 16 docs consulted before any Next.js code

---

## Implementation Order (Post-Approval)

When development begins, follow this sequence to minimize rework:

1. **Foundation** — Supabase schema, env vars, layout/nav shell, Tailwind tokens
2. **Data layer** — `_lib/types.ts`, `_lib/data/*.ts`, Supabase client setup
3. **Scraper** — `_lib/scraper/`, `/api/ingest`, manual test run
4. **Seed data** — Dining hall records, operating hours in Supabase
5. **Pages** — Home → Halls list → Hall detail → Hours
6. **Polish** — Loading skeletons, error states, "unavailable" menu handling
7. **Deploy** — Vercel + cron activation
