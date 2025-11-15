"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Wishlist item structure
// { id, name, price, image, originalPrice (optional), dateAdded (optional) }

// Dummy data for testing
const DUMMY_WISHLIST_ITEMS = [
  {
    id: 58,
    name: "Egg and Cucumber",
    image: "/img/dishes/dishes5_1.png",
    price: 45.0,
    originalPrice: null,
  },
  {
    id: 60,
    name: "Brick Oven Pepperoni",
    image: "/img/dishes/dishes5_2.png",
    price: 18.0,
    originalPrice: 20.0,
  },
  {
    id: 61,
    name: "Double Patty Veg",
    image: "/img/dishes/dishes5_3.png",
    price: 18.0,
    originalPrice: 20.0,
  },
];

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      // items: [], // Empty wishlist by default
      items: DUMMY_WISHLIST_ITEMS, // بيانات وهمية للاختبار - احذف هذا السطر لتفعيل wishlist فارغ

      // Actions
      addToWishlist: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (!existingItem) {
          // Only add if item doesn't exist
          set({
            items: [
              ...items,
              {
                ...product,
                dateAdded: new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              },
            ],
          });
        }
      },

      removeFromWishlist: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      // Check if item is in wishlist
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      // Derived state (computed values)
      getItemCount: () => {
        return get().items.length;
      },

      // Add dummy data for testing
      addDummyData: () => {
        set({ items: DUMMY_WISHLIST_ITEMS });
      },
    }),
    {
      name: "wishlist-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWishlistStore;

