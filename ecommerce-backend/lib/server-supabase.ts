import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error("Missing Supabase environment variables for server client.");
}

export const serverSupabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

export async function getUserFromRequest(req: Request) {
  const header = req.headers.get("authorization") || "";
  const token = header.replace("Bearer ", "").trim();
  if (!token) return null;

  const { data, error } = await serverSupabase.auth.getUser(token);
  if (error) return null;
  return data.user;
}