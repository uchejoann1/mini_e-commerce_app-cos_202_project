"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { CartItem, Product } from "@/types";
import { useAuth } from "./AuthContext";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/client-api";

interface CartContextType {
  cartItems: (CartItem & { product: Product })[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

// Default context values (empty cart, no-op functions)
const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  loading: false,
});

export function CartProvider({ children }: { children: ReactNode }) {
  // Current user from auth context — cart is scoped per user
  const { user } = useAuth();
  // Cart items with joined product data
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the user's cart items from Supabase, including full product details
  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    setLoading(true);
    try {
      const response = await apiGet<(CartItem & { product: Product })[]>("/api/cart");
      setCartItems(response ?? []);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-fetch cart whenever the user changes (sign in/out)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add a product to cart — increments quantity if already in cart, otherwise inserts new row
  const addToCart = async (productId: string) => {
    if (!user) return;
    await apiPost("/api/cart", { product_id: productId });
    await fetchCart();
  };

  // Remove a single cart item by its row ID
  const removeFromCart = async (itemId: string) => {
    await apiDelete("/api/cart", { itemId });
    await fetchCart();
  };

  // Update quantity for a cart item; if quantity drops to 0 or below, remove it instead
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    await apiPatch("/api/cart", { itemId, quantity });
    await fetchCart();
  };

  // Clear all cart items for the current user
  const clearCart = async () => {
    if (!user) return;
    await apiDelete("/api/cart", { clear: true });
    setCartItems([]);
  };

  // Derived values: total number of items and total price
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to access cart state and actions from any component
export const useCart = () => useContext(CartContext);
