"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProductSizes from "./ProductSizes";
import ProductIngredients from "./ProductIngredients";
import { formatCurrency } from "../../lib/utils/formatters";

/**
 * ProductCustomization Component
 * Container component that manages size and ingredient selection
 * @param {Object} props
 * @param {Object} product - Product object with sizes and ingredients
 * @param {Function} props.onCustomizationChange - Callback when customization changes
 */
export default function ProductCustomization({ product, onCustomizationChange }) {
  const [selectedSizeId, setSelectedSizeId] = useState(product?.default_size_id || null);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
  
  // Use ref to store the latest callback to avoid including it in useEffect dependencies
  const onCustomizationChangeRef = useRef(onCustomizationChange);
  
  // Update ref when callback changes
  useEffect(() => {
    onCustomizationChangeRef.current = onCustomizationChange;
  }, [onCustomizationChange]);

  // Calculate final price
  // Note: size.price from API is the FULL price for that size, not an addition
  // So we use size.price directly instead of adding it to base_price
  const finalPrice = useMemo(() => {
    let price = 0;

    // If a size is selected, use its price directly (it's the full price for that size)
    if (selectedSizeId && product?.sizes) {
      const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);
      if (selectedSize) {
        price = parseFloat(selectedSize.price || 0);
      }
    } else {
      // If no size selected, use base_price (fallback for products without sizes)
      price = product?.base_price || product?.price || 0;
    }

    // Add ingredients prices (these are additions, not full prices)
    if (selectedIngredientIds.length > 0 && product?.ingredients) {
      selectedIngredientIds.forEach((ingredientId) => {
        const ingredient = product.ingredients.find((ing) => ing.id === ingredientId);
        if (ingredient) {
          price += parseFloat(ingredient.price || 0);
        }
      });
    }

    return price;
  }, [product, selectedSizeId, selectedIngredientIds]);

  const handleSizeChange = useCallback((sizeId) => {
    setSelectedSizeId(sizeId);
  }, []);

  const handleIngredientToggle = useCallback((ingredientId) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  }, []);

  // Update parent when customization changes
  // Use ref to access the latest callback without including it in dependencies
  // This prevents the error of updating parent state during child render
  useEffect(() => {
    if (onCustomizationChangeRef.current) {
      onCustomizationChangeRef.current({
        sizeId: selectedSizeId,
        ingredientIds: selectedIngredientIds,
        finalPrice,
      });
    }
  }, [finalPrice, selectedSizeId, selectedIngredientIds]);

  // Don't render if product has no sizes or ingredients
  if (!product?.has_sizes && !product?.has_ingredients) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="product-customization mb-8 pb-8 border-b border-white/10"
    >
      {/* Sizes Section */}
      {product?.has_sizes && (
        <ProductSizes
          sizes={product.sizes || []}
          selectedSizeId={selectedSizeId}
          onSizeChange={handleSizeChange}
        />
      )}

      {/* Ingredients Section */}
      {product?.has_ingredients && (
        <ProductIngredients
          ingredients={product.ingredients || []}
          selectedIngredientIds={selectedIngredientIds}
          onIngredientToggle={handleIngredientToggle}
        />
      )}

      {/* Price Summary */}
      {(product?.has_sizes || product?.has_ingredients) && (
        <div className="mt-6 p-4 bg-theme3/10 rounded-xl border border-theme3/30">
          <div className="flex items-center justify-between">
            <span className="text-white  text-base font-semibold">
              Total Price:
            </span>
            <span className="text-theme3  text-2xl font-black">
              {formatCurrency(finalPrice)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

