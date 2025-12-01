"use client";
import { useState, useEffect, useCallback } from "react";
import api from "../api";
import { transformMenuItemToProduct } from "../lib/utils/productTransform";
import useToastStore from "../store/toastStore";
import useBranchStore from "../store/branchStore";
import { useApiCache } from "./useApiCache";

// Simplified extractor - API always returns { success: true, data: { item: {...} } }
const extractProductData = (response) => {
  return response?.data?.item || response?.data || null;
};

/**
 * Hook to fetch and manage product details
 * @param {string} productId - Product ID
 * @returns {Object} Product data, loading state, and error
 */
export function useProductDetails(productId) {
  const { error: toastError } = useToastStore();
  const { selectedBranch } = useBranchStore();
  const { getCachedOrFetch } = useApiCache("PRODUCT_DETAIL");
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError("Product ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getCachedOrFetch(
        `/menu-items/${productId}`,
        {},
        () => api.menu.getMenuItemById(productId)
      );
      const productData = extractProductData(response);

      if (productData) {
        setProduct(transformMenuItemToProduct(productData));
      } else {
        const errorMsg = "Product not found";
        setError(errorMsg);
        toastError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err?.message || err?.data?.message || "Failed to load product";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [productId, toastError, getCachedOrFetch]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct, selectedBranch?.id]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

