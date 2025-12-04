"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useProductPrice } from "./useProductPrice";

/**
 * Hook to manage product customization (option groups, size and ingredients selection)
 * @param {Object} product - Product object
 * @param {Function} onCustomizationChange - Callback when customization changes
 * @returns {Object} Customization state and handlers
 */
export function useProductCustomization(product, onCustomizationChange) {
  // Legacy support: sizes and ingredients (for backward compatibility)
  const [selectedSizeId, setSelectedSizeId] = useState(null); // No default selection
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);

  // New option groups system
  // State: { [groupId]: [itemId1, itemId2, ...] }
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initialState = {};
    if (product?.option_groups) {
      product.option_groups.forEach(group => {
        initialState[group.id] = [];
      });
    }
    return initialState;
  });

  // Calculate final price
  const finalPrice = useMemo(() => {
    if (!product) return 0;

    let price = product.base_price || product.price || 0;

    // Legacy: Add size price if selected
    if (selectedSizeId && product.sizes) {
      const selectedSize = product.sizes.find(s => s.id === selectedSizeId);
      if (selectedSize) {
        price = parseFloat(selectedSize.price || 0);
      }
    }

    // Legacy: Add ingredients prices
    if (selectedIngredientIds.length > 0 && product.ingredients) {
      selectedIngredientIds.forEach(ingredientId => {
        const ingredient = product.ingredients.find(ing => ing.id === ingredientId);
        if (ingredient) {
          price += parseFloat(ingredient.price || 0);
        }
      });
    }

    // New: Add option groups price deltas
    if (product.option_groups && Array.isArray(product.option_groups)) {
      product.option_groups.forEach(group => {
        const selectedItemIds = selectedOptions[group.id] || [];
        selectedItemIds.forEach(itemId => {
          const item = group.items.find(i => i.id === itemId);
          if (item) {
            price += parseFloat(item.price_delta || 0);
          }
        });
      });
    }

    return price;
  }, [product, selectedSizeId, selectedIngredientIds, selectedOptions]);

  // Validate that all required option groups are satisfied
  const isValid = useMemo(() => {
    if (!product) return false;

    // Check required option groups (if any)
    if (product.option_groups && Array.isArray(product.option_groups) && product.option_groups.length > 0) {
      // Check each required option group
      for (const group of product.option_groups) {
        if (group.is_required) {
          const selectedItemIds = selectedOptions[group.id] || [];
          const minSelection = parseInt(group.min_selection || 0, 10);
          
          // If min_selection is 0 or not set, but group is required, at least 1 must be selected
          const requiredMin = minSelection > 0 ? minSelection : 1;
          
          if (selectedItemIds.length < requiredMin) {
            return false;
          }
        }
      }
    }

    // Check if size is required (works with or without option_groups)
    if (product.has_sizes && !selectedSizeId) {
      return false;
    }

    return true;
  }, [product, selectedSizeId, selectedOptions]);

  // Get list of missing required groups (for error messages)
  const missingRequiredGroups = useMemo(() => {
    if (!product) return [];
    
    const missing = [];
    
    // Check required option groups (if any)
    if (product.option_groups && Array.isArray(product.option_groups) && product.option_groups.length > 0) {
      product.option_groups.forEach(group => {
        if (group.is_required) {
          const selectedItemIds = selectedOptions[group.id] || [];
          const minSelection = parseInt(group.min_selection || 0, 10);
          const requiredMin = minSelection > 0 ? minSelection : 1;
          
          if (selectedItemIds.length < requiredMin) {
            missing.push({
              id: group.id,
              name: group.name,
              minSelection: requiredMin,
              currentSelection: selectedItemIds.length,
            });
          }
        }
      });
    }
    
    // Check if size is required (works with or without option_groups)
    if (product.has_sizes && !selectedSizeId) {
      missing.push({
        id: 'size',
        name: 'Size',
        minSelection: 1,
        currentSelection: 0,
      });
    }
    
    return missing;
  }, [product, selectedSizeId, selectedOptions]);

  // Update parent when customization changes
  useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange({
        sizeId: selectedSizeId,
        ingredientIds: selectedIngredientIds,
        selectedOptions, // New option groups selections
        finalPrice,
        isValid,
        missingRequiredGroups, // Add missing groups info for error messages
      });
    }
  }, [selectedSizeId, selectedIngredientIds, selectedOptions, finalPrice, isValid, missingRequiredGroups, onCustomizationChange]);

  // Legacy handlers
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

  // New option groups handlers
  const handleOptionGroupChange = useCallback((groupId, selectedItemIds) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: selectedItemIds,
    }));
  }, []);

  return {
    // Legacy
    selectedSizeId,
    selectedIngredientIds,
    handleSizeChange,
    handleIngredientToggle,
    // New
    selectedOptions,
    handleOptionGroupChange,
    // Common
    finalPrice,
    isValid,
    missingRequiredGroups, // For error messages and scroll
  };
}

