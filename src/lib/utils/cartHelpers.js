/**
 * Utility functions for cart operations
 */

/**
 * Validate product before adding to cart
 * @param {Object} product - Product object
 * @param {Object} customization - Customization object { sizeId, ingredientIds, selectedOptions, isValid }
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateProductForCart(product, customization = {}) {
  if (!product) {
    return { isValid: false, error: "Product is required" };
  }

  // Use isValid from customization if available (from option groups validation)
  if (customization.isValid === false) {
    return { isValid: false, error: "Please select required options" };
  }

  // Legacy: Check if size is required but not selected (for products without option_groups)
  if (product?.has_sizes && !product?.has_option_groups && !customization.sizeId) {
    return { isValid: false, error: "Please select a size" };
  }

  // Check option groups requirements
  if (product?.option_groups && Array.isArray(product.option_groups)) {
    const selectedOptions = customization.selectedOptions || {};
    for (const group of product.option_groups) {
      if (group.is_required) {
        const selectedItemIds = selectedOptions[group.id] || [];
        const minSelection = parseInt(group.min_selection || 0, 10);
        if (selectedItemIds.length < minSelection) {
          return { isValid: false, error: `Please select at least ${minSelection} option(s) from ${group.name}` };
        }
      }
    }
  }

  return { isValid: true, error: null };
}

/**
 * Build cart item object from product and customization
 * @param {Object} product - Product object
 * @param {Object} customization - Customization object { sizeId, ingredientIds, selectedOptions, selectedCustomizations, finalPrice }
 * @param {number} quantity - Quantity to add
 * @returns {Object} Cart item object
 */
export function buildProductCartItem(product, customization = {}, quantity = 1) {
  if (!product) return null;

  // Get selected size and ingredients data (legacy support)
  const selectedSize = product?.sizes?.find((s) => s.id === customization.sizeId) || null;
  const selectedIngredients = product?.ingredients?.filter((ing) =>
    customization.ingredientIds?.includes(ing.id)
  ) || [];

  return {
    id: product.id,
    name: product.title,
    price: customization.finalPrice || product.price || product.base_price || 0,
    base_price: product.base_price || product.price || 0,
    image: product.image,
    title: product.title,
    // Size information (legacy)
    size_id: customization.sizeId || null,
    size_name: selectedSize?.name || null,
    // Ingredients information (legacy)
    ingredients: customization.ingredientIds || [],
    ingredients_data: selectedIngredients,
    // New: Option groups selections
    selected_options: customization.selectedOptions || null,
    // New: Customizations selections (allergens, drinks, toppings, sauces)
    selected_customizations: customization.selectedCustomizations || {
      allergens: [],
      drinks: [],
      toppings: [],
      sauces: []
    },
    // Final calculated price
    final_price: customization.finalPrice || product.price || product.base_price || 0,
  };
}

/**
 * Check if cart item has any customization
 * @param {Object} item - Cart item object
 * @returns {boolean} True if item has any customization
 */
export function hasAnyCustomization(item) {
  if (!item) return false;
  
  return !!(
    item.size_name ||
    (item.ingredients_data && item.ingredients_data.length > 0) ||
    (item.selected_options && typeof item.selected_options === 'object' && Object.keys(item.selected_options).length > 0) ||
    (item.selected_customizations && typeof item.selected_customizations === 'object' && (
      (item.selected_customizations.drinks && item.selected_customizations.drinks.length > 0) ||
      (item.selected_customizations.toppings && item.selected_customizations.toppings.length > 0) ||
      (item.selected_customizations.sauces && item.selected_customizations.sauces.length > 0) ||
      (item.selected_customizations.allergens && item.selected_customizations.allergens.length > 0)
    ))
  );
}

/**
 * Get formatted display text for customizations
 * Returns an object with different customization parts for flexible display
 * @param {Object} item - Cart item object
 * @param {Object} product - Product object (optional, for getting option group names)
 * @param {Function} t - Translation function
 * @param {string} lang - Language code
 * @returns {Object} Object with customization parts: { size, ingredients, options, customizations }
 */
export function getCustomizationDisplayText(item, product = null, t = null, lang = 'bg') {
  if (!item) return { size: null, ingredients: null, options: null, customizations: null };

  const parts = {
    size: item.size_name || null,
    ingredients: item.ingredients_data && item.ingredients_data.length > 0
      ? item.ingredients_data.map(ing => ing.name).join(", ")
      : null,
    options: null,
    customizations: null
  };

  // Format selected_options
  if (item.selected_options && typeof item.selected_options === 'object') {
    const optionParts = [];
    if (product && product.option_groups) {
      // If we have product data, show group names and item names
      Object.entries(item.selected_options).forEach(([groupId, itemIds]) => {
        if (Array.isArray(itemIds) && itemIds.length > 0) {
          const group = product.option_groups.find(g => g.id === parseInt(groupId, 10));
          if (group) {
            const selectedItems = itemIds
              .map(itemId => group.items.find(i => i.id === itemId))
              .filter(Boolean)
              .map(item => item.name);
            if (selectedItems.length > 0) {
              optionParts.push(`${group.name}: ${selectedItems.join(", ")}`);
            }
          }
        }
      });
    } else {
      // Fallback: just show count
      const totalOptions = Object.values(item.selected_options)
        .reduce((sum, itemIds) => sum + (Array.isArray(itemIds) ? itemIds.length : 0), 0);
      if (totalOptions > 0) {
        optionParts.push(`${totalOptions} ${t ? t(lang, "options") : "options"}`);
      }
    }
    parts.options = optionParts.length > 0 ? optionParts.join("; ") : null;
  }

  // Format selected_customizations
  if (item.selected_customizations && typeof item.selected_customizations === 'object') {
    const customizationParts = [];
    const customizations = item.selected_customizations;

    if (product && product.customizations) {
      // If we have product data, show names
      ['drinks', 'toppings', 'sauces', 'allergens'].forEach(type => {
        const selectedIds = customizations[type] || [];
        if (Array.isArray(selectedIds) && selectedIds.length > 0) {
          const group = product.customizations[type];
          if (group && Array.isArray(group.available)) {
            const selectedItems = selectedIds
              .map(id => group.available.find(i => i.id === id))
              .filter(Boolean)
              .map(item => item.name);
            if (selectedItems.length > 0) {
              const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
              customizationParts.push(`${typeLabel}: ${selectedItems.join(", ")}`);
            }
          }
        }
      });
    } else {
      // Fallback: show counts
      ['drinks', 'toppings', 'sauces', 'allergens'].forEach(type => {
        const selectedIds = customizations[type] || [];
        if (Array.isArray(selectedIds) && selectedIds.length > 0) {
          const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
          customizationParts.push(`${typeLabel}: ${selectedIds.length}`);
        }
      });
    }

    parts.customizations = customizationParts.length > 0 ? customizationParts.join("; ") : null;
  }

  return parts;
}

/**
 * Generate customization text for toast notification
 * @param {Object} selectedSize - Selected size object
 * @param {Array} selectedIngredients - Array of selected ingredient objects
 * @param {Function} t - Translation function
 * @param {string} lang - Language code
 * @returns {string} Customization text
 */
export function getCustomizationText(selectedSize, selectedIngredients, t, lang) {
  const parts = [
    selectedSize?.name,
    selectedIngredients.length > 0 && `${selectedIngredients.length} ${t(lang, "add_ons")}`,
  ].filter(Boolean);

  return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

