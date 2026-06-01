import { Product } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

function toApiUrl(path: string): string {
	if (/^https?:\/\//i.test(path)) return path;
	return `${API_BASE_URL}${path}`;
}

export type ProductFilters = {
	category?: Product["category"];
	q?: string;
	featured?: boolean;
	isDeal?: boolean;
	limit?: number;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const response = await fetch(toApiUrl(url), init);
	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
	}

	return payload as T;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
	const params = new URLSearchParams();

	if (filters.category) params.set("category", filters.category);
	if (filters.q) params.set("q", filters.q);
	if (filters.featured) params.set("featured", "true");
	if (filters.isDeal) params.set("isDeal", "true");
	if (typeof filters.limit === "number") params.set("limit", String(filters.limit));

	const query = params.toString();
	return fetchJson<Product[]>(`/api/products${query ? `?${query}` : ""}`);
}

export async function fetchProduct(id: string): Promise<Product | null> {
	const data = await fetchJson<Product>(`/api/products/${id}`);
	return data ?? null;
}
