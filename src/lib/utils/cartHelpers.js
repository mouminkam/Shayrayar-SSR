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
 * @param {Object} customization - Customization object { sizeId, ingredientIds, selectedOptions, finalPrice }
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
    // Final calculated price
    final_price: customization.finalPrice || product.price || product.base_price || 0,
  };
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

