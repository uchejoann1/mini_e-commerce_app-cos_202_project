"use client";

import { Layout } from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user, loading: authLoading } = useAuth();
  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {/* Cart logic will go here */}
      </div>
    </Layout>
  );
}