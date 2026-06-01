import { NextResponse } from "next/server";
import { serverSupabase, getUserFromRequest } from "@/lib/server-supabase";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: orders, error } = await serverSupabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const enriched = [] as any[];
  for (const o of orders || []) {
    const { data: items } = await serverSupabase
      .from("order_items")
      .select("*, product:products(*)")
      .eq("order_id", o.id);
    enriched.push({ ...o, items });
  }

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { shippingAddress } = body;

  const { data: cartItems, error: cartError } = await serverSupabase
    .from("cart_items")
    .select("product_id, quantity")
    .eq("user_id", user.id);
  if (cartError) return NextResponse.json({ error: cartError.message }, { status: 500 });
  if (!cartItems || cartItems.length === 0) return NextResponse.json({ error: "Cart empty" }, { status: 400 });

  const productIds = cartItems.map((c: any) => c.product_id);
  const { data: products } = await serverSupabase.from("products").select("id,price").in("id", productIds);

  let total = 0;
  const itemsToInsert: any[] = [];
  for (const c of cartItems) {
    const p = (products || []).find((x: any) => x.id === c.product_id);
    const price = p?.price ?? 0;
    total += Number(price) * Number(c.quantity);
    itemsToInsert.push({ product_id: c.product_id, quantity: c.quantity, price_at_purchase: price });
  }

  const orderInsert: any = { user_id: user.id, total };
  if (shippingAddress) orderInsert.shipping_address = shippingAddress;

  const { data: orderData, error: orderError } = await serverSupabase
    .from("orders")
    .insert(orderInsert)
    .select()
    .maybeSingle();
  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const orderId = orderData.id;
  const toInsert = itemsToInsert.map((it) => ({ ...it, order_id: orderId }));
  const { error: oiError } = await serverSupabase.from("order_items").insert(toInsert);
  if (oiError) return NextResponse.json({ error: oiError.message }, { status: 500 });

  await serverSupabase.from("cart_items").delete().eq("user_id", user.id);

  return NextResponse.json({ order: orderData });
}