"use client";

import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";

type ProductFilters = {
	search?: string;
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	sortBy?: "price-asc" | "price-desc" | "rating" | "newest";
	limit?: number;
	offset?: number;
};

type ProductCollectionProps = {
	title: string;
	subtitle?: string;
	filters?: ProductFilters;
	emptyMessage: string;
	products?: Product[];
	loading?: boolean;
};

export function ProductCollection({
	title,
	subtitle,
	emptyMessage,
	products = [],
	loading = false,
}: ProductCollectionProps) {

	return (
		<section className="py-12 sm:py-16">
			<h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
			{subtitle && <p className="text-gray-500 dark:text-zinc-400 mb-8">{subtitle}</p>}

			{loading ? (
				<div className="text-center py-12">
					<p className="text-gray-500 dark:text-zinc-400">Loading products...</p>
				</div>
			) : products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-500 dark:text-zinc-400">{emptyMessage}</p>
				</div>
			)}
		</section>
	);
}
