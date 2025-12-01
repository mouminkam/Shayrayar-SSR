"use client";
import { useState, useCallback, useEffect } from "react";
import { useProductPrice } from "./useProductPrice";

/**
 * Hook to manage product customization (size and ingredients selection)
 * @param {Object} product - Product object
 * @param {Function} onCustomizationChange - Callback when customization changes
 * @returns {Object} Customization state and handlers
 */
export function useProductCustomization(product, onCustomizationChange) {
  const [selectedSizeId, setSelectedSizeId] = useState(product?.default_size_id || null);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);

  // Calculate final price using the price hook
  const finalPrice = useProductPrice(product, selectedSizeId, selectedIngredientIds);

  // Update parent when customization changes
  useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange({
        sizeId: selectedSizeId,
        ingredientIds: selectedIngredientIds,
        finalPrice,
      });
    }
  }, [selectedSizeId, selectedIngredientIds, finalPrice, onCustomizationChange]);

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

  return {
    selectedSizeId,
    selectedIngredientIds,
    finalPrice,
    handleSizeChange,
    handleIngredientToggle,
  };
}

