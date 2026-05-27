// ---------------------------------------------------------------------------
// Cal Eats — POST /api/ingest
//
// Triggers the full daily menu ingestion for all dining halls.
// Protected by CRON_SECRET — reject unauthorized callers immediately.
//
// Authorization (either header accepted):
//   Authorization: Bearer <CRON_SECRET>
//   x-cron-secret: <CRON_SECRET>
//
// Optional JSON body:
//   { "date": "YYYY-MM-DD" }   — override the target date (defaults to today)
//   { "dry_run": true }        — fetch+parse but skip DB writes
//
// Vercel Cron example (vercel.json):
//   { "path": "/api/ingest", "schedule": "0 12 * * *" }
//   (runs at 05:00 AM Pacific = 12:00 UTC)
// ---------------------------------------------------------------------------

import type { NextRequest } from 'next/server'
import { runSchedule } from '../../_lib/scraper/schedule'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('[ingest] CRON_SECRET env var is not set')
    return false
  }

  // Standard Bearer token
  const authHeader = request.headers.get('authorization') ?? ''
  if (authHeader === `Bearer ${secret}`) return true

  // Alternative: custom header (some cron services prefer this)
  const cronHeader = request.headers.get('x-cron-secret') ?? ''
  if (cronHeader === secret) return true

  return false
}

export async function POST(request: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse optional body ──────────────────────────────────────────────────
  let date: string | undefined
  let dryRun = false

  try {
    const contentType = request.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      if (typeof body.date === 'string') date = body.date
      if (body.dry_run === true) dryRun = true
    }
  } catch {
    // No body or non-JSON body — use defaults
  }

  console.log(
    `[ingest] Starting run — date=${date ?? 'today'} dry_run=${dryRun}`
  )

  // ── Run ingestion ────────────────────────────────────────────────────────
  const summary = await runSchedule(date, dryRun)

  console.log(
    `[ingest] Done in ${summary.duration_ms}ms — ` +
      `success=${summary.summary.success} ` +
      `unavailable=${summary.summary.unavailable} ` +
      `error=${summary.summary.error}`
  )

  const status = summary.summary.error > 0 ? 207 : 200  // 207 = partial success
  return Response.json(summary, { status })
}
