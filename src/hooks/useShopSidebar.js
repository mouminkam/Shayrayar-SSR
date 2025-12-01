"use client";
import { useState, useEffect } from "react";
import api from "../api";
import useBranchStore from "../store/branchStore";
import { transformCategories, transformMenuItemsToProducts } from "../lib/utils/productTransform";
import { extractMenuItemsFromResponse } from "../lib/utils/responseExtractor";
import { useApiCache } from "./useApiCache";

// Helper: Extract categories from API response
const extractCategories = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response?.success && response?.data) {
    return Array.isArray(response.data) ? response.data : response.data.categories || response.data.data || [];
  }
  return response?.data?.categories || response?.categories || response?.data || [];
};

/**
 * Hook to manage shop sidebar data (categories and recent products)
 * @returns {Object} Sidebar data and loading states
 */
export function useShopSidebar() {
  const { selectedBranch } = useBranchStore();
  const { getCachedOrFetch } = useApiCache("CATEGORIES");
  const { getCachedOrFetch: getCachedProducts } = useApiCache("PRODUCTS");
  const [categories, setCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // Fetch categories with caching
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedBranch) {
        setIsLoadingCategories(false);
        return;
      }

      setIsLoadingCategories(true);
      try {
        const response = await getCachedOrFetch(
          "/menu-categories",
          {},
          () => api.menu.getMenuCategories(),
          // 10 minutes TTL for categories
          10 * 60 * 1000
        );
        const categoriesData = extractCategories(response);
        setCategories(transformCategories(categoriesData));
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedBranch, getCachedOrFetch]);

  // Fetch recent products with caching
  useEffect(() => {
    const fetchRecentProducts = async () => {
      if (!selectedBranch) return;

      setIsLoadingRecent(true);
      try {
        const params = { featured: true, limit: 4 };
        const response = await getCachedProducts(
          "/menu-items",
          params,
          () => api.menu.getMenuItems(params)
        );
        const { menuItems } = extractMenuItemsFromResponse(response);
        setRecentProducts(
          Array.isArray(menuItems) && menuItems.length > 0
            ? transformMenuItemsToProducts(menuItems)
            : []
        );
      } catch (error) {
        console.error("Error fetching recent products:", error);
        setRecentProducts([]);
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecentProducts();
  }, [selectedBranch, getCachedProducts]);

  return {
    categories,
    recentProducts,
    isLoadingCategories,
    isLoadingRecent,
  };
}

