/**
 * Payments API endpoints
 * Handles Stripe and PayPal payment processing
 */

import axiosInstance from './config/axios';

/**
 * Create Stripe payment intent
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.order_id - Order ID
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.currency - Currency code (default: USD)
 * @returns {Promise<Object>} Response with Stripe payment intent client secret
 */
export const createStripePaymentIntent = async (paymentData) => {
  const response = await axiosInstance.post('/payments/stripe/create-payment-intent', paymentData);
  return response;
};

/**
 * Confirm Stripe payment
 * @param {Object} confirmData - Payment confirmation data
 * @param {string} confirmData.payment_intent_id - Stripe payment intent ID
 * @param {number} confirmData.order_id - Order ID
 * @returns {Promise<Object>} Response confirming payment
 */
export const confirmStripePayment = async (confirmData) => {
  const response = await axiosInstance.post('/payments/stripe/confirm-payment', confirmData);
  return response;
};

/**
 * Get Stripe configuration (publishable key)
 * @deprecated Use NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env variable instead
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

/**
 * Get Stripe payment status
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Response with payment status
 */
export const getStripePaymentStatus = async (paymentIntentId) => {
  const response = await axiosInstance.get(`/payments/stripe/web/status/${paymentIntentId}`);
  return response;
};

/**
 * Create PayPal order
 * @param {Object} orderData - PayPal order data
 * @param {number} orderData.order_id - Order ID
 * @param {number} orderData.amount - Payment amount
 * @param {string} orderData.currency - Currency code (default: USD)
 * @returns {Promise<Object>} Response with PayPal order ID
 */
export const createPayPalOrder = async (orderData) => {
  const response = await axiosInstance.post('/payments/paypal/create-order', orderData);
  return response;
};

/**
 * Capture PayPal order
 * @param {Object} captureData - PayPal capture data
 * @param {string} captureData.paypal_order_id - PayPal order ID
 * @param {number} captureData.order_id - Order ID
 * @returns {Promise<Object>} Response confirming payment capture
 */
export const capturePayPalOrder = async (captureData) => {
  const response = await axiosInstance.post('/payments/paypal/capture-order', captureData);
  return response;
};

// Default export with all payment functions
const paymentsAPI = {
  // Legacy Stripe functions (for backward compatibility)
  createStripePaymentIntent,
  confirmStripePayment,
  // New Stripe Web API functions
  getStripeConfig, // @deprecated - use NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env variable instead
  createStripePaymentIntentWeb,
  confirmStripePaymentWeb,
  getStripePaymentStatus,
  // PayPal functions
  createPayPalOrder,
  capturePayPalOrder,
};

export default paymentsAPI;

