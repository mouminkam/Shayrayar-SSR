/**
 * Delivery Boy API endpoints
 * Handles delivery boy authentication, dashboard, orders, and location updates
 */

import axiosInstance from './config/axios';

/**
 * Login delivery boy
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Delivery boy email
 * @param {string} credentials.password - Delivery boy password
 * @returns {Promise<Object>} Response with delivery boy data and token
 */
export const login = async (credentials) => {
  const response = await axiosInstance.post('/delivery-boy/login', credentials);
  return response;
};

/**
 * Get delivery boy dashboard
 * @returns {Promise<Object>} Response with dashboard data (stats, pending orders, etc.)
 */
export const getDashboard = async () => {
  const response = await axiosInstance.get('/delivery-boy/dashboard');
  return response;
};

/**
 * Get delivery boy orders
 * @param {Object} params - Query parameters (optional)
 * @param {string} params.status - Filter by order status (optional)
 * @returns {Promise<Object>} Response with orders list
 */
export const getOrders = async (params = {}) => {
  const response = await axiosInstance.get('/delivery-boy/orders', { params });
  return response;
};

/**
 * Accept an order
 * @param {number} orderId - Order ID to accept
 * @returns {Promise<Object>} Response confirming order acceptance
 */
export const acceptOrder = async (orderId) => {
  const response = await axiosInstance.post(`/delivery-boy/orders/${orderId}/accept`);
  return response;
};

/**
 * Update delivery boy location
 * @param {Object} locationData - Location data
 * @param {number} locationData.latitude - Current latitude
 * @param {number} locationData.longitude - Current longitude
 * @returns {Promise<Object>} Response confirming location update
 */
export const updateLocation = async (locationData) => {
  const response = await axiosInstance.post('/delivery-boy/location', locationData);
  return response;
};

/**
 * Get delivery boy notifications
 * @returns {Promise<Object>} Response with notifications list
 */
export const getNotifications = async () => {
  const response = await axiosInstance.get('/delivery-boy/notifications');
  return response;
};

// Default export with all delivery boy functions
const deliveryBoyAPI = {
  login,
  getDashboard,
  getOrders,
  acceptOrder,
  updateLocation,
  getNotifications,
};

export default deliveryBoyAPI;

