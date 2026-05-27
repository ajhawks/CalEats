// ---------------------------------------------------------------------------
// Cal Eats — Supabase public client (read-only, anon key)
//
// Use this client for SELECT queries in Server Components and data helpers.
// It respects RLS policies — all public dining data is readable by anon.
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

export function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    )
  }

  return createClient(url, key)
}
