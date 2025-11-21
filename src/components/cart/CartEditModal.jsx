"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ProductSizes from "../shop/ProductSizes";
import ProductIngredients from "../shop/ProductIngredients";
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
  const finalPrice = useMemo(() => {
    if (!product) return cartItem?.final_price || cartItem?.price || 0;

    let price = product.base_price || product.price || 0;

    // Add size price if selected
    if (selectedSizeId && product.sizes) {
      const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);
      if (selectedSize) {
        price += parseFloat(selectedSize.price || 0);
      }
    }

    // Add ingredients prices
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
    };

    if (onSave) {
      onSave(updates);
    }

    onClose();
  }, [product, selectedSizeId, selectedIngredientIds, finalPrice, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-linear-to-br from-bgimg/95 via-bgimg to-bgimg/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-white font-['Epilogue',sans-serif] text-2xl font-bold">
              Edit Item: {cartItem?.name || "Product"}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
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
                    <span className="text-white font-['Epilogue',sans-serif] text-base font-semibold">
                      Total Price:
                    </span>
                    <span className="text-theme3 font-['Epilogue',sans-serif] text-2xl font-black">
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
          <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-transparent border-2 border-white/20 text-white rounded-xl hover:border-white/40 transition-colors font-['Epilogue',sans-serif] font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !product || (product.has_sizes && !selectedSizeId)}
              className="px-6 py-3 bg-theme3 text-white rounded-xl hover:bg-theme transition-colors font-['Epilogue',sans-serif] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

