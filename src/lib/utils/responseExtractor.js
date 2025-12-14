/**
 * Extracts menu items and total count from API response
 * Based on actual API structure: { success: true, data: { items: { data: [], total: number } } }
 * @param {Object} response - API response
 * @returns {{menuItems: Array, totalCount: number}}
 */
export function extractMenuItemsFromResponse(response) {
  // Standard API response structure
  if (response?.success && response.data?.items?.data) {
    const menuItems = Array.isArray(response.data.items.data) 
      ? response.data.items.data 
      : [];
    const totalCount = response.data.items.total || menuItems.length;
    return { menuItems, totalCount };
  }

  // Fallback: direct data array (for single item responses)
  if (response?.success && response.data) {
    if (Array.isArray(response.data)) {
      return { menuItems: response.data, totalCount: response.data.length };
    }
    // Single item response
    if (response.data.id || response.data.menu_item_id) {
      return { menuItems: [response.data], totalCount: 1 };
    }
  }

  // Fallback: response is array directly
  if (Array.isArray(response)) {
    return { menuItems: response, totalCount: response.length };
  }

  // Default: empty
  return { menuItems: [], totalCount: 0 };
}

/**
 * Extracts categories from API response
 * Supports new structure: { success: true, data: { categories: [...] } }
 * @param {Object} response - API response
 * @returns {Array} Array of category objects
 */
export function extractCategoriesFromResponse(response) {
  if (!response) return [];
  
  // New structure: response.data.categories
  if (response?.success && response?.data?.categories) {
    return Array.isArray(response.data.categories) ? response.data.categories : [];
  }
  
  // Fallback: direct data array
  if (response?.success && response?.data) {
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.categories || response.data.data || [];
  }
  
  // Fallback: response is array directly
  if (Array.isArray(response)) {
    return response;
  }
  
  // Fallback: other structures
  return response?.data?.categories || response?.categories || response?.data || [];
}

