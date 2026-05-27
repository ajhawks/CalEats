-- ==========================================================================
-- Cal Eats — Supabase Schema
-- Run this in the Supabase SQL Editor to provision all tables.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- dining_halls  (seeded once, rarely changed)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dining_halls (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,        -- app slug e.g. 'cafe-3'
  name        text NOT NULL,               -- display name e.g. 'Café 3'
  type        text NOT NULL                -- 'commons' | 'restaurant' | 'cafe'
                CHECK (type IN ('commons', 'restaurant', 'cafe')),
  address     text,
  latitude    double precision,
  longitude   double precision,
  created_at  timestamptz DEFAULT now()
);

-- --------------------------------------------------------------------------
-- operating_hours  (seeded manually, updated each semester)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS operating_hours (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id      uuid NOT NULL REFERENCES dining_halls(id) ON DELETE CASCADE,
  day_of_week  smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun … 6=Sat
  meal_period  text NOT NULL
                CHECK (meal_period IN ('breakfast', 'lunch', 'dinner', 'all-day')),
  opens_at     time NOT NULL,
  closes_at    time NOT NULL,
  UNIQUE (hall_id, day_of_week, meal_period)
);

-- --------------------------------------------------------------------------
-- menu_items  (written daily by the scraper)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id          uuid NOT NULL REFERENCES dining_halls(id) ON DELETE CASCADE,
  served_date      date NOT NULL,
  meal_period      text NOT NULL
                    CHECK (meal_period IN ('breakfast', 'lunch', 'dinner', 'all-day')),
  section          text NOT NULL,           -- station name e.g. 'Grill'
  name             text NOT NULL,           -- item name
  dietary_labels   text[] DEFAULT '{}',     -- ['vegan', 'halal', …]
  allergens        text[] DEFAULT '{}',     -- ['milk', 'wheat', …]
  carbon_footprint text                     -- 'low' | 'medium' | 'high' | null
                    CHECK (carbon_footprint IN ('low', 'medium', 'high') OR carbon_footprint IS NULL),
  created_at       timestamptz DEFAULT now(),

  -- Prevent duplicate rows on re-scrape
  UNIQUE (hall_id, served_date, meal_period, section, name)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_menu_items_hall_date_meal
  ON menu_items (hall_id, served_date, meal_period);

CREATE INDEX IF NOT EXISTS idx_menu_items_date
  ON menu_items (served_date);

-- --------------------------------------------------------------------------
-- scrape_log  (audit trail for each scraper run)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scrape_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id      uuid NOT NULL REFERENCES dining_halls(id) ON DELETE CASCADE,
  served_date  date NOT NULL,
  meal_period  text NOT NULL,
  status       text NOT NULL CHECK (status IN ('success', 'unavailable', 'error')),
  item_count   integer,
  error_msg    text,
  scraped_at   timestamptz DEFAULT now()
);

-- --------------------------------------------------------------------------
-- Row-Level Security
-- Public: read-only for anon key  |  writes: service role only
-- --------------------------------------------------------------------------
ALTER TABLE dining_halls    ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_log      ENABLE ROW LEVEL SECURITY;

-- Allow public read on data tables
CREATE POLICY "public read dining_halls"
  ON dining_halls FOR SELECT USING (true);

CREATE POLICY "public read operating_hours"
  ON operating_hours FOR SELECT USING (true);

CREATE POLICY "public read menu_items"
  ON menu_items FOR SELECT USING (true);

-- scrape_log is internal only — no public read policy

-- --------------------------------------------------------------------------
-- Seed: dining_halls
-- --------------------------------------------------------------------------
INSERT INTO dining_halls (slug, name, type) VALUES
  ('cafe-3',            'Café 3',                         'commons'),
  ('crossroads',        'Crossroads',                     'commons'),
  ('foothill',          'Foothill',                       'commons'),
  ('clark-kerr',        'Clark Kerr',                     'commons'),
  ('golden-bear-cafe',  'The Golden Bear Café',           'cafe'),
  ('browns',            'Brown''s',                       'restaurant'),
  ('student-union',     'Eateries at Student Union',      'restaurant')
ON CONFLICT (slug) DO NOTHING;
