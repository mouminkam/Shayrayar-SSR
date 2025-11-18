/**
 * Coupons API endpoints
 * Handles coupon validation and retrieval
 */

import axiosInstance from './config/axios';

/**
 * Validate a coupon code
 * @param {Object} params - Validation parameters
 * @param {string} params.code - Coupon code
 * @param {number} params.order_amount - Order amount for validation
 * @param {number} params.branch_id - Branch ID
 * @returns {Promise<Object>} Response with coupon validation result and discount details
 */
export const validateCoupon = async (params) => {
  const response = await axiosInstance.get('/coupons/validate', { params });
  return response;
};

/**
 * Get available coupons
 * @param {Object} params - Query parameters
 * @param {number} params.branch_id - Branch ID (required)
 * @returns {Promise<Object>} Response with available coupons list
 */
export const getAvailableCoupons = async (params) => {
  const response = await axiosInstance.get('/coupons', { params });
  return response;
};

// Default export with all coupon functions
const couponsAPI = {
  validateCoupon,
  getAvailableCoupons,
};

export default couponsAPI;

