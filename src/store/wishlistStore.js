"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api";
import useAuthStore from "./authStore";

// Wishlist item structure
// { id, name, price, image, originalPrice (optional), dateAdded (optional) }

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [], // Empty wishlist by default
      isLoading: false,

      // Actions
      addToWishlist: async (product) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        // If not authenticated, prevent adding to wishlist
        if (!isAuthenticated) {
          return { 
            success: false, 
            error: "Please login to add items to wishlist",
            requiresAuth: true 
          };
        }

        // If authenticated, sync with API
        set({ isLoading: true });
        try {
          const response = await api.customer.addToFavorites(product.id);
          
          if (response.success) {
            // Add to local state
            const items = get().items;
            const existingItem = items.find((item) => item.id === product.id);

            if (!existingItem) {
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
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }

            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: response.message };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      removeFromWishlist: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        // If not authenticated, prevent removing from wishlist
        if (!isAuthenticated) {
          return { 
            success: false, 
            error: "Please login to manage wishlist",
            requiresAuth: true 
          };
        }

        // If authenticated, sync with API
        set({ isLoading: true });
        try {
          const response = await api.customer.removeFromFavorites(id);
          
          if (response.success) {
            set({
              items: get().items.filter((item) => item.id !== id),
              isLoading: false,
            });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: response.message };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      fetchFavorites: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
          return { success: false, error: "Not authenticated" };
        }

        set({ isLoading: true });
        try {
          const response = await api.customer.getFavorites();
          
          if (response.success && response.data) {
            // Transform API response to match local structure
            const favorites = Array.isArray(response.data) 
              ? response.data 
              : response.data.favorites || response.data.items || [];
            
            set({
              items: favorites,
              isLoading: false,
            });
            return { success: true, items: favorites };
          } else {
            set({ isLoading: false });
            return { success: false, error: response.message };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
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
    }),
    {
      name: "wishlist-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWishlistStore;

