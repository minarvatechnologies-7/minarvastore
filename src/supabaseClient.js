import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Pre-flight check (BUG #13): expose whether config is present so the app
// can render a friendly setup screen instead of a cryptic "Failed to fetch".
export const supabaseReady = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('YOUR_') && !SUPABASE_ANON_KEY.includes('YOUR_')
)

export const supabase = supabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null
