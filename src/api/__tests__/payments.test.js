/**
 * Tests for Payments API
 */

import paymentsAPI from '../payments';
import axiosInstance from '../config/axios';

jest.mock('../config/axios');

describe('Payments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStripePaymentIntent', () => {
    it('should create Stripe payment intent successfully', async () => {
      const paymentData = {
        order_id: 1,
        amount: 30.99,
        currency: 'BGN',
      };
      const mockResponse = { success: true, data: { client_secret: 'secret' } };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.createStripePaymentIntent(paymentData);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/payments/stripe/create-payment-intent',
        paymentData
      );
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('confirmStripePayment', () => {
    it('should confirm Stripe payment successfully', async () => {
      const confirmData = {
        payment_intent_id: 'pi_123',
        order_id: 1,
      };
      const mockResponse = { success: true, message: 'Payment confirmed' };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.confirmStripePayment(confirmData);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/payments/stripe/confirm-payment',
        confirmData
      );
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('getStripeConfig', () => {
    it('should get Stripe config successfully', async () => {
      const mockResponse = { success: true, data: { publishable_key: 'pk_test' } };
      axiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.getStripeConfig();

      expect(axiosInstance.get).toHaveBeenCalledWith('/payments/stripe/config');
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('createStripePaymentIntentWeb', () => {
    it('should create Stripe payment intent web successfully', async () => {
      const orderId = 1;
      const mockResponse = { success: true, data: { client_secret: 'secret', publishable_key: 'pk_test' } };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.createStripePaymentIntentWeb(orderId);

      expect(axiosInstance.post).toHaveBeenCalledWith('/payments/stripe/web/create-intent', {
        order_id: orderId,
      });
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('confirmStripePaymentWeb', () => {
    it('should confirm Stripe payment web successfully', async () => {
      const paymentIntentId = 'pi_123';
      const orderId = 1;
      const mockResponse = { success: true, data: { order: {} } };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.confirmStripePaymentWeb(paymentIntentId, orderId);

      expect(axiosInstance.post).toHaveBeenCalledWith('/payments/stripe/web/confirm', {
        payment_intent_id: paymentIntentId,
        order_id: orderId,
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('should confirm Stripe payment web with quoteId', async () => {
      const paymentIntentId = 'pi_123';
      const orderId = 1;
      const quoteId = 'quote_123';
      const mockResponse = { success: true, data: { order: {} } };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      await paymentsAPI.confirmStripePaymentWeb(paymentIntentId, orderId, quoteId);

      expect(axiosInstance.post).toHaveBeenCalledWith('/payments/stripe/web/confirm', {
        payment_intent_id: paymentIntentId,
        order_id: orderId,
        quote_id: quoteId,
      });
    });
  });

  describe('getStripePaymentStatus', () => {
    it('should get Stripe payment status successfully', async () => {
      const paymentIntentId = 'pi_123';
      const mockResponse = { success: true, data: { status: 'succeeded' } };
      axiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.getStripePaymentStatus(paymentIntentId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/payments/stripe/web/status/${paymentIntentId}`);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('createPayPalOrder', () => {
    it('should create PayPal order successfully', async () => {
      const orderData = {
        order_id: 1,
        amount: 30.99,
        currency: 'BGN',
      };
      const mockResponse = { success: true, data: { paypal_order_id: 'order_123' } };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.createPayPalOrder(orderData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/payments/paypal/create-order', orderData);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('capturePayPalOrder', () => {
    it('should capture PayPal order successfully', async () => {
      const captureData = {
        paypal_order_id: 'order_123',
        order_id: 1,
      };
      const mockResponse = { success: true, message: 'Payment captured' };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await paymentsAPI.capturePayPalOrder(captureData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/payments/paypal/capture-order', captureData);
      expect(result.data).toEqual(mockResponse);
    });
  });
});

