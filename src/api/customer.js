/**
 * Customer API endpoints
 * Handles customer addresses, favorites (wishlist), and order history
 */

import axiosInstance from './config/axios';

/**
 * Get customer addresses
 * @returns {Promise<Object>} Response with customer addresses list
 */
export const getAddresses = async () => {
  const response = await axiosInstance.get('/customer/addresses');
  return response;
};

/**
 * Save a new address
 * @param {Object} addressData - Address data
 * @param {string} addressData.address - Full address string
 * @param {number} addressData.latitude - Address latitude
 * @param {number} addressData.longitude - Address longitude
 * @param {string} addressData.label - Address label (e.g., "Home", "Work") (optional)
 * @returns {Promise<Object>} Response with saved address
 */
export const saveAddress = async (addressData) => {
  const response = await axiosInstance.post('/customer/addresses', addressData);
  return response;
};

/**
 * Get customer favorites (wishlist)
 * @returns {Promise<Object>} Response with favorites list
 */
export const getFavorites = async () => {
  const response = await axiosInstance.get('/customer/favorites');
  return response;
};

/**
 * Add item to favorites
 * @param {number} menuItemId - Menu item ID to add to favorites
 * @returns {Promise<Object>} Response confirming item added to favorites
 */
export const addToFavorites = async (menuItemId) => {
  const response = await axiosInstance.post(`/customer/favorites/${menuItemId}`);
  return response;
};

/**
 * Remove item from favorites
 * @param {number} menuItemId - Menu item ID to remove from favorites
 * @returns {Promise<Object>} Response confirming item removed from favorites
 */
export const removeFromFavorites = async (menuItemId) => {
  const response = await axiosInstance.delete(`/customer/favorites/${menuItemId}`);
  return response;
};

/**
 * Get customer order history
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by order status (optional)
 * @param {string} params.from_date - Filter orders from date (optional, format: YYYY-MM-DD)
 * @param {string} params.to_date - Filter orders to date (optional, format: YYYY-MM-DD)
 * @returns {Promise<Object>} Response with order history
 */
export const getOrderHistory = async (params = {}) => {
  const response = await axiosInstance.get('/customer/order-history', { params });
  return response;
};

// Default export with all customer functions
const customerAPI = {
  getAddresses,
  saveAddress,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getOrderHistory,
};

export default customerAPI;

