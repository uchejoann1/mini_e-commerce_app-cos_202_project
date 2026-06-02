import { createClient } from "@supabase/supabase-js";

// Explicitly declare as strings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Because we told TypeScript they are definitely strings, we can just export it directly
export const supabase = createClient(supabaseUrl, supabaseKey);