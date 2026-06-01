import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star, Heart, Zap } from "lucide-react";
import { Layout } from "../components/Layout";

type Product = {
  id: string | number;
  name: string;
  brand?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating: number;
  review_count: number;
  is_deal?: boolean;
  description: string;
  stock: number;
  specs: Record<string, string | number>;
};


export default function ProductPageUI({
  product,
  loading = false,
}: {
  product: Product | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500 dark:text-zinc-400">
            Loading product...
          </p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
            <Link href="/" className="inline-block text-red-600 hover:text-red-500">
              Back to shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
    : 0;

  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-red-600 hover:text-red-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}

              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.is_deal && (
                  <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    <Zap className="h-3 w-3" />
                    Deal
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    -{discount}%
                  </span>
                )}
              </div>

              <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-500 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-400 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-700">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              {product.brand}
            </p>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating ?? 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                {product.rating ?? 0} ({(product.review_count ?? 0).toLocaleString()} reviews)
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${product.price.toLocaleString()}
                </p>
                {product.original_price && (
                  <p className="text-lg text-gray-400 line-through dark:text-zinc-600">
                    ${product.original_price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <p className="mb-8 text-gray-600 dark:text-zinc-300">
              {product.description}
            </p>

            <div className="mb-8">
              <p
                className={`text-sm font-semibold ${
                  product.stock > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>

            <button
              type="button"
              disabled={product.stock === 0}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-4 font-semibold text-white transition-colors hover:bg-red-500 disabled:bg-gray-300 disabled:text-gray-400 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            {Object.keys(product.specs).length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8 dark:border-zinc-800">
                <h2 className="mb-4 text-xl font-bold">Specifications</h2>
                <dl className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-semibold text-gray-500 dark:text-zinc-500">
                        {key}
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}