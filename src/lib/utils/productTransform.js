/**
 * Utility functions to transform API menu item data to frontend product structure
 */
import { IMAGE_PATHS } from "../../data/constants";

/**
 * Get full image URL from API response
 * API provides image_url as full URL, fallback to constructing from image path
 */
const getImageUrl = (menuItem) => {
  // API provides image_url as full URL
  if (menuItem.image_url) {
    return menuItem.image_url;
  }
  
  // Fallback: construct URL from relative image path
  if (menuItem.image) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shahrayar.peaklink.pro/api/v1";
    const storageBaseUrl = API_BASE_URL.replace("/api/v1", "");
    const cleanPath = menuItem.image.startsWith("/") ? menuItem.image.slice(1) : menuItem.image;
    return `${storageBaseUrl}/storage/${cleanPath}`;
  }
  
  return IMAGE_PATHS.placeholder;
};

export const transformMenuItemToProduct = (menuItem, optionGroups = []) => {
  if (!menuItem) return null;

  // Extract sizes and ingredients (API provides them directly)
  // These are kept for backward compatibility with old products
  const sizesArray = Array.isArray(menuItem.sizes) ? menuItem.sizes : [];
  const ingredientsArray = Array.isArray(menuItem.ingredients) ? menuItem.ingredients : [];

  // Get base price - API provides default_price
  const basePrice = parseFloat(menuItem.default_price || menuItem.price || 0);

  // Get default size (size with is_default flag, or first size)
  // Note: We keep default_size_id for backward compatibility but won't use it as default selection
  const defaultSize = sizesArray.find(s => s.is_default) || sizesArray[0] || null;
  const defaultSizeId = defaultSize?.id || null;
  const defaultSizePrice = defaultSize?.price ? parseFloat(defaultSize.price) : basePrice;

  // Display price: default size price if available, otherwise base price
  const displayPrice = defaultSizePrice || basePrice;

  // Transform option_groups from API format to frontend format
  const transformedOptionGroups = Array.isArray(optionGroups) ? optionGroups.map(group => ({
    id: group.id,
    name: group.name || "",
    description: group.description || null,
    type: group.type || null,
    is_required: group.is_required === true || group.is_required === 1,
    min_selection: parseInt(group.min_selection || 0, 10),
    max_selection: parseInt(group.max_selection || 0, 10),
    sort_order: parseInt(group.sort_order || 0, 10),
    items: Array.isArray(group.items) ? group.items.map(item => ({
      id: item.id,
      name: item.name || "",
      price_delta: parseFloat(item.price_delta || 0),
      sort_order: parseInt(item.sort_order || 0, 10),
      original: item,
    })) : [],
    original: group,
  })) : [];

  return {
    id: menuItem.id,
    menu_item_id: menuItem.id,
    title: menuItem.name || "",
    price: displayPrice,
    base_price: basePrice,
    image: getImageUrl(menuItem),
    description: menuItem.description || "",
    longDescription: menuItem.description || "",
    category: menuItem.category?.name || "",
    category_id: menuItem.category_id || menuItem.category?.id || null,
    rating: menuItem.rating || 0,
    featured: menuItem.is_featured || false,
    // Sizes data (API provides: id, name, price, is_default) - kept for backward compatibility
    sizes: sizesArray.map(size => ({
      id: size.id,
      name: size.name || "",
      price: parseFloat(size.price || 0),
      is_default: size.is_default || false,
      original: size,
    })),
    // Ingredients data (API provides: id, name, price, pivot.is_required) - kept for backward compatibility
    ingredients: ingredientsArray.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name || "",
      price: parseFloat(ingredient.price || 0),
      category: null,
      is_required: ingredient.pivot?.is_required === 1 || false,
      original: ingredient,
    })),
    // New option_groups system
    option_groups: transformedOptionGroups,
    has_option_groups: transformedOptionGroups.length > 0,
    // Backward compatibility fields
    default_size_id: defaultSizeId, // Kept but not used as default selection
    has_sizes: sizesArray.length > 0,
    has_ingredients: ingredientsArray.length > 0,
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

