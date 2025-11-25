"use client";
import { create } from "zustand";
import api from "../api";
import useAuthStore from "./authStore";

// Wishlist item structure (transformed from API)
// { id, name, title, price, image, menu_item_id, ... }

const useWishlistStore = create((set, get) => ({
  // State
  items: [], // Empty wishlist by default - loaded from API
  isLoading: false,
  error: null,
  lastFetched: null, // Track when data was last fetched

  // Transform API response to local structure
  transformFavoriteItem: (apiItem) => {
    try {
      // Validate apiItem structure
      if (!apiItem || typeof apiItem !== 'object') {
        console.error("transformFavoriteItem: Invalid apiItem", apiItem);
        return null;
      }

      const menuItem = apiItem.menu_item || {};
      
      // Validate that we have at least menu_item_id or menu_item.id
      if (!apiItem.menu_item_id && !menuItem.id) {
        console.error("transformFavoriteItem: Missing menu_item_id and menu_item.id", apiItem);
        return null;
      }

      const transformed = {
        id: menuItem.id || apiItem.menu_item_id,
        menu_item_id: apiItem.menu_item_id || menuItem.id,
        name: menuItem.name || "",
        title: menuItem.name || "", // For compatibility with ProductCard
        price: parseFloat(menuItem.price || menuItem.default_price || 0),
        originalPrice: menuItem.default_price ? parseFloat(menuItem.default_price) : null,
        image: menuItem.image_url || menuItem.image || "",
        description: menuItem.description || "",
        category_id: menuItem.category_id || null,
        is_available: menuItem.is_available ?? true,
        is_featured: menuItem.is_featured ?? false,
        // Keep original API data for reference
        _apiData: apiItem,
      };

      // Validate transformed item has required fields
      if (!transformed.id || !transformed.menu_item_id) {
        console.error("transformFavoriteItem: Failed to extract id or menu_item_id", {
          apiItem,
          transformed
        });
        return null;
      }

      return transformed;
    } catch (error) {
      console.error("transformFavoriteItem: Error transforming item", error, apiItem);
      return null;
    }
  },

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

    // Get menu_item_id from product
    const menuItemId = product.menu_item_id || product.id;
    if (!menuItemId) {
      console.error("addToWishlist: Invalid product - missing menu_item_id and id", product);
      return {
        success: false,
        error: "Invalid product: menu_item_id is required"
      };
    }

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log("addToWishlist:", {
        productId: product.id,
        menuItemId: menuItemId,
        productName: product.name || product.title
      });
    }

    // Check if already in wishlist (with type-safe comparison)
    const isAlreadyInWishlist = get().isInWishlist(menuItemId);
    if (isAlreadyInWishlist) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Item already in wishlist, skipping add");
      }
      return { success: true, alreadyExists: true };
    }

    // If authenticated, sync with API
    set({ isLoading: true, error: null });
    try {
      const response = await api.customer.addToFavorites(menuItemId);
      
      if (response.success) {
        // After successful add, refetch favorites to get updated list
        // Use forceRefresh to bypass cache and get fresh data
        const fetchResult = await get().fetchFavorites(true);
        
        if (fetchResult.success) {
          return { success: true };
        } else {
          // Add succeeded but fetch failed - still return success
          // Add item optimistically to local state
          const currentItems = get().items;
          const newItem = get().transformFavoriteItem({
            menu_item_id: menuItemId,
            menu_item: {
              id: product.id || menuItemId,
              menu_item_id: menuItemId,
              name: product.name || product.title || "",
              price: product.price || 0,
              default_price: product.price || 0,
              image_url: product.image || "",
              image: product.image || "",
              description: product.description || "",
              category_id: product.category_id || null,
              is_available: product.is_available ?? true,
              is_featured: product.is_featured ?? false,
            }
          });
          
          // Only add if not already in list
          if (!currentItems.some(item => 
            String(item.id) === String(menuItemId) || 
            String(item.menu_item_id) === String(menuItemId)
          )) {
            set({ items: [...currentItems, newItem] });
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.warn("Added to wishlist but failed to refresh:", fetchResult.error);
          }
          return { success: true, warning: "Added but failed to refresh list" };
        }
      } else {
        set({ isLoading: false });
        const errorMsg = response.message || "Failed to add to wishlist";
        console.error("addToWishlist API error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("addToWishlist exception:", error);
      return { 
        success: false, 
        error: error.message || "Failed to add to wishlist",
        requiresAuth: error.status === 401
      };
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

    // Validate input
    if (!id) {
      console.error("removeFromWishlist: Invalid ID provided", id);
      return {
        success: false,
        error: "Invalid item ID"
      };
    }

    // Get current items
    const items = get().items;
    
    // Try to find the item - check both id and menu_item_id with type-safe comparison
    const idStr = String(id);
    const item = items.find((item) => {
      const itemId = item.id ? String(item.id) : null;
      const itemMenuItemId = item.menu_item_id ? String(item.menu_item_id) : null;
      // Match by menu_item_id first (preferred), then by id
      return itemMenuItemId === idStr || itemId === idStr;
    });

    // Determine menu_item_id to use for API call
    // Priority: item.menu_item_id > item.id > provided id
    const menuItemId = item?.menu_item_id || item?.id || id;

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log("removeFromWishlist:", {
        providedId: id,
        foundItem: item ? { id: item.id, menu_item_id: item.menu_item_id } : null,
        menuItemIdToUse: menuItemId
      });
    }

    // If authenticated, sync with API
    set({ isLoading: true, error: null });
    try {
      const response = await api.customer.removeFromFavorites(menuItemId);
      
      if (response.success) {
        // Remove from local state immediately for better UX
        // Filter by both id and menu_item_id to catch all cases with type-safe comparison
        const idStr = String(id);
        const updatedItems = items.filter((item) => {
          const itemId = item.id ? String(item.id) : null;
          const itemMenuItemId = item.menu_item_id ? String(item.menu_item_id) : null;
          // Keep item if neither id matches
          return itemId !== idStr && itemMenuItemId !== idStr;
        });
        
        set({
          items: updatedItems,
          isLoading: false,
        });
        
        // Don't refetch immediately after delete to avoid race condition
        // The local state is already updated, and we trust the API response
        // If sync is needed, it will happen on next manual fetch or page reload
        
        return { success: true };
      } else {
        set({ isLoading: false });
        const errorMsg = response.message || "Failed to remove from wishlist";
        console.error("removeFromWishlist API error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      set({ isLoading: false });
      const errorMsg = error.message || "Failed to remove from wishlist";
      console.error("removeFromWishlist exception:", error);
      return { 
        success: false, 
        error: errorMsg,
        requiresAuth: error.status === 401
      };
    }
  },

  fetchFavorites: async (forceRefresh = false) => {
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      // Clear items if not authenticated
      set({ items: [], isLoading: false, error: null });
      return { success: false, error: "Not authenticated" };
    }

    // Check if we should skip fetch (if recently fetched and not forcing)
    const lastFetched = get().lastFetched;
    const now = Date.now();
    if (!forceRefresh && lastFetched && (now - lastFetched) < 30000) {
      // Skip if fetched less than 30 seconds ago
      return { success: true, items: get().items, cached: true };
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.customer.getFavorites();
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        const errorMsg = "Invalid response structure from API";
        console.error("fetchFavorites: Invalid response", response);
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      if (!response.success) {
        const errorMsg = response.message || "Failed to fetch favorites";
        console.error("fetchFavorites: API returned success: false", response);
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      if (!response.data || typeof response.data !== 'object') {
        const errorMsg = "Response data is missing or invalid";
        console.error("fetchFavorites: Invalid response.data", response);
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      // Transform API response to match local structure
      let favorites = [];
      
      if (Array.isArray(response.data)) {
        // Direct array structure
        favorites = response.data;
        if (process.env.NODE_ENV === 'development') {
          console.log("fetchFavorites: Using direct array structure", favorites.length);
        }
      } else if (response.data.favorites && Array.isArray(response.data.favorites)) {
        // Nested favorites array (current API structure)
        favorites = response.data.favorites;
        if (process.env.NODE_ENV === 'development') {
          console.log("fetchFavorites: Using nested favorites structure", favorites.length);
        }
      } else if (response.data.items && Array.isArray(response.data.items)) {
        // Alternative structure
        favorites = response.data.items;
        if (process.env.NODE_ENV === 'development') {
          console.log("fetchFavorites: Using items structure", favorites.length);
        }
      } else {
        // Unknown structure - log for debugging
        console.warn("fetchFavorites: Unknown response structure", {
          data: response.data,
          keys: Object.keys(response.data || {})
        });
        // Try to extract any array from data
        const dataKeys = Object.keys(response.data);
        for (const key of dataKeys) {
          if (Array.isArray(response.data[key])) {
            favorites = response.data[key];
            console.warn(`fetchFavorites: Using array from key '${key}'`, favorites.length);
            break;
          }
        }
      }

      // Validate favorites array
      if (!Array.isArray(favorites)) {
        const errorMsg = "Favorites data is not an array";
        console.error("fetchFavorites: favorites is not an array", favorites);
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      // Transform each item and filter out null values (failed transformations)
      const transformedItems = favorites
        .map((item) => {
          try {
            return get().transformFavoriteItem(item);
          } catch (error) {
            console.error("fetchFavorites: Error transforming item", error, item);
            return null;
          }
        })
        .filter((item) => item !== null); // Remove failed transformations

      // Log transformation results
      if (process.env.NODE_ENV === 'development') {
        const failedCount = favorites.length - transformedItems.length;
        if (failedCount > 0) {
          console.warn(`fetchFavorites: Failed to transform ${failedCount} out of ${favorites.length} items`);
        }
        console.log(`fetchFavorites: Successfully transformed ${transformedItems.length} items`);
      }

      // Update state with transformed items
      set({
        items: transformedItems,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      
      return { success: true, items: transformedItems };
    } catch (error) {
      const errorMsg = error.message || "Failed to fetch favorites";
      console.error("fetchFavorites: Exception caught", error);
      set({ 
        isLoading: false, 
        error: errorMsg,
        items: [] // Clear items on error
      });
      return { 
        success: false, 
        error: errorMsg,
        requiresAuth: error.status === 401
      };
    }
  },

  clearWishlist: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      return { 
        success: false, 
        error: "Please login to manage wishlist",
        requiresAuth: true 
      };
    }

    const items = get().items;
    if (items.length === 0) {
      return { success: true };
    }

    set({ isLoading: true, error: null });
    
    try {
      // Delete all items one by one
      const deletePromises = items.map((item) => {
        const menuItemId = item.menu_item_id || item.id;
        return api.customer.removeFromFavorites(menuItemId).catch((error) => {
          // Log error but continue with other deletions
          console.warn(`Failed to remove item ${menuItemId}:`, error);
          return { success: false, error };
        });
      });

      const results = await Promise.allSettled(deletePromises);
      
      // Check if all deletions succeeded
      const allSucceeded = results.every(
        (result) => result.status === "fulfilled" && result.value?.success
      );

      if (allSucceeded) {
        set({
          items: [],
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        // Some deletions failed - refetch to get current state
        const fetchResult = await get().fetchFavorites(true);
        set({ isLoading: false });
        return { 
          success: fetchResult.success, 
          error: fetchResult.success ? null : "Some items could not be removed",
          partial: true
        };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { 
        success: false, 
        error: error.message || "Failed to clear wishlist",
        requiresAuth: error.status === 401
      };
    }
  },

  // Check if item is in wishlist
  isInWishlist: (id) => {
    const items = get().items;
    if (!id) return false;
    const idStr = String(id);
    return items.some((item) => {
      // Check both id and menu_item_id with type-safe comparison
      const itemId = item.id ? String(item.id) : null;
      const itemMenuItemId = item.menu_item_id ? String(item.menu_item_id) : null;
      return itemId === idStr || itemMenuItemId === idStr;
    });
  },

  // Derived state (computed values)
  getItemCount: () => {
    return get().items.length;
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useWishlistStore;
