import React from "react";
import { Layout } from "../components/Layout";

type Product = {
  id: string | number;
  name: string;
  brand?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
  is_deal?: boolean;
};

export default function SmartwatchesPageUI({
  products = [],
  query,
  loading = false,
}: {
  products?: Product[];
  query?: string;
  loading?: boolean;
}) {
  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Smartwatches</h2>
        {query && (
          <p className="mb-8 text-gray-500 dark:text-zinc-400">
            Search results for &quot;{query}&quot;
          </p>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-zinc-400">Loading...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const discount = product.original_price
                ? Math.round(
                    ((product.original_price - product.price) /
                      product.original_price) *
                      100
                  )
                : 0;

              return (
                <article
                  key={String(product.id)}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      {product.brand}
                    </p>

                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-red-500 dark:text-white">
                      {product.name}
                    </h3>

                    <div className="mb-3 flex items-center gap-1.5">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.round(product.rating ?? 0)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-zinc-700"
                            }`}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.555L19.335 24 12 19.77 4.665 24l1.635-8.695L.6 9.75l7.732-1.732L12 .587z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-zinc-500">
                        ({(product.review_count ?? 0).toLocaleString()})
                      </span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${product.price.toLocaleString()}
                        </p>
                        {product.original_price && (
                          <p className="text-xs text-gray-400 line-through dark:text-zinc-600">
                            ${product.original_price.toLocaleString()}
                          </p>
                        )}
                      </div>

                      <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500">
                        Add
                      </button>
                    </div>
                  </div>

                  {product.is_deal && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Deal
                    </span>
                  )}

                  {discount > 0 && (
                    <span className="absolute left-3 top-12 z-10 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      -{discount}%
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-zinc-400">
              No smartwatches found.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
