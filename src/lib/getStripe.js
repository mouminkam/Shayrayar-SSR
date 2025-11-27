/**
 * Stripe client-side initialization
 * Singleton pattern to ensure Stripe is loaded only once
 * Fetches publishable key from API endpoint
 */

import { loadStripe } from '@stripe/stripe-js';
import api from '../api';

// Cache for publishable key and Stripe instance
let cachedPublishableKey = null;
let publishableKeyPromise = null;
let stripePromise = null;

/**
 * Fetch Stripe publishable key from API
 * Uses promise caching to avoid multiple concurrent API calls
 * @returns {Promise<string>} Promise that resolves to publishable key
 */
const fetchStripePublishableKey = async () => {
  // Return cached key if available
  if (cachedPublishableKey) {
    return cachedPublishableKey;
  }

  // Return existing promise if already fetching
  if (publishableKeyPromise) {
    return publishableKeyPromise;
  }

  // Create new promise to fetch key from API
  publishableKeyPromise = (async () => {
    try {
      const response = await api.payments.getStripeConfig();
      
      if (response.success && response.data?.publishable_key) {
        cachedPublishableKey = response.data.publishable_key;
        return cachedPublishableKey;
      } else {
        throw new Error(response.message || 'Failed to get Stripe configuration');
      }
    } catch (error) {
      console.error('Error fetching Stripe publishable key:', error);
      // Reset promise so we can retry
      publishableKeyPromise = null;
      throw error;
    }
  })();

  return publishableKeyPromise;
};

/**
 * Get Stripe instance
 * Returns a promise that resolves to the Stripe object
 * Returns null if running on server-side or if key cannot be fetched
 */
const getStripe = async () => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing promise if already created
  if (stripePromise) {
    return stripePromise;
  }

  try {
    // Fetch publishable key from API
    const publishableKey = await fetchStripePublishableKey();
    
    if (!publishableKey) {
      console.error('Stripe publishable key is missing');
      return null;
    }

    // Create Stripe instance with fetched key
    stripePromise = loadStripe(publishableKey);
    return stripePromise;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return null;
  }
};

export default getStripe;

