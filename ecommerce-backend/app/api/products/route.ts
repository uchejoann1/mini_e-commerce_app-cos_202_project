import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/server-supabase";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const limit = Number(url.searchParams.get("limit") || 0);
  const featured = url.searchParams.get("featured") === "true";
  const isDeal = url.searchParams.get("isDeal") === "true";
  const query = url.searchParams.get("q");

  let builder = serverSupabase.from("products").select("*");
  if (category) builder = builder.eq("category", category);
  if (featured) builder = builder.eq("featured", true);
  if (isDeal) builder = builder.eq("is_deal", true);
  if (query) builder = builder.or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`);
  if (limit > 0) builder = builder.limit(limit);

  const { data, error } = await builder;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}