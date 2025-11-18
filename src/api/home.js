/**
 * Home page API endpoints
 * Handles slides and highlights for the home page
 */

import axiosInstance from './config/axios';

/**
 * Get slides for home page banner
 * @param {Object} params - Query parameters
 * @param {number} params.branch_id - Branch ID (required)
 * @returns {Promise<Object>} Response with slides list
 */
export const getSlides = async (params) => {
  const response = await axiosInstance.get('/slides', { params });
  return response;
};

/**
 * Get highlighted menu items (for home page)
 * This is an alias for menu.getHighlights for convenience
 * @param {Object} params - Query parameters
 * @param {number} params.branch_id - Branch ID (required)
 * @returns {Promise<Object>} Response with highlighted menu items
 */
export const getHighlights = async (params) => {
  const response = await axiosInstance.get('/menu-items/highlights', { params });
  return response;
};

// Default export with all home functions
const homeAPI = {
  getSlides,
  getHighlights,
};

export default homeAPI;

