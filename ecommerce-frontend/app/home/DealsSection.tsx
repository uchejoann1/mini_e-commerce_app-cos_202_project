"use client";

import Link from "next/link";
import { ArrowRight, Zap, Star } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/app/components/ProductCard";

export function DealsSection({ dealProducts }: { dealProducts: Product[] }) {
  if (dealProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-red-400 fill-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today&apos;s Deals</h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500">Limited time offers — don&apos;t miss out</p>
          </div>
        </div>
        <Link
          href="/smartphones"
          className="text-sm text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {dealProducts.slice(0, 2).map((product, i) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className={`group relative flex overflow-hidden rounded-2xl border transition-all duration-300 hover:border-zinc-500 ${
              i === 0
                ? "bg-linear-to-br from-red-950/30 to-zinc-900 border-red-900/40"
                : "bg-linear-to-br from-blue-950/30 to-zinc-900 border-blue-900/30"
            }`}
          >
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                  <Zap className="h-3 w-3" /> Hot Deal
                </span>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{product.brand}</p>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= Math.round(product.rating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-zinc-500 ml-1">
                    ({product.review_count?.toLocaleString() || 0})
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-zinc-600 line-through">
                      ${product.original_price.toLocaleString()}
                    </span>
                  )}
                  {product.original_price && (
                    <span className="text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      -{Math.round(
                        ((product.original_price - product.price) / product.original_price) * 100
                      )}
                      %
                    </span>
                  )}
                </div>
                <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  View Deal <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
            <div className="w-40 sm:w-52 shrink-0 relative overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
