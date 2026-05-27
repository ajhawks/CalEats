// ---------------------------------------------------------------------------
// Cal Eats — Seed operating_hours table
//
// Seeds Crossroads summer 2026 hours (the only active dining commons).
// Other halls have no rows → treated as closed by the /api/halls endpoint.
//
// Update HALL_HOURS when the academic year starts or schedules change.
//
// Usage:  npx tsx scripts/seed-hours.ts
// ---------------------------------------------------------------------------

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ---------------------------------------------------------------------------
// Hours configuration — update each semester
// days: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// times: 24h "HH:MM" format
// ---------------------------------------------------------------------------

const HALL_HOURS: Array<{
  slug: string
  schedule: Array<{
    days: number[]
    periods: Array<{ meal_period: string; opens_at: string; closes_at: string }>
  }>
}> = [
  {
    slug: 'crossroads',
    schedule: [
      {
        days: [0, 1, 2, 3, 4, 5, 6], // all days — same summer schedule
        periods: [
          { meal_period: 'breakfast', opens_at: '07:00', closes_at: '10:00' },
          { meal_period: 'lunch',     opens_at: '11:00', closes_at: '15:00' },
          { meal_period: 'dinner',    opens_at: '16:30', closes_at: '21:00' },
        ],
      },
    ],
  },
  // Café 3, Foothill, Clark Kerr — no rows = closed all summer
  // Add entries here when the academic year schedule is published
]

async function seed() {
  console.log('Seeding operating_hours...\n')

  for (const hall of HALL_HOURS) {
    // Look up hall UUID
    const { data: hallRow, error: hallErr } = await db
      .from('dining_halls')
      .select('id')
      .eq('slug', hall.slug)
      .single()

    if (hallErr || !hallRow) {
      console.error(`Hall not found: ${hall.slug}`, hallErr?.message)
      continue
    }

    // Build flat rows
    const rows = hall.schedule.flatMap(({ days, periods }) =>
      days.flatMap((day) =>
        periods.map((p) => ({
          hall_id:     hallRow.id,
          day_of_week: day,
          ...p,
        }))
      )
    )

    // Upsert (safe to re-run)
    const { error } = await db.from('operating_hours').upsert(rows, {
      onConflict: 'hall_id,day_of_week,meal_period',
      ignoreDuplicates: false,
    })

    if (error) {
      console.error(`Failed to seed ${hall.slug}:`, error.message)
    } else {
      console.log(`✅ ${hall.slug}: ${rows.length} rows seeded`)
    }
  }

  console.log('\nDone.')
}

seed().catch((e) => {
  console.error('Fatal:', e.message)
  process.exit(1)
})
