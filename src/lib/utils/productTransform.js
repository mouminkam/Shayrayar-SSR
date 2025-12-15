/**
 * Utility functions to transform API menu item data to frontend product structure
 */
import { IMAGE_PATHS } from "../../data/constants";

/**
 * Get localized field value based on language
 * Priority: name_{lang} > name (fallback)
 * @param {Object} obj - Object containing localized fields
 * @param {string} fieldName - Base field name (e.g., 'name', 'description')
 * @param {string} lang - Language code ('en', 'bg')
 * @returns {string} Localized value or fallback
 */
export const getLocalizedField = (obj, fieldName, lang = 'bg') => {
  if (!obj) return '';
  
  // Map language codes to field suffixes
  const langMap = {
    'en': 'en',
    'bg': 'bg',
    // 'ar': 'ar' - not needed per requirements
  };
  
  const suffix = langMap[lang];
  if (suffix) {
    const localizedField = `${fieldName}_${suffix}`;
    if (obj[localizedField]) {
      return obj[localizedField];
    }
  }
  
  // Fallback to default field
  return obj[fieldName] || '';
};

/**
 * Transform customizations from API format to frontend format
 * @param {Object} customizations - Customizations object from API
 * @param {string} lang - Language code ('en', 'bg')
 * @returns {Object} Transformed customizations object
 */
export const transformCustomizations = (customizations, lang = 'bg') => {
  if (!customizations) return null;
  
  const transformCustomizationGroup = (group, groupName) => {
    if (!group || !Array.isArray(group.available)) return null;
    
    return {
      name: groupName, // 'allergens', 'drinks', 'toppings', 'sauces'
      available: group.available.map(item => ({
        id: item.id,
        name: getLocalizedField(item, 'name', lang),
        description: getLocalizedField(item, 'description', lang),
        price: parseFloat(item.price || item.base_price || item.final_price || 0),
        final_price: parseFloat(item.final_price || item.price || item.base_price || 0),
        image: item.image_url || item.image || null,
        is_free: item.is_free || false,
        is_active: item.is_active !== false,
        sort_order: parseInt(item.sort_order || 0, 10),
        original: item,
      })),
      min_selection: parseInt(group.min_selection || 0, 10),
      max_selection: group.max_selection ? parseInt(group.max_selection, 10) : null,
      has_free_options: group.has_free_options || false,
      total_available: group.total_available || group.available.length,
    };
  };
  
  return {
    allergens: transformCustomizationGroup(customizations.allergens, 'allergens'),
    drinks: transformCustomizationGroup(customizations.drinks, 'drinks'),
    toppings: transformCustomizationGroup(customizations.toppings, 'toppings'),
    sauces: transformCustomizationGroup(customizations.sauces, 'sauces'),
  };
};

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

export const transformMenuItemToProduct = (menuItem, optionGroups = [], lang = 'bg', customizations = null) => {
  if (!menuItem) return null;

  // Extract sizes and ingredients (API provides them directly)
  // These are kept for backward compatibility with old products
  const sizesArray = Array.isArray(menuItem.sizes) ? menuItem.sizes : [];
  const ingredientsArray = Array.isArray(menuItem.ingredients) ? menuItem.ingredients : [];

  // Get base price - API provides default_price
  const basePrice = parseFloat( menuItem.price ||menuItem.default_price || 0);

  // Get default size (size with is_default flag, or first size)
  // Note: We keep default_size_id for backward compatibility but won't use it as default selection
  const defaultSize = sizesArray.find(s => s.is_default) || sizesArray[0] || null;
  const defaultSizeId = defaultSize?.id || null;

  // Display price: always use basePrice (which represents price from API)
  // basePrice is the actual price from API response (menuItem.price)
  const displayPrice = basePrice;

  // Get localized name and description for menu item
  const itemName = getLocalizedField(menuItem, 'name', lang);
  const itemDescription = getLocalizedField(menuItem, 'description', lang);
  
  // Get localized category name
  const categoryName = menuItem.category 
    ? getLocalizedField(menuItem.category, 'name', lang)
    : '';

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

  // Transform customizations
  const transformedCustomizations = transformCustomizations(customizations, lang);
  const hasCustomizations = transformedCustomizations && (
    transformedCustomizations.allergens ||
    transformedCustomizations.drinks ||
    transformedCustomizations.toppings ||
    transformedCustomizations.sauces
  );

  return {
    id: menuItem.id,
    menu_item_id: menuItem.id,
    title: itemName,
    price: displayPrice,
    base_price: basePrice,
    image: getImageUrl(menuItem),
    description: itemDescription,
    longDescription: itemDescription,
    category: categoryName,
    category_id: menuItem.category_id || menuItem.category?.id || null,
    rating: menuItem.rating || 0,
    featured: menuItem.is_featured || false,
    // Sizes data (API provides: id, name, price, is_default) - kept for backward compatibility
    // Use localized name if available (name_en, name_bg), otherwise fallback to name
    sizes: sizesArray.map(size => ({
      id: size.id,
      name: getLocalizedField(size, 'name', lang),
      price: parseFloat(size.price || 0),
      is_default: size.is_default || false,
      original: size,
    })),
    // Ingredients data (API provides: id, name, price, pivot.is_required) - kept for backward compatibility
    // Use localized name for ingredients
    ingredients: ingredientsArray.map(ingredient => ({
      id: ingredient.id,
      name: getLocalizedField(ingredient, 'name', lang),
      price: parseFloat(ingredient.price || 0),
      category: null,
      is_required: ingredient.pivot?.is_required === 1 || false,
      original: ingredient,
    })),
    // New option_groups system
    option_groups: transformedOptionGroups,
    has_option_groups: transformedOptionGroups.length > 0,
    // Customizations system
    customizations: transformedCustomizations,
    has_customizations: hasCustomizations,
    has_allergens: transformedCustomizations?.allergens !== null,
    has_drinks: transformedCustomizations?.drinks !== null,
    has_toppings: transformedCustomizations?.toppings !== null,
    has_sauces: transformedCustomizations?.sauces !== null,
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
 * @param {string} lang - Language code ('en', 'bg'), defaults to 'bg'
 * @returns {Array} Array of product objects
 */
export const transformMenuItemsToProducts = (menuItems, lang = 'bg') => {
  if (!Array.isArray(menuItems)) return [];
  return menuItems.map(item => transformMenuItemToProduct(item, [], lang)).filter(Boolean);
};

/**
 * Transform API category to frontend category structure
 * @param {Object} category - Category from API
 * @param {string} lang - Language code ('en', 'bg'), defaults to 'bg'
 * @returns {Object} Category object for frontend
 */
export const transformCategory = (category, lang = 'bg') => {
  if (!category) return null;

  const categoryName = getLocalizedField(category, 'name', lang) || category.title || "";
  const categoryDescription = getLocalizedField(category, 'description', lang);

  return {
    id: category.id || category.category_id,
    name: categoryName,
    slug: category.slug || categoryName.toLowerCase().replace(/\s+/g, "-") || "",
    image: category.image || category.image_url || null,
    description: categoryDescription,
    product_count: category.product_count || category.items_count || 0,
    original: category,
  };
};

/**
 * Transform array of categories
 * @param {Array} categories - Array of categories from API
 * @param {string} lang - Language code ('en', 'bg'), defaults to 'bg'
 * @returns {Array} Array of category objects
 */
export const transformCategories = (categories, lang = 'bg') => {
  if (!Array.isArray(categories)) return [];
  return categories.map(category => transformCategory(category, lang)).filter(Boolean);
};

