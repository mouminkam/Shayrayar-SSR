/**
 * Format price to always show 2 decimal places
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

/**
 * Format currency with symbol
 * @param {number} price - The price to format
 * @param {string} symbol - Currency symbol (default: 'BGN')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (price, symbol = 'BGN') => {
  return `${symbol} ${formatPrice(price)}`;
};

