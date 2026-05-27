// ---------------------------------------------------------------------------
// Cal Eats — Supabase service-role client (server-side writes only)
//
// Use this client ONLY in:
//   - app/api/ingest/route.ts
//   - scripts/ingest.ts
//
// Never expose SUPABASE_SERVICE_ROLE_KEY to the client bundle.
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and ' +
        'SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

// Lazily initialized singleton — safe because this module is server-only
let _client: ReturnType<typeof getServiceClient> | null = null

export function getSupabaseServiceClient() {
  if (!_client) _client = getServiceClient()
  return _client!
}
