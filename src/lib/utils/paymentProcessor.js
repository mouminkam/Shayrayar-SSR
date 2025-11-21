/**
 * Stripe Payment Processor
 * Handles payment intent creation, popup management, and payment confirmation
 */

import api from '../../api';

/**
 * Create Stripe Payment Intent via API
 * @param {number} orderId - Order ID
 * @param {number} amount - Payment amount (decimal, e.g., 25.50)
 * @param {string} currency - Currency code (default: USD)
 * @returns {Promise<Object>} { success: boolean, client_secret?: string, payment_intent_id?: string, error?: string }
 */
export const createStripePaymentIntent = async (orderId, amount, currency = 'USD') => {
  try {
    const response = await api.payments.createStripePaymentIntent({
      order_id: orderId,
      amount: amount,
      currency: currency,
    });

    if (response.success && response.data) {
      return {
        success: true,
        client_secret: response.data.client_secret,
        payment_intent_id: response.data.payment_intent_id,
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to create payment intent',
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment intent. Please try again.',
    };
  }
};

/**
 * Open Stripe Payment Popup Window
 * @param {number} orderId - Order ID
 * @param {string} clientSecret - Stripe payment intent client secret
 * @returns {Window|null} Popup window object or null if blocked
 */
export const openStripePaymentPopup = (orderId, clientSecret) => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Build payment URL with query parameters
  const paymentUrl = `/checkout/stripe/pay?order_id=${orderId}&client_secret=${encodeURIComponent(clientSecret)}`;

  // Calculate center position for popup
  const width = 600;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  // Open popup window
  const popup = window.open(
    paymentUrl,
    'StripePayment',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  // Check if popup was blocked
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    return null;
  }

  return popup;
};


/**
 * Main function to process Stripe payment
 * Creates payment intent and opens popup
 * Payment result is handled via redirect URLs (success/failed pages)
 * @param {number} orderId - Order ID
 * @param {number} amount - Payment amount (decimal)
 * @returns {Promise<Object>} { success: boolean, popup?: Window, error?: string }
 */
export const processStripePayment = async (orderId, amount) => {
  // Step 1: Create payment intent
  const intentResult = await createStripePaymentIntent(orderId, amount);

  if (!intentResult.success) {
    return {
      success: false,
      error: intentResult.error,
    };
  }

  // Step 2: Open popup
  const popup = openStripePaymentPopup(orderId, intentResult.client_secret);

  if (!popup) {
    // Popup blocked - fallback to new tab
    const paymentUrl = `/checkout/stripe/pay?order_id=${orderId}&client_secret=${encodeURIComponent(intentResult.client_secret)}`;
    window.open(paymentUrl, '_blank');
    return {
      success: false,
      error: 'Popup blocked. Payment page opened in new tab. Please complete payment there.',
    };
  }

  return {
    success: true,
    popup: popup,
    client_secret: intentResult.client_secret,
    payment_intent_id: intentResult.payment_intent_id,
  };
};

