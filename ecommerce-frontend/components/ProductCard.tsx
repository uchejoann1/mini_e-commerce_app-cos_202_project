"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import { Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatNairaFromUsd } from "@/lib/currency";
import { getStockCount, getStockLabel, isInStock } from "@/lib/stock";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md" | "lg";
}

export function ProductCard({ product, size = "md" }: ProductCardProps) {
  // Check if user is signed in (needed to gate add-to-cart)
  const { user } = useAuth();
  // addToCart function from cart context
  const { addToCart } = useCart();
  // Navigate used to redirect unauthenticated users to login
  const router = useRouter();
  // Whether the add-to-cart request is in progress (disables button)
  const [adding, setAdding] = useState(false);
  // Local wishlist toggle state (UI-only, not persisted)
  const [wished, setWished] = useState(false);

  // Calculate discount percentage from original vs. current price
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Add product to cart; redirect to login if not signed in
  const stockCount = getStockCount(product.stock);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isInStock(product.stock)) return;
    if (!user) {
      router.push("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(String(product.id));
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group relative flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-0.5 ${
        size === "lg" ? "h-full" : ""
      }`}
    >
      {/* Deal and discount badges — positioned top-left */}
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

      {/* Wishlist heart button — positioned top-right */}
      <button
        onClick={(e) => { e.preventDefault(); setWished(!wished); }}
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-gray-500 dark:text-zinc-400 hover:text-red-400 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-red-400 text-red-400" : ""}`} />
      </button>

      {/* Product image with hover zoom effect */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-zinc-800 aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card content: brand, name, rating, price, add-to-cart */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
          {product.name}
        </h3>

        {/* Star rating display */}
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

        <p
          className={`mb-3 text-xs font-medium ${
            stockCount === 0
              ? "text-red-600 dark:text-red-400"
              : stockCount <= 5
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {getStockLabel(product.stock)}
        </p>

        {/* Price and add-to-cart button */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatNairaFromUsd(product.price)}</p>
            {/* Strikethrough original price if discounted */}
            {product.original_price && (
              <p className="text-xs text-gray-400 dark:text-zinc-600 line-through">{formatNairaFromUsd(product.original_price)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || stockCount === 0}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 disabled:bg-gray-200 dark:disabled:bg-zinc-700 disabled:text-gray-400 dark:disabled:text-zinc-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {adding ? "Adding..." : stockCount === 0 ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
