"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, type ProductFilters } from "@/lib/api";

type ProductCollectionProps = {
	title: string;
	subtitle?: string;
	filters?: ProductFilters;
	emptyMessage: string;
};

export function ProductCollection({ title, subtitle, filters, emptyMessage }: ProductCollectionProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;

		const loadProducts = async () => {
			try {
				setLoading(true);
				const data = await fetchProducts(filters);
				if (active) setProducts(data);
			} catch (error) {
				console.error(`Failed to load ${title.toLowerCase()}:`, error);
				if (active) setProducts([]);
			} finally {
				if (active) setLoading(false);
			}
		};

		loadProducts();

		return () => {
			active = false;
		};
	}, [filters, title]);

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
