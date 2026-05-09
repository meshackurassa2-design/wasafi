import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aaygxqyfxkjsukhsgzkm.supabase.co'
const supabaseAnonKey = 'sb_publishable_1SqO43JsQ4Gq04jm3TVkBg_XgSTzGj8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
