"use client";

import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShippingAddress } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: "",
    email: user?.email || "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });
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
            <p className="text-gray-500 dark:text-zinc-400 mb-6">You need to be signed in to checkout</p>
            <Link href="/login" className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg">
              Sign In
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-500 dark:text-zinc-400 mb-6">
                Add some items before checking out</p>
            <Link href="/smartphones" className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleInputChange = (
    field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
            user_id: user.id,
            total: cartTotal * 1.1,
            status: "completed",
            shipping_address: shippingAddress,
          }])
        .select();

      if (orderError) throw orderError;
      const orderId = (orderData as any)[0]?.id;

      // Create order items
      if (orderId) {
        const orderItems = cartItems.map((item) => ({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
        }));

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) throw itemsError;
      }

      await clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err) {
      setError((err as Error).message || "Failed to complete order");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <Link href="/cart" className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 mb-8">
          <ArrowLeft className="w-4 h-4" /> 
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
             <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                        Full Name</label>
                    <input type="text" 
                    value={shippingAddress.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City</label>
                      <input type="text" 
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Postal Code</label>
                      <input type="text" 
                      value={shippingAddress.postal_code}
                      onChange={(e) => handleInputChange("postal_code", e.target.value)}
                      required className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-300 dark:disabled:bg-zinc-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? "Processing..." : "Complete Purchase"}
              </button>
             </form>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-zinc-400">{item.product.name} x {item.quantity}</span>
                  <span className="font-semibold">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                <span>Subtotal</span><span>${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                <span>Shipping</span><span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                <span>Tax (10%)</span><span>${(cartTotal * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-zinc-800">
                <span>Total</span><span>${(cartTotal * 1.1).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}