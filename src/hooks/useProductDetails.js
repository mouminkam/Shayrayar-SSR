"use client";
import { useState, useEffect, useCallback } from "react";
import api from "../api";
import { transformMenuItemToProduct } from "../lib/utils/productTransform";
import useToastStore from "../store/toastStore";
import useBranchStore from "../store/branchStore";
import { useApiCache } from "./useApiCache";
import { useLanguage } from "../context/LanguageContext";

// Simplified extractor - API always returns { success: true, data: { item: {...}, option_groups: [...], customizations: {...} } }
const extractProductData = (response) => {
  return {
    item: response?.data?.item || response?.data || null,
    option_groups: response?.data?.option_groups || [],
    customizations: response?.data?.customizations || null,
  };
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
  const { lang } = useLanguage();
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
      const { item: productData, option_groups, customizations } = extractProductData(response);

      if (productData) {
        setProduct(transformMenuItemToProduct(productData, option_groups, lang, customizations));
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
  }, [productId, toastError, getCachedOrFetch, lang]);

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

