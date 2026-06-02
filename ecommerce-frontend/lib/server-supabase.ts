import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Add "as string" to guarantee TypeScript knows these are strings
const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) as string;
const anonKey = (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !anonKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
  );
}

/** Bypasses RLS — use only in API routes after validating the user from the JWT. */
export const serverSupabase: SupabaseClient = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });

export function getAccessToken(req: Request): string | null {
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return token || null;
}

/** DB client that satisfies RLS when no service role key is configured. */
export function getDbClient(accessToken: string | null): SupabaseClient {
  if (serviceRoleKey) return serverSupabase;
  if (!accessToken) return serverSupabase;

  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

export async function getUserFromRequest(req: Request) {
  const token = getAccessToken(req);
  if (!token) return null;

  const authClient = serviceRoleKey
    ? serverSupabase
    : createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });

  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}