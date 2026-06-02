import { supabase } from "@/lib/supabase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

function toApiUrl(path: string): string {
	if (/^https?:\/\//i.test(path)) return path;
	return `${API_BASE_URL}${path}`;
}

async function getAuthHeaders() {
	if (!supabase) {
		return {};
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.access_token) {
		return {};
	}

	return {
		Authorization: `Bearer ${session.access_token}`,
	};
}

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
	const headers = new Headers(init.headers);
	if (!headers.has("Content-Type") && init.body) {
		headers.set("Content-Type", "application/json");
	}

	const authHeaders = await getAuthHeaders();
	Object.entries(authHeaders).forEach(([key, value]) => headers.set(key, value));

	const response = await fetch(toApiUrl(url), { ...init, headers });
	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
	}

	return payload as T;
}

export async function apiGet<T>(url: string): Promise<T> {
	return fetchJson<T>(url);
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
	return fetchJson<T>(url, {
		method: "POST",
		body: body ? JSON.stringify(body) : undefined,
	});
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
	return fetchJson<T>(url, {
		method: "PATCH",
		body: body ? JSON.stringify(body) : undefined,
	});
}

export async function apiDelete<T>(url: string, body?: unknown): Promise<T> {
	return fetchJson<T>(url, {
		method: "DELETE",
		body: body ? JSON.stringify(body) : undefined,
	});
}
