"use client";

import { Layout } from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500 dark:text-zinc-400">Loading...</p>
        </div>
      </Layout>
    );
  }
 
  if (!user) {
    return (
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
            <p className="text-gray-500 dark:text-zinc-400 mb-6">
              You need to be signed in to view your cart
            </p>
            <Link href="/login" className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-zinc-400 mb-6">Your cart is empty</p>
            <Link href="/smartphones" className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <div className="space-y-4">

                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 dark:text-zinc-400 text-sm mb-3">
                        ${item.product.price.toLocaleString()}
                      </p>

                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-12 text-center border border-gray-200 dark:border-zinc-800 rounded px-2 py-1 bg-white dark:bg-zinc-800"
                        />
                        
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.1).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>${(cartTotal * 1.1).toLocaleString()}</span>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}