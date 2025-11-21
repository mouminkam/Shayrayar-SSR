"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Loader2, X, AlertCircle } from 'lucide-react';
import api from '../../../../api';

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

/**
 * Payment Form Component
 * Handles payment submission and confirmation
 */
function PaymentForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm payment with Stripe
      // Note: return_url cannot include payment_intent_id because it's not available yet
      // The payment_intent_id will be available in the success page via Stripe's redirect
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/stripe/success?order_id=${orderId}`,
        },
        redirect: 'always', // Always redirect after payment
      });

      // If redirect didn't happen (shouldn't reach here with 'always'), handle manually
      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        
        // Redirect to failed page
        const failedUrl = `/checkout/stripe/failed?order_id=${orderId}&error=${encodeURIComponent(stripeError.message || 'Payment failed')}`;
        setTimeout(() => {
          window.location.href = failedUrl;
        }, 2000);
        return;
      }

      // If payment succeeded but redirect didn't happen (edge case)
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment with backend before redirect
        try {
          await api.payments.confirmStripePayment({
            payment_intent_id: paymentIntent.id,
            order_id: parseInt(orderId),
          });
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError);
          // Continue anyway - success page will retry
        }

        // Redirect to success page
        const successUrl = `/checkout/stripe/success?order_id=${orderId}&payment_intent_id=${paymentIntent.id}`;
        window.location.href = successUrl;
      } else {
        setError('Payment was not completed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setIsProcessing(false);

      // Redirect to failed page
      const failedUrl = `/checkout/stripe/failed?order_id=${orderId}&error=${encodeURIComponent(err.message || 'Payment failed')}`;
      setTimeout(() => {
        window.location.href = failedUrl;
      }, 2000);
    }
  };

  // Back button handler - redirect to checkout if user wants to cancel
  const handleBack = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-bg3 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to Checkout"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <PaymentElement />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-theme3 text-white py-3 px-4 rounded-lg font-semibold hover:bg-theme transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </form>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment is secure and encrypted
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Main Payment Page Component
 */
export default function StripePaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const clientSecret = searchParams.get('client_secret');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate required parameters
    if (!orderId || !clientSecret) {
      console.error('Missing required parameters: order_id or client_secret');
      const failedUrl = `/checkout/stripe/failed?order_id=${orderId || ''}&error=${encodeURIComponent('Invalid payment parameters')}`;
      window.location.href = failedUrl;
      return;
    }

    if (!stripePromise) {
      console.error('Stripe publishable key is not configured');
      const failedUrl = `/checkout/stripe/failed?order_id=${orderId}&error=${encodeURIComponent('Payment system not configured')}`;
      window.location.href = failedUrl;
      return;
    }

    // Use setTimeout to avoid calling setState synchronously in effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [orderId, clientSecret]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bgimg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-theme3" />
      </div>
    );
  }

  if (!orderId || !clientSecret) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <PaymentForm orderId={orderId} />
    </Elements>
  );
}

