/**
 * Utility functions to transform API menu item data to frontend product structure
 */

/**
 * Transform API menu item to frontend product structure
 * @param {Object} menuItem - Menu item from API
 * @returns {Object} Product object for frontend
 */
/**
 * Get full image URL from API response
 * Handles both full URLs and relative paths
 */
const getImageUrl = (menuItem) => {
  // Priority: image_url (usually full URL) > image > thumbnail
  const imageUrl = menuItem.image_url || menuItem.image || menuItem.thumbnail;
  
  if (!imageUrl) {
    return "/img/placeholder.png";
  }
  
  // If it's already a full URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  
  // If it's a relative path, construct full URL
  // API base URL for storage
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shahrayar.peaklink.pro/api/v1";
  const storageBaseUrl = API_BASE_URL.replace("/api/v1", "");
  
  // Remove leading slash if present
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  
  return `${storageBaseUrl}/storage/${cleanPath}`;
};

export const transformMenuItemToProduct = (menuItem) => {
  if (!menuItem) return null;

  return {
    id: menuItem.id || menuItem.menu_item_id,
    title: menuItem.name || menuItem.title || "",
    price: parseFloat(menuItem.price || menuItem.default_price || menuItem.base_price || 0),
    image: getImageUrl(menuItem),
    description: menuItem.description || menuItem.short_description || "",
    longDescription: menuItem.long_description || menuItem.description || "",
    category: menuItem.category?.name || menuItem.category_name || "",
    category_id: menuItem.category_id || menuItem.category?.id || null,
    rating: menuItem.rating || menuItem.average_rating || 0,
    featured: menuItem.is_featured || menuItem.featured || false,
    // Keep original data for reference
    original: menuItem,
  };
};

/**
 * Transform array of menu items to products
 * @param {Array} menuItems - Array of menu items from API
 * @returns {Array} Array of product objects
 */
export const transformMenuItemsToProducts = (menuItems) => {
  if (!Array.isArray(menuItems)) return [];
  return menuItems.map(transformMenuItemToProduct).filter(Boolean);
};

/**
 * Transform API category to frontend category structure
 * @param {Object} category - Category from API
 * @returns {Object} Category object for frontend
 */
export const transformCategory = (category) => {
  if (!category) return null;

  return {
    id: category.id || category.category_id,
    name: category.name || category.title || "",
    slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, "-") || "",
    image: category.image || category.image_url || null,
    description: category.description || "",
    product_count: category.product_count || category.items_count || 0,
    original: category,
  };
};

/**
 * Transform array of categories
 * @param {Array} categories - Array of categories from API
 * @returns {Array} Array of category objects
 */
export const transformCategories = (categories) => {
  if (!Array.isArray(categories)) return [];
  return categories.map(transformCategory).filter(Boolean);
};

