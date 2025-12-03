"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TAX_RATE } from "../data/constants";

// Cart item structure
// { 
//   id, name, price, quantity, image,
//   size_id, size_name, ingredients, ingredients_data,
//   base_price, final_price
// }

// Helper function to generate unique cart item key
export const getCartItemKey = (item) => {
  const sizeKey = item.size_id || 'no-size';
  const ingredientsKey = Array.isArray(item.ingredients) 
    ? item.ingredients.sort().join(',') 
    : 'no-ingredients';
  return `${item.id}-${sizeKey}-${ingredientsKey}`;
};

const useCartStore = create(
  persist(
    (set, get) => ({
      // State - Basic cart state
      items: [], // Cart is empty by default
      coupon: null, // Applied coupon { code, discount_amount, discount_type, ... }
      deliveryCharge: 0, // Delivery charge amount
      orderType: 'delivery', // 'pickup' or 'delivery'
      quoteId: null, // Delivery quote ID

      // Actions
      addToCart: (product) => {
        const items = get().items;
        
        // Generate unique key for this product configuration
        const productKey = getCartItemKey({
          id: product.id,
          size_id: product.size_id || null,
          ingredients: product.ingredients || [],
        });

        // Find existing item with same configuration
        const existingItem = items.find((item) => {
          const itemKey = getCartItemKey({
            id: item.id,
            size_id: item.size_id || null,
            ingredients: item.ingredients || [],
          });
          return itemKey === productKey;
        });

        if (existingItem) {
          // If same product with same size and ingredients exists, increase quantity
          set({
            items: items.map((item) => {
              const itemKey = getCartItemKey({
                id: item.id,
                size_id: item.size_id || null,
                ingredients: item.ingredients || [],
              });
              return itemKey === productKey
                ? { 
                    ...item, 
                    quantity: item.quantity + 1,
                    // Ensure image is preserved or updated from product
                    image: item.image || product.image || product.image_url || null
                  }
                : item;
            }),
          });
        } else {
          // If different configuration, add as new item
          set({
            items: [...items, { 
              ...product, 
              quantity: 1,
              // Ensure all fields are set
              image: product.image || product.image_url || null, // Preserve image from product
              size_id: product.size_id || null,
              size_name: product.size_name || null,
              ingredients: product.ingredients || [],
              ingredients_data: product.ingredients_data || [],
              base_price: product.base_price || product.price,
              final_price: product.final_price || product.price,
            }],
          });
        }
      },

      removeFromCart: (cartItemKey) => {
        // cartItemKey can be either an ID (for backward compatibility) or a unique key
        // If it's a number/string that looks like an ID, remove by ID
        // Otherwise, treat it as a unique key
        const items = get().items;
        
        // Try to find by unique key first
        const itemToRemove = items.find((item) => {
          const itemKey = getCartItemKey({
            id: item.id,
            size_id: item.size_id || null,
            ingredients: item.ingredients || [],
          });
          return itemKey === cartItemKey || item.id === cartItemKey;
        });

        if (itemToRemove) {
          const itemKey = getCartItemKey({
            id: itemToRemove.id,
            size_id: itemToRemove.size_id || null,
            ingredients: itemToRemove.ingredients || [],
          });
          
          set({
            items: items.filter((item) => {
              const currentKey = getCartItemKey({
                id: item.id,
                size_id: item.size_id || null,
                ingredients: item.ingredients || [],
              });
              return currentKey !== itemKey && item.id !== cartItemKey;
            }),
          });
        } else {
          // Fallback: remove by ID (backward compatibility)
          set({
            items: items.filter((item) => item.id !== cartItemKey),
          });
        }
      },

      increaseQty: (cartItemKey) => {
        const items = get().items;
        set({
          items: items.map((item) => {
            const itemKey = getCartItemKey({
              id: item.id,
              size_id: item.size_id || null,
              ingredients: item.ingredients || [],
            });
            if (itemKey === cartItemKey || item.id === cartItemKey) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          }),
        });
      },

      decreaseQty: (cartItemKey) => {
        const items = get().items;
        const item = items.find((item) => {
          const itemKey = getCartItemKey({
            id: item.id,
            size_id: item.size_id || null,
            ingredients: item.ingredients || [],
          });
          return itemKey === cartItemKey || item.id === cartItemKey;
        });

        if (item && item.quantity > 1) {
          set({
            items: items.map((item) => {
              const itemKey = getCartItemKey({
                id: item.id,
                size_id: item.size_id || null,
                ingredients: item.ingredients || [],
              });
              if (itemKey === cartItemKey || item.id === cartItemKey) {
                return { ...item, quantity: item.quantity - 1 };
              }
              return item;
            }),
          });
        } else {
          // If quantity is 1, remove the item
          get().removeFromCart(cartItemKey);
        }
      },

      clearCart: () => {
        set({ 
          items: [],
          coupon: null,
          deliveryCharge: 0,
          quoteId: null,
        });
      },

      // Coupon management
      applyCoupon: (couponData) => {
        set({ coupon: couponData });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      // Delivery charge management
      setDeliveryCharge: (charge) => {
        set({ deliveryCharge: charge || 0 });
      },

      // Order type management
      setOrderType: (type) => {
        set({ orderType: type });
        // Reset delivery charge and quote_id if pickup
        if (type === 'pickup') {
          set({ deliveryCharge: 0, quoteId: null });
        }
      },

      // Quote ID management
      setQuoteId: (quoteId) => {
        set({ quoteId: quoteId || null });
      },

      // Update cart item (for editing customization)
      updateCartItem: (cartItemKey, updates) => {
        const items = get().items;
        
        // Find the item to update
        const itemToUpdate = items.find((item) => {
          const itemKey = getCartItemKey({
            id: item.id,
            size_id: item.size_id || null,
            ingredients: item.ingredients || [],
          });
          return itemKey === cartItemKey || item.id === cartItemKey;
        });

        if (!itemToUpdate) {
          return false; // Item not found
        }

        // Create updated item with new values
        const updatedItem = {
          ...itemToUpdate,
          ...updates,
          // Preserve quantity and image
          quantity: itemToUpdate.quantity,
          image: itemToUpdate.image || updates.image || null, // Preserve image from original item
        };

        // Generate new key for updated item
        const newKey = getCartItemKey({
          id: updatedItem.id,
          size_id: updatedItem.size_id || null,
          ingredients: updatedItem.ingredients || [],
        });

        // Get old key
        const oldKey = getCartItemKey({
          id: itemToUpdate.id,
          size_id: itemToUpdate.size_id || null,
          ingredients: itemToUpdate.ingredients || [],
        });

        // If key changed, we need to replace the item (remove old, add new)
        if (newKey !== oldKey) {
          // Check if new configuration already exists
          const existingItem = items.find((item) => {
            const itemKey = getCartItemKey({
              id: item.id,
              size_id: item.size_id || null,
              ingredients: item.ingredients || [],
            });
            return itemKey === newKey && itemKey !== oldKey;
          });

          if (existingItem) {
            // If same configuration exists, merge quantities and remove old item
            set({
              items: items
                .filter((item) => {
                  const itemKey = getCartItemKey({
                    id: item.id,
                    size_id: item.size_id || null,
                    ingredients: item.ingredients || [],
                  });
                  return itemKey !== oldKey;
                })
                .map((item) => {
                  const itemKey = getCartItemKey({
                    id: item.id,
                    size_id: item.size_id || null,
                    ingredients: item.ingredients || [],
                  });
                  if (itemKey === newKey) {
                    return { ...item, quantity: item.quantity + updatedItem.quantity };
                  }
                  return item;
                }),
            });
          } else {
            // Remove old item and add new one
            set({
              items: items
                .filter((item) => {
                  const itemKey = getCartItemKey({
                    id: item.id,
                    size_id: item.size_id || null,
                    ingredients: item.ingredients || [],
                  });
                  return itemKey !== oldKey;
                })
                .concat([updatedItem]),
            });
          }
        } else {
          // Key didn't change, just update the item in place
          set({
            items: items.map((item) => {
              const itemKey = getCartItemKey({
                id: item.id,
                size_id: item.size_id || null,
                ingredients: item.ingredients || [],
              });
              return itemKey === oldKey ? updatedItem : item;
            }),
          });
        }

        return true;
      },

      // Derived state (computed values)
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => {
            // Use final_price if available, otherwise use price
            const itemPrice = item.final_price || item.price;
            return sum + itemPrice * item.quantity;
          },
          0
        );
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxableAmount = subtotal - discount;
        return taxableAmount * TAX_RATE;
      },

      getDiscount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;
        
        const subtotal = get().getSubtotal();
        
        // Handle different coupon types based on API response structure
        if (coupon.type === 'percentage') {
          // For percentage: use discount_amount from API if available (already calculated)
          // Otherwise calculate from value
          if (coupon.discount_amount && coupon.discount_amount > 0) {
            return Math.min(coupon.discount_amount, subtotal);
          }
          // Fallback: calculate from percentage value
          const discount = (subtotal * coupon.value) / 100;
          return Math.min(discount, subtotal);
        } else if (coupon.type === 'fixed_amount') {
          // For fixed amount: use value directly (discount_amount might be 0 in API response)
          return Math.min(coupon.value, subtotal); // Don't exceed subtotal
        } else if (coupon.type === 'FREEDELIVERY') {
          // Free delivery coupons don't affect subtotal discount
          return 0;
        }
        
        // Fallback: use discount_amount if available
        if (coupon.discount_amount && coupon.discount_amount > 0) {
          return Math.min(coupon.discount_amount, subtotal);
        }
        
        return 0;
      },

      getDeliveryCharge: () => {
        const orderType = get().orderType;
        if (orderType === 'pickup') {
          return 0;
        }
        
        // Check if coupon provides free delivery
        const coupon = get().coupon;
        if (coupon && (coupon.type === 'FREEDELIVERY' || coupon.is_free_delivery)) {
          return 0;
        }
        
        return get().deliveryCharge || 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const tax = get().getTax();
        const delivery = get().getDeliveryCharge();
        
        return subtotal - discount + tax + delivery;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Migration: Ensure all items have image property
      migrate: (persistedState, version) => {
        if (persistedState?.items) {
          persistedState.items = persistedState.items.map((item) => {
            // If item doesn't have image, try to fetch it from API or set placeholder
            if (!item.image) {
              // Try to get image from various possible sources
              item.image = item.image_url || item.imageUrl || null;
            }
            return item;
          });
        }
        return persistedState;
      },
      version: 1,
    }
  )
);

export default useCartStore;

