"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star, Heart, Zap } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { fetchProduct as loadProduct } from "@/lib/api";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await loadProduct(productId);
        setProduct((data as Product) || null);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setAdding(true);
    await addToCart(productId);
    setAdding(false);
  };

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
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link
              href="/"
              className="inline-block text-red-600 hover:text-red-500"
            >
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
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <div className="relative overflow-hidden bg-gray-100 dark:bg-zinc-800 rounded-xl aspect-square">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_deal && (
                  <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <Zap className="h-3 w-3" />
                    Deal
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setWished(!wished)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-gray-500 dark:text-zinc-400 hover:text-red-400 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${
                    wished ? "fill-red-400 text-red-400" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-wider mb-2">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
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

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${product.price.toLocaleString()}
                </p>
                {product.original_price && (
                  <p className="text-lg text-gray-400 dark:text-zinc-600 line-through">
                    ${product.original_price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-zinc-300 mb-8">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-8">
              <p
                className={`text-sm font-semibold ${
                  product.stock > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:text-gray-400 dark:disabled:text-zinc-500 text-white font-semibold py-4 rounded-lg transition-colors mb-4"
            >
              <ShoppingCart className="h-5 w-5" />
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            {/* Specifications */}
            {Object.keys(product.specs).length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
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
