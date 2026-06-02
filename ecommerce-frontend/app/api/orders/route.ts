import { NextResponse } from "next/server";
import { getUserFromRequest, serverSupabase } from "@/lib/server-supabase";

const USD_TO_NGN_RATE = 1358;

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: orders, error } = await serverSupabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const enriched = [];
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
  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: "Cart empty" }, { status: 400 });
  }

  const productIds = cartItems.map((c) => c.product_id);
  const { data: products, error: productsError } = await serverSupabase
    .from("products")
    .select("id,price,stock,name")
    .in("id", productIds);
  if (productsError) return NextResponse.json({ error: productsError.message }, { status: 500 });

  let total = 0;
  const itemsToInsert: {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
  }[] = [];

  for (const c of cartItems) {
    const p = (products || []).find((x) => x.id === c.product_id);
    if (!p) {
      return NextResponse.json(
        { error: "One or more products in your cart no longer exist." },
        { status: 400 },
      );
    }

    const availableStock = Number(p.stock ?? 0);
    if (availableStock < Number(c.quantity)) {
      return NextResponse.json(
        {
          error: `${p.name} has only ${availableStock} left in stock.`,
          productId: p.id,
          availableStock,
        },
        { status: 409 },
      );
    }

    const price = p?.price ?? 0;
    total += Number(price) * Number(c.quantity) * USD_TO_NGN_RATE;
    itemsToInsert.push({
      product_id: c.product_id,
      quantity: c.quantity,
      price_at_purchase: Number(price) * USD_TO_NGN_RATE,
    });
  }

  const orderInsert: { user_id: string; total: number; shipping_address?: string } = {
    user_id: user.id,
    total,
  };
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
  if (oiError) {
    await serverSupabase.from("orders").delete().eq("id", orderId);
    return NextResponse.json({ error: oiError.message }, { status: 500 });
  }

  for (const cartItem of cartItems) {
    const product = (products || []).find((p) => p.id === cartItem.product_id);
    const currentStock = Number(product?.stock ?? 0);
    const nextStock = currentStock - Number(cartItem.quantity);

    const { data: stockUpdate, error: stockError } = await serverSupabase
      .from("products")
      .update({ stock: nextStock })
      .eq("id", cartItem.product_id)
      .eq("stock", currentStock)
      .select("id")
      .maybeSingle();

    if (stockError || !stockUpdate) {
      await serverSupabase.from("order_items").delete().eq("order_id", orderId);
      await serverSupabase.from("orders").delete().eq("id", orderId);
      return NextResponse.json(
        {
          error: "Inventory changed while placing your order. Please review your cart and try again.",
        },
        { status: 409 },
      );
    }
  }

  await serverSupabase.from("cart_items").delete().eq("user_id", user.id);

  return NextResponse.json({ order: orderData });
}
