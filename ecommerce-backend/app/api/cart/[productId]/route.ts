import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest, serverSupabase } from "../../../../lib/server-supabase";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await context.params;
  const body = await req.json().catch(() => ({}));
  const { quantity } = body;
  if (quantity == null) return NextResponse.json({ error: "Missing quantity" }, { status: 400 });
  const nextQuantity = Math.max(1, Number(quantity));

  const { data: product, error: productError } = await serverSupabase
    .from("products")
    .select("id,stock,name")
    .eq("id", productId)
    .maybeSingle();
  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });
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

  const { data, error } = await serverSupabase
    .from("cart_items")
    .update({ quantity: nextQuantity })
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await context.params;
  const { error } = await serverSupabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}