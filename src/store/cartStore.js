"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Cart item structure
// { id, name, price, quantity, image }

// بيانات وهمية للاختبار
const DUMMY_CART_ITEMS = [
  {
    id: 1,
    name: "Fried Chicken",
    price: 80.0,
    quantity: 2,
    image: "/img/blog/blogRecentThumb3_1.png",
  },
  {
    id: 2,
    name: "Fried Noodles",
    price: 60.0,
    quantity: 1,
    image: "/img/blog/blogRecentThumb3_2.png",
  },
  {
    id: 3,
    name: "Special Pasta",
    price: 70.0,
    quantity: 3,
    image: "/img/blog/blogRecentThumb3_3.png",
  },
];

const useCartStore = create(
  persist(
    (set, get) => ({
      // State - الحالة الأساسية للـ cart
      // items: [], // Cart فارغ افتراضياً
      items: DUMMY_CART_ITEMS, // بيانات وهمية للاختبار - احذف هذا السطر لتفعيل cart فارغ

      // Actions
      addToCart: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // If item exists, increase quantity
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // If item doesn't exist, add it with quantity 1
          set({
            items: [...items, { ...product, quantity: 1 }],
          });
        }
      },

      removeFromCart: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      increaseQty: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      },

      decreaseQty: (id) => {
        const items = get().items;
        const item = items.find((item) => item.id === id);

        if (item && item.quantity > 1) {
          set({
            items: items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        } else {
          // If quantity is 1, remove the item
          get().removeFromCart(id);
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Derived state (computed values)
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getTax: () => {
        return get().getSubtotal() * 0.1; // 10% tax
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // دالة لإضافة بيانات وهمية للاختبار
      addDummyData: () => {
        set({ items: DUMMY_CART_ITEMS });
      },
    }),
    {
      name: "cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;

