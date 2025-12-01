"use client";
import { useMemo } from "react";
import { calculateProductPrice } from "../lib/utils/productPrice";

/**
 * Hook to calculate and manage product price based on customization
 * @param {Object} product - Product object
 * @param {number|null} selectedSizeId - Selected size ID
 * @param {Array<number>} selectedIngredientIds - Array of selected ingredient IDs
 * @returns {number} Final calculated price
 */
export function useProductPrice(product, selectedSizeId = null, selectedIngredientIds = []) {
  const finalPrice = useMemo(() => {
    return calculateProductPrice(product, selectedSizeId, selectedIngredientIds);
  }, [product, selectedSizeId, selectedIngredientIds]);

  return finalPrice;
}

