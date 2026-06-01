import { NextResponse } from "next/server";
import { getUserFromRequest, serverSupabase } from "../../../lib/server-supabase";

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

  const requestedQty = Math.max(1, Number(quantity || 1));

  const { data: product, error: productError } = await serverSupabase
    .from("products")
    .select("id,stock,name")
    .eq("id", product_id)
    .maybeSingle();
  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const { data: existing } = await serverSupabase
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existing) {
    const newQty = Math.max(1, Number(existing.quantity) + requestedQty);
    if (newQty > Number(product.stock ?? 0)) {
      return NextResponse.json(
        {
          error: `${product.name} has only ${product.stock} left in stock.`,
          availableStock: Number(product.stock ?? 0),
        },
        { status: 409 },
      );
    }

    const { data, error } = await serverSupabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existing.id)
      .select()
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (requestedQty > Number(product.stock ?? 0)) {
    return NextResponse.json(
      {
        error: `${product.name} has only ${product.stock} left in stock.`,
        availableStock: Number(product.stock ?? 0),
      },
      { status: 409 },
    );
  }

  const { data, error } = await serverSupabase.from("cart_items").insert({
    user_id: user.id,
    product_id,
    quantity: requestedQty,
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
  const nextQuantity = Math.max(1, Number(quantity));

  const itemLookup = await serverSupabase
    .from("cart_items")
    .select("product_id")
    .eq("user_id", user.id)
    .eq(itemId ? "id" : "product_id", itemId || product_id)
    .maybeSingle();
  if (itemLookup.error) return NextResponse.json({ error: itemLookup.error.message }, { status: 500 });
  if (!itemLookup.data) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

  const { data: product, error: stockError } = await serverSupabase
    .from("products")
    .select("id,stock,name")
    .eq("id", itemLookup.data.product_id)
    .maybeSingle();
  if (stockError) return NextResponse.json({ error: stockError.message }, { status: 500 });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  if (nextQuantity > Number(product.stock ?? 0)) {
    return NextResponse.json(
      {
        error: `${product.name} has only ${product.stock} left in stock.`,
        availableStock: Number(product.stock ?? 0),
      },
      { status: 409 },
    );
  }

  let query: any = serverSupabase.from("cart_items").update({ quantity: nextQuantity });
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