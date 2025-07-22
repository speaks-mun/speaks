import { createClient as _create } from "@supabase/supabase-js"

export const supabase = _create(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export const createClient = () => supabase
