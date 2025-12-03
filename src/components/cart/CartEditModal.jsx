"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ProductSizes from "../pages/shop/ProductSizes";
import ProductIngredients from "../pages/shop/ProductIngredients";
import { formatCurrency } from "../../lib/utils/formatters";
import api from "../../api";
import { transformMenuItemToProduct } from "../../lib/utils/productTransform";

/**
 * CartEditModal Component
 * Modal for editing cart item customization (sizes and ingredients)
 */
export default function CartEditModal({ isOpen, onClose, cartItem, onSave }) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState(cartItem?.size_id || null);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState(
    cartItem?.ingredients || []
  );

  // Fetch product data if not available
  useEffect(() => {
    if (isOpen && cartItem?.id && !product) {
      setIsLoading(true);
      api.menu
        .getMenuItemById(cartItem.id)
        .then((response) => {
          // Extract product data from response
          let productData = null;
          if (response?.success && response?.data) {
            productData = response.data.item || response.data;
          } else if (response?.data) {
            productData = response.data.item || response.data;
          } else if (typeof response === "object" && !Array.isArray(response)) {
            if (response.id || response.name || response.menu_item_id) {
              productData = response;
            }
          }

          if (productData) {
            const transformed = transformMenuItemToProduct(productData);
            setProduct(transformed);
            // Initialize selections from cart item
            setSelectedSizeId(cartItem.size_id || transformed.default_size_id || null);
            setSelectedIngredientIds(cartItem.ingredients || []);
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, cartItem?.id, product]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProduct(null);
      setSelectedSizeId(cartItem?.size_id || null);
      setSelectedIngredientIds(cartItem?.ingredients || []);
    }
  }, [isOpen, cartItem]);

  // Calculate final price
  // Note: size.price from API is the FULL price for that size, not an addition
  // So we use size.price directly instead of adding it to base_price
  const finalPrice = useMemo(() => {
    if (!product) return cartItem?.final_price || cartItem?.price || 0;

    let price = 0;

    // If a size is selected, use its price directly (it's the full price for that size)
    if (selectedSizeId && product.sizes) {
      const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);
      if (selectedSize) {
        price = parseFloat(selectedSize.price || 0);
      }
    } else {
      // If no size selected, use base_price (fallback for products without sizes)
      price = product.base_price || product.price || 0;
    }

    // Add ingredients prices (these are additions, not full prices)
    if (selectedIngredientIds.length > 0 && product.ingredients) {
      selectedIngredientIds.forEach((ingredientId) => {
        const ingredient = product.ingredients.find((ing) => ing.id === ingredientId);
        if (ingredient) {
          price += parseFloat(ingredient.price || 0);
        }
      });
    }

    return price;
  }, [product, selectedSizeId, selectedIngredientIds, cartItem]);

  // Handle size change
  const handleSizeChange = useCallback((sizeId) => {
    setSelectedSizeId(sizeId);
  }, []);

  // Handle ingredient toggle
  const handleIngredientToggle = useCallback((ingredientId) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    if (!product) return;

    // Validation: Check if size is required but not selected
    if (product.has_sizes && !selectedSizeId) {
      return; // Don't save if size is required but not selected
    }

    // Get selected size and ingredients data
    const selectedSize = product.sizes?.find((s) => s.id === selectedSizeId) || null;
    const selectedIngredients =
      product.ingredients?.filter((ing) => selectedIngredientIds.includes(ing.id)) || [];

    // Prepare updates
    const updates = {
      size_id: selectedSizeId,
      size_name: selectedSize?.name || null,
      ingredients: selectedIngredientIds,
      ingredients_data: selectedIngredients,
      final_price: finalPrice,
      price: finalPrice, // Update price as well
      image: product.image || cartItem?.image || null, // Preserve image from product or cart item
    };

    if (onSave) {
      onSave(updates);
    }

    onClose();
  }, [product, selectedSizeId, selectedIngredientIds, finalPrice, cartItem, onSave, onClose]);

  // Use portal to render modal at document body level
  if (typeof window === 'undefined') return null;
  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-md"
          onClick={onClose}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl xl:max-w-5xl bg-linear-to-br from-bgimg/98 via-bgimg/95 to-bgimg/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxHeight: '90vh',
              maxWidth: '90vw',
              margin: 'auto',
              position: 'relative'
            }}
          >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 shrink-0 bg-linear-to-r from-bgimg/95 via-bgimg/90 to-bgimg/95 backdrop-blur-sm relative z-10">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-black truncate pr-4 drop-shadow-lg">
              Edit Item: <span className="text-theme3">{cartItem?.name || "Product"}</span>
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 shrink-0 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme3"></div>
              </div>
            ) : product ? (
              <div className="space-y-6">
                {/* Sizes Section */}
                {product.has_sizes && (
                  <ProductSizes
                    sizes={product.sizes || []}
                    selectedSizeId={selectedSizeId}
                    onSizeChange={handleSizeChange}
                  />
                )}

                {/* Ingredients Section */}
                {product.has_ingredients && (
                  <ProductIngredients
                    ingredients={product.ingredients || []}
                    selectedIngredientIds={selectedIngredientIds}
                    onIngredientToggle={handleIngredientToggle}
                  />
                )}

                {/* Price Summary */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-4 bg-theme3/10 rounded-xl border border-theme3/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white  text-base font-semibold">
                      Total Price:
                    </span>
                    <span className="text-theme3  text-2xl font-black">
                      {formatCurrency(finalPrice)}
                    </span>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text text-base">Failed to load product data</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 p-4 sm:p-6 border-t border-white/10 shrink-0">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white/20 text-white rounded-xl hover:border-white/40 transition-colors font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !product || (product.has_sizes && !selectedSizeId)}
              className="w-full sm:w-auto px-6 py-3 bg-theme3 text-white rounded-xl hover:bg-theme transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Save Changes
            </button>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

