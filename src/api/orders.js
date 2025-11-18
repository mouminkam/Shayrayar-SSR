/**
 * Orders API endpoints
 * Handles order creation, retrieval, cancellation, and tracking
 */

import axiosInstance from './config/axios';

/**
 * Get user orders
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by order status (optional: pending, processing, completed, cancelled)
 * @param {string} params.from_date - Filter orders from date (optional, format: YYYY-MM-DD)
 * @param {string} params.to_date - Filter orders to date (optional, format: YYYY-MM-DD)
 * @returns {Promise<Object>} Response with user orders list
 */
export const getUserOrders = async (params = {}) => {
  const response = await axiosInstance.get('/orders', { params });
  return response;
};

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @param {number} orderData.branch_id - Branch ID
 * @param {string} orderData.order_type - Order type (pickup or delivery)
 * @param {number} orderData.subtotal - Order subtotal
 * @param {number} orderData.total_amount - Order total amount
 * @param {string} orderData.customer_name - Customer name
 * @param {string} orderData.customer_phone - Customer phone
 * @param {string} orderData.customer_email - Customer email
 * @param {string} orderData.delivery_address - Delivery address
 * @param {number} orderData.latitude - Delivery latitude (optional)
 * @param {number} orderData.longitude - Delivery longitude (optional)
 * @param {string} orderData.delivery_charge - Delivery charge
 * @param {string} orderData.tax_amount - Tax amount
 * @param {string} orderData.discount_amount - Discount amount
 * @param {Array} orderData.items - Order items array
 * @param {number} orderData.items[].menu_item_id - Menu item ID
 * @param {number} orderData.items[].quantity - Item quantity
 * @param {Array} orderData.items[].ingredients - Item ingredients (optional)
 * @param {number} orderData.items[].size_id - Size ID (optional)
 * @param {string} orderData.payment_method - Payment method (cash, card, etc.)
 * @param {string} orderData.notes - Order notes (optional)
 * @returns {Promise<Object>} Response with created order
 */
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders', orderData);
  return response;
};

/**
 * Get specific order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Response with order details
 */
export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response;
};

/**
 * Cancel an order
 * @param {number} orderId - Order ID
 * @param {Object} cancelData - Cancellation data
 * @param {string} cancelData.reason - Cancellation reason
 * @returns {Promise<Object>} Response confirming order cancellation
 */
export const cancelOrder = async (orderId, cancelData) => {
  const response = await axiosInstance.put(`/orders/${orderId}/cancel`, cancelData);
  return response;
};

/**
 * Track order status
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Response with order tracking information
 */
export const trackOrder = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}/track`);
  return response;
};

// Default export with all order functions
const ordersAPI = {
  getUserOrders,
  createOrder,
  getOrderById,
  cancelOrder,
  trackOrder,
};

export default ordersAPI;

