/**
 * Menu API endpoints
 * Handles menu categories, menu items, search, and highlights
 */

import axiosInstance from './config/axios';

/**
 * Get menu categories
 * @param {Object} params - Query parameters
 * @param {number} params.branch_id - Branch ID (optional)
 * @returns {Promise<Object>} Response with menu categories list
 */
export const getMenuCategories = async (params = {}) => {
  const response = await axiosInstance.get('/menu-categories', { params });
  return response;
};

/**
 * Get menu items
 * @param {Object} params - Query parameters
 * @param {number} params.branch_id - Branch ID (required)
 * @param {number} params.category_id - Filter by category ID (optional)
 * @param {string} params.search - Search query (optional)
 * @param {boolean} params.featured - Filter featured items (optional)
 * @param {number} params.page - Page number for pagination (optional)
 * @param {number} params.limit - Items per page (optional)
 * @returns {Promise<Object>} Response with menu items list
 */
export const getMenuItems = async (params = {}) => {
  const response = await axiosInstance.get('/menu-items', { params });
  return response;
};

/**
 * Get specific menu item by ID
 * @param {number} itemId - Menu item ID
 * @returns {Promise<Object>} Response with menu item details
 */
export const getMenuItemById = async (itemId) => {
  const response = await axiosInstance.get(`/menu-items/${itemId}`);
  return response;
};

/**
 * Search menu items
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query
 * @param {number} params.branch_id - Branch ID (required)
 * @param {number} params.category_id - Filter by category ID (optional)
 * @returns {Promise<Object>} Response with search results
 */
export const searchMenuItems = async (params) => {
  const response = await axiosInstance.get('/menu-items/search', { params });
  return response;
};

/**
 * Get highlighted menu items (for home page)
 * @param {Object} params - Query parameters
 * @param {number} params.branch_id - Branch ID (required)
 * @returns {Promise<Object>} Response with highlighted menu items
 */
export const getHighlights = async (params) => {
  const response = await axiosInstance.get('/menu-items/highlights', { params });
  return response;
};

// Default export with all menu functions
const menuAPI = {
  getMenuCategories,
  getMenuItems,
  getMenuItemById,
  searchMenuItems,
  getHighlights,
};

export default menuAPI;

