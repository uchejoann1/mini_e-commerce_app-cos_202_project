import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-900 drop-shadow-sm">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500">
          {product.brand}
        </p>
        <h3 className="mb-2 truncate text-base font-bold text-gray-900 dark:text-white">
          {product.name}
        </h3>
        <div className="mb-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3.5 w-3.5 ${
                s <= Math.round(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 dark:text-zinc-700"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-gray-500 dark:text-zinc-500">
            ({product.review_count})
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">
            ${product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="text-sm text-gray-400 line-through dark:text-zinc-600">
              ${product.original_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
