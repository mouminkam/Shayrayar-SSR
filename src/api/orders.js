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
 * @param {Array} orderData.items[].selected_options - Selected option groups (optional)
 * @param {number} orderData.items[].selected_options[].option_group_id - Option group ID
 * @param {Array<number>} orderData.items[].selected_options[].option_item_ids - Selected option item IDs
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
 * Get available coupons for an order
 * @param {Object} orderData - Order data to check available coupons
 * @param {number} orderData.order_amount - Order total amount
 * @param {number} orderData.branch_id - Branch ID
 * @param {Array} orderData.items - Order items array
 * @param {number} orderData.items[].menu_item_id - Menu item ID
 * @param {number} orderData.items[].quantity - Item quantity
 * @returns {Promise<Object>} Response with available coupons list
 */
export const getAvailableCoupons = async (orderData) => {
  const response = await axiosInstance.post('/orders/available-coupons', orderData);
  return response;
};

/**
 * Reorder a previous order
 * @param {number} orderId - Order ID to reorder
 * @returns {Promise<Object>} Response with items to add to cart and missing items
 * @returns {Promise<Object>} Response structure:
 * @returns {boolean} success - Whether the request was successful
 * @returns {Object} data - Response data
 * @returns {Array} data.items - Array of items to add to cart
 * @returns {number} data.items[].menu_item_id - Menu item ID
 * @returns {number} data.items[].size_id - Size ID (optional, nullable)
 * @returns {number} data.items[].quantity - Item quantity
 * @returns {string|null} data.items[].special_instructions - Special instructions (optional)
 * @returns {Array<number>|null} data.items[].selected_ingredients - Selected ingredient IDs (optional)
 * @returns {Array|null} data.items[].selected_options - Selected option groups (optional) - Format: [{ option_group_id: number, option_item_ids: number[] }]
 * @returns {Array<number>|null} data.items[].selected_drinks - Selected drink IDs from customizations (optional)
 * @returns {Array<number>|null} data.items[].selected_toppings - Selected topping IDs from customizations (optional)
 * @returns {Array<number>|null} data.items[].selected_sauces - Selected sauce IDs from customizations (optional)
 * @returns {Array<number>|null} data.items[].selected_allergens - Selected allergen IDs from customizations (optional)
 * @returns {Array} data.missing_items - Array of items that are no longer available
 * @returns {string} message - Success message
 * 
 * @note BACKEND REQUIREMENT: The backend MUST return all customization fields (selected_options, selected_drinks, 
 * selected_toppings, selected_sauces, selected_allergens) that were in the original order.
 * See REORDER_API_SPECIFICATION.md for complete backend requirements.
 */
export const reorderOrder = async (orderId) => {
  const response = await axiosInstance.post(`/orders/${orderId}/reorder`);
  return response;
};

// Default export with all order functions
const ordersAPI = {
  getUserOrders,
  createOrder,
  getOrderById,
  cancelOrder,
  getAvailableCoupons,
  reorderOrder,
};

export default ordersAPI;

