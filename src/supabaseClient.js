import { createClient } from '@supabase/supabase-js'

// Prefer env vars (Vercel / local .env). Fallback to project credentials so deploys work.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://vrstwzxnsztxwvsbzhfd.supabase.co'

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_pO7hKg1g4U4GvLnlE0cAJw_Ha7Iym_l'

export const supabaseReady = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('http') &&
    !SUPABASE_URL.includes('YOUR_') &&
    !SUPABASE_ANON_KEY.includes('YOUR_')
)

export const supabase = supabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null
