import { createClient } from '@supabase/supabase-js'

// Ganti dengan URL dan Anon Public Key dari Project Supabase kamu
const SUPABASE_URL = 'https://wigfrckswimzvvlirmbg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_SF5f1Oz0Tdz3aHUG5eh6Fg_M7wKF-pl'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)