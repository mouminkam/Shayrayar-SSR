/**
 * Utility functions for calculating product prices
 */

/**
 * Calculate the final price of a product based on selected size and ingredients
 * 
 * Note: size.price from API is the FULL price for that size, not an addition
 * So we use size.price directly instead of adding it to base_price
 * 
 * @param {Object} product - Product object with sizes and ingredients
 * @param {number|null} selectedSizeId - Selected size ID
 * @param {Array<number>} selectedIngredientIds - Array of selected ingredient IDs
 * @returns {number} Final calculated price
 */
export function calculateProductPrice(product, selectedSizeId = null, selectedIngredientIds = []) {
  if (!product) return 0;

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
}

