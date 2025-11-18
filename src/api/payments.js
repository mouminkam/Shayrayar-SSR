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
  createStripePaymentIntent,
  confirmStripePayment,
  createPayPalOrder,
  capturePayPalOrder,
};

export default paymentsAPI;

