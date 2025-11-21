/**
 * Stripe client-side initialization
 * Singleton pattern to ensure Stripe is loaded only once
 */

import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment variables
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Singleton pattern: store the promise to avoid loading Stripe multiple times
let stripePromise = null;

/**
 * Get Stripe instance
 * Returns a promise that resolves to the Stripe object
 * Returns null if running on server-side or if key is missing
 */
const getStripe = () => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return null;
  }

  // Check if publishable key exists
  if (!stripePublishableKey) {
    console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
    return null;
  }

  // Return existing promise if already created
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }

  return stripePromise;
};

export default getStripe;

