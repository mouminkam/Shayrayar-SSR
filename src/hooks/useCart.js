"use client";
import { useMemo } from "react";
import useCartStore from "../store/cartStore";

/**
 * Custom hook for cart operations
 * Provides convenient access to cart state and actions
 */
export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);

  // Computed values
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.final_price || item.price) * item.quantity, 0);
  }, [items]);

  const tax = useMemo(() => {
    return subtotal * 0.1; // 10% tax
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  return {
    items,
    itemCount,
    subtotal,
    tax,
    total,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  };
};

