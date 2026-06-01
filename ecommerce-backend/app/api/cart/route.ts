import { NextResponse } from "next/server";
import { serverSupabase, getUserFromRequest } from "@/lib/server-supabase";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: items, error } = await serverSupabase
    .from("cart_items")
    .select("id, product_id, quantity, created_at, user_id")
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userItems = (items || []).filter((i: any) => i && i.product_id);
  const productIds = userItems.map((i: any) => i.product_id);
  const { data: products } = await serverSupabase.from("products").select("*").in("id", productIds || []);

  const enriched = userItems.map((it: any) => ({
    ...it,
    product: (products || []).find((p: any) => p.id === it.product_id) || null,
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { product_id, quantity = 1 } = body;
  if (!product_id) return NextResponse.json({ error: "Missing product_id" }, { status: 400 });

  const { data: existing } = await serverSupabase
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existing) {
    const newQty = Math.max(1, Number(existing.quantity) + Number(quantity));
    const { data, error } = await serverSupabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existing.id)
      .select()
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await serverSupabase.from("cart_items").insert({
    user_id: user.id,
    product_id,
    quantity,
  }).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { itemId, product_id, quantity } = body;
  if (!itemId && !product_id) return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
  if (quantity == null) return NextResponse.json({ error: "Missing quantity" }, { status: 400 });

  let query: any = serverSupabase.from("cart_items").update({ quantity });
  if (itemId) {
    const { data, error } = await query.eq("id", itemId).eq("user_id", user.id).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } else {
    const { data, error } = await query.eq("product_id", product_id).eq("user_id", user.id).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }
}

export async function DELETE(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { itemId, product_id, clear } = body;

  if (clear) {
    const { error } = await serverSupabase.from("cart_items").delete().eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (!itemId && !product_id) return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
  let query = serverSupabase.from("cart_items").delete();
  if (itemId) query = query.eq("id", itemId).eq("user_id", user.id);
  else query = query.eq("product_id", product_id).eq("user_id", user.id);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}