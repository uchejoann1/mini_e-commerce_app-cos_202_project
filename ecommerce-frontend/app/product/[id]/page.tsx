"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/client-api";
import { Product } from "@/types";
import { formatNairaFromUsd } from "@/lib/currency";
import { getStockCount, getStockLabel, isInStock } from "@/lib/stock";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet<Product>(`/api/products/${id}`);
        if (active) setProduct(data ?? null);
      } catch (e: any) {
        if (active) {
          setProduct(null);
          setError(e?.message ?? "Failed to load product.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const discount = useMemo(() => {
    if (!product?.original_price) return 0;
    return Math.round(((product.original_price - product.price) / product.original_price) * 100);
  }, [product]);

  const handleAdd = async () => {
    if (!product) return;
    if (!user) {
      router.push(`/login?next=/product/${product.id}`);
      return;
    }
    setAdding(true);
    try {
      await addToCart(String(product.id));
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500 dark:text-zinc-400">Loading product...</p>
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
            {error && <p className="mb-4 text-sm text-gray-500 dark:text-zinc-400">{error}</p>}
            <Link href="/" className="inline-block text-red-600 hover:text-red-500">
              Back to shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-red-600 hover:text-red-500">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />

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
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                {product.rating} ({product.review_count.toLocaleString()} reviews)
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatNairaFromUsd(product.price)}</p>
                {product.original_price && (
                  <p className="text-lg text-gray-400 line-through dark:text-zinc-600">
                    {formatNairaFromUsd(product.original_price)}
                  </p>
                )}
              </div>
            </div>

            <p className="mb-8 text-gray-600 dark:text-zinc-300">{product.description}</p>

            <div className="mb-8">
              <p
                className={`text-sm font-semibold ${
                  isInStock(product.stock)
                    ? getStockCount(product.stock) <= 5
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {getStockLabel(product.stock)}
                {isInStock(product.stock) && getStockCount(product.stock) <= 5 && " — order soon"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !isInStock(product.stock)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-4 font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
            >
              <ShoppingCart className="h-5 w-5" />
              {adding ? "Adding..." : isInStock(product.stock) ? "Add to Cart" : "Out of Stock"}
            </button>

            <div className="mt-12 border-t border-gray-200 pt-8 dark:border-zinc-800">
              <h2 className="mb-4 text-xl font-bold">Specifications</h2>
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(product.specs ?? {}).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-semibold text-gray-500 dark:text-zinc-500">{key}</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
