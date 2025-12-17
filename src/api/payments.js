/**
 * Payments API endpoints
 * Handles Stripe and PayPal payment processing
 */

import axiosInstance from './config/axios';

/**
 * Get Stripe configuration (publishable key)
 * Fetches Stripe publishable key from API endpoint
 * @returns {Promise<Object>} Response with Stripe publishable key and currency
 */
export const getStripeConfig = async () => {
  const response = await axiosInstance.get('/payments/stripe/config');
  return response;
};

/**
 * Create Stripe payment intent (Web API - New)
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Response with Stripe payment intent client secret and publishable key
 */
export const createStripePaymentIntentWeb = async (orderId) => {
  const response = await axiosInstance.post('/payments/stripe/web/create-intent', {
    order_id: orderId,
  });
  return response;
};

/**
 * Confirm Stripe payment (Web API - New)
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {number} orderId - Order ID
 * @param {string} [quoteId] - Optional delivery quote ID
 * @returns {Promise<Object>} Response confirming payment with updated order
 */
export const confirmStripePaymentWeb = async (paymentIntentId, orderId, quoteId = null) => {
  const payload = {
    payment_intent_id: paymentIntentId,
    order_id: orderId,
  };
  
  // Add quote_id if provided (for delivery orders)
  if (quoteId) {
    payload.quote_id = quoteId;
  }
  
  const response = await axiosInstance.post('/payments/stripe/web/confirm', payload);
  return response;
};

// Default export with all payment functions
const paymentsAPI = {
  getStripeConfig,
  createStripePaymentIntentWeb,
  confirmStripePaymentWeb,
};

export default paymentsAPI;

