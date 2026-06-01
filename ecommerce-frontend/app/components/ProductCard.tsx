"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md" | "lg";
}

export function ProductCard({ product, size = "md" }: ProductCardProps) {
  const [wished, setWished] = useState(false);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group relative flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-0.5 ${
        size === "lg" ? "h-full" : ""
      }`}
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.is_deal && (
          <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            <Zap className="h-2.5 w-2.5" />
            Deal
          </span>
        )}
        {discount > 0 && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      <button
        onClick={(e) => { e.preventDefault(); setWished(!wished); }}
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-gray-500 dark:text-zinc-400 hover:text-red-400 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-red-400 text-red-400" : ""}`} />
      </button>

      <div className="relative overflow-hidden bg-gray-100 dark:bg-zinc-800 aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-zinc-700"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 dark:text-zinc-500">({product.review_count.toLocaleString()})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${product.price.toLocaleString()}</p>
            {product.original_price && (
              <p className="text-xs text-gray-400 dark:text-zinc-600 line-through">${product.original_price.toLocaleString()}</p>
            )}
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-zinc-700 disabled:text-gray-400 dark:disabled:text-zinc-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
