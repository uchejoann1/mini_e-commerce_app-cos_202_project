import { NextResponse, NextRequest } from "next/server";
import { serverSupabase, getUserFromRequest } from "@/lib/server-supabase";

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
	const user = await getUserFromRequest(request);
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { id } = await context.params;
	const { data, error } = await serverSupabase
		.from("orders")
		.select("*, order_items(*, product:products(*))")
		.eq("id", id)
		.eq("user_id", user.id)
		.maybeSingle();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data ?? null);
}