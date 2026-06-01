import { NextResponse, NextRequest } from "next/server";
import { serverSupabase } from "/Users/ethanogogo/Downloads/group6/Mini_E-Commerce_App-COS_202_Project/ecommerce-backend/lib/server-supabase.ts";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { data, error } = await serverSupabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(data);
}