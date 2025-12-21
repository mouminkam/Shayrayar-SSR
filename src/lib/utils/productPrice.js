/**
 * Utility functions for calculating product prices
 */

/**
 * Calculate the final price of a product based on selected size and ingredients
 * 
 * Note: size.price from API is the FULL price for that size, not an addition
 * So we use size.price directly instead of adding it to base_price
 * 
 * @deprecated Use calculateProductPriceWithCustomizations() for full customization support
 * @param {Object} product - Product object with sizes and ingredients
 * @param {number|null} selectedSizeId - Selected size ID
 * @param {Array<number>} selectedIngredientIds - Array of selected ingredient IDs
 * @returns {number} Final calculated price
 */
export function calculateProductPrice(product, selectedSizeId = null, selectedIngredientIds = []) {
  if (!product) return 0;

  let price = product?.base_price || product?.price || 0;

  // If a size is selected, add its price to the base price
  if (selectedSizeId && product?.sizes) {
    const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);
    if (selectedSize) {
      price += parseFloat(selectedSize.price || 0);
    }
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
}

/**
 * Calculate the final price of a product with all customizations
 * Includes size, ingredients, option groups, and customizations (drinks, toppings, sauces, allergens)
 * 
 * @param {Object} product - Product object with sizes, ingredients, option_groups, and customizations
 * @param {number|null} selectedSizeId - Selected size ID
 * @param {Array<number>} selectedIngredientIds - Array of selected ingredient IDs
 * @param {Object|null} selectedOptions - Selected option groups { [groupId]: [itemId1, itemId2, ...] }
 * @param {Object|null} selectedCustomizations - Selected customizations { drinks: [], toppings: [], sauces: [], allergens: [] }
 * @returns {number} Final calculated price
 */
export function calculateProductPriceWithCustomizations(
  product,
  selectedSizeId = null,
  selectedIngredientIds = [],
  selectedOptions = null,
  selectedCustomizations = null
) {
  if (!product) return 0;

  let price = product.base_price || product.price || 0;

  // Legacy: Add size price if selected
  if (selectedSizeId && product.sizes) {
    const selectedSize = product.sizes.find(s => s.id === selectedSizeId);
    if (selectedSize) {
      price += parseFloat(selectedSize.price || 0);
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
  if (selectedOptions && product.option_groups && Array.isArray(product.option_groups)) {
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

  // Customizations: Add prices for selected customizations
  if (selectedCustomizations && product.customizations) {
    const customizationTypes = ['allergens', 'drinks', 'toppings', 'sauces'];
    customizationTypes.forEach(type => {
      const group = product.customizations[type];
      if (group && Array.isArray(group.available)) {
        const selectedIds = selectedCustomizations[type] || [];
        selectedIds.forEach(itemId => {
          const item = group.available.find(i => i.id === itemId);
          if (item && !item.is_free) {
            price += parseFloat(item.final_price || item.price || 0);
          }
        });
      }
    });
  }

  return price;
}

