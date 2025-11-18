/**
 * Extracts menu items and total count from API response
 * Handles various response structures from Laravel API
 * @param {Object|Array} response - API response
 * @returns {{menuItems: Array, totalCount: number}}
 */
export function extractMenuItemsFromResponse(response) {
  let menuItems = [];
  let totalCount = 0;

  // Case 1: response has success and data
  if (response?.success && response.data) {
    // Check for nested items.data structure (most common)
    if (response.data.items?.data && Array.isArray(response.data.items.data)) {
      menuItems = response.data.items.data;
      totalCount = response.data.items.total || menuItems.length;
    }
    // Check for standard Laravel pagination (data.data)
    else if (Array.isArray(response.data.data)) {
      menuItems = response.data.data;
      totalCount = response.data.total || menuItems.length;
    }
    // Direct array in data
    else if (Array.isArray(response.data)) {
      menuItems = response.data;
      totalCount = response.total || menuItems.length;
    }
    // Nested items (array directly)
    else if (Array.isArray(response.data.items)) {
      menuItems = response.data.items;
      totalCount = response.data.total || menuItems.length;
    }
    // Fallback: try to extract from any nested structure
    else {
      menuItems = response.data.items?.data || 
                  response.data.menu_items || 
                  response.data.data || 
                  [];
      totalCount = response.data.items?.total || 
                   response.data.total || 
                   menuItems.length;
    }
  }
  // Case 2: response is array directly
  else if (Array.isArray(response)) {
    menuItems = response;
    totalCount = response.length;
  }
  // Case 3: response.data is array
  else if (response?.data && Array.isArray(response.data)) {
    menuItems = response.data;
    totalCount = response.total || response.data.length;
  }
  // Case 4: response has data object
  else if (response?.data) {
    menuItems = response.data.items || 
                response.data.menu_items || 
                response.data.data || 
                [];
    totalCount = response.data.total || 
                 response.total || 
                 menuItems.length;
  }
  // Case 5: response itself might be the data
  else if (response && typeof response === 'object') {
    menuItems = response.items || 
                response.menu_items || 
                response.data || 
                [];
    totalCount = response.total || menuItems.length;
  }

  // Ensure menuItems is an array
  if (!Array.isArray(menuItems)) {
    menuItems = [];
  }

  return { menuItems, totalCount };
}

