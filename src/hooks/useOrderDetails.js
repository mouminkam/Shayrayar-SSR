"use client";
import { useState, useEffect, useCallback } from "react";
import api from "../api";
import useToastStore from "../store/toastStore";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../locales/i18n/getTranslation";

/**
 * Hook to fetch and manage order details
 * @param {string} orderId - Order ID
 * @returns {Object} Order data, loading state, error, and refetch function
 */
export function useOrderDetails(orderId) {
  const { error: toastError } = useToastStore();
  const { lang } = useLanguage();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setError("Order ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.orders.getOrderById(orderId);
      
      // Log response for debugging
      console.log('Order API Response:', response);
      
      if (response.success && response.data) {
        // Handle different response structures
        const orderData = response.data.order || response.data;
        
        if (!orderData || !orderData.id) {
          console.error('Invalid order data structure:', response);
          const errorMsg = t(lang, "failed_to_load_order_details");
          setError(errorMsg);
          toastError(errorMsg);
          return;
        }
        
        setOrder(orderData);
      } else {
        console.error('Order API error:', response);
        const errorMsg = response?.message || t(lang, "failed_to_load_order_details");
        setError(errorMsg);
        toastError(errorMsg);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      // Log full error details
      console.error("Error details:", {
        message: err.message,
        status: err.status,
        data: err.data,
        response: err.response
      });
      const errorMessage = err?.message || t(lang, "failed_to_load_order_details");
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, toastError, lang]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, fetchOrderDetails]);

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrderDetails,
  };
}
