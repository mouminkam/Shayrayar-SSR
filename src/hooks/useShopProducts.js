"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import api from "../api";
import useBranchStore from "../store/branchStore";
import { transformMenuItemsToProducts } from "../lib/utils/productTransform";
import { extractMenuItemsFromResponse } from "../lib/utils/responseExtractor";
import useToastStore from "../store/toastStore";
import { ITEMS_PER_PAGE_GRID, ITEMS_PER_PAGE_LIST } from "../data/constants";
import { useApiCache } from "./useApiCache";
import { debounce } from "../lib/utils/debounce";
import { useLanguage } from "../context/LanguageContext";

/**
 * Hook to manage shop products fetching, pagination, and filtering
 * @param {string} viewMode - View mode: "grid" or "list"
 * @returns {Object} Products data, loading state, and handlers
 */
export function useShopProducts(viewMode = "grid") {
  const searchParams = useSearchParams();
  const { selectedBranch, initialize } = useBranchStore();
  const { error: toastError } = useToastStore();
  const { getCachedOrFetch } = useApiCache("PRODUCTS");
  const { lang } = useLanguage();

  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);

  // Get filters from URL
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "menu_order";

  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [useClientPagination, setUseClientPagination] = useState(false);

  // Debounced search query state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search query updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products with caching
  const fetchProducts = useCallback(async () => {
    if (!selectedBranch) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Try server-side pagination with requested limit
      const params = {
        page: 1,
        limit: itemsPerPage,
      };

      // Add filters
      if (categoryId) {
        params.category_id = categoryId;
      }
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }
      if (sortBy && sortBy !== "menu_order") {
        params.sort_by = sortBy;
      }

      // Use cache for API call
      const response = await getCachedOrFetch(
        "/menu-items",
        params,
        () => api.menu.getMenuItems(params)
      );

      const { menuItems, totalCount } = extractMenuItemsFromResponse(response);
      const apiPerPage = response?.data?.items?.per_page;

      // Check if API respects the limit parameter
      const apiRespectsLimit = apiPerPage && apiPerPage === itemsPerPage;

      if (Array.isArray(menuItems) && menuItems.length > 0) {
        const transformedProducts = transformMenuItemsToProducts(menuItems, lang);

        if (apiRespectsLimit) {
          // ✅ Server-side pagination works!
          setUseClientPagination(false);
          setProducts(transformedProducts);
          setAllProducts([]);
          setTotalItems(totalCount || transformedProducts.length);
        } else {
          // ❌ API doesn't respect limit - use client-side pagination
          setUseClientPagination(true);

          // Fetch all products for client-side pagination (with cache)
          const allParams = { ...params, limit: 1000 };
          const allResponse = await getCachedOrFetch(
            "/menu-items",
            allParams,
            () => api.menu.getMenuItems(allParams)
          );
          const { menuItems: allMenuItems } = extractMenuItemsFromResponse(allResponse);
          const allTransformed = transformMenuItemsToProducts(allMenuItems, lang);

          setAllProducts(allTransformed);
          setProducts(allTransformed.slice(0, itemsPerPage));
          setTotalItems(allTransformed.length);
        }
        setError(null);
      } else if (totalCount > 0) {
        setError("No products found");
        setProducts([]);
        setAllProducts([]);
        setTotalItems(totalCount);
      } else {
        const errorMsg = response?.message || response?.error || "No products found";
        setError(errorMsg);
        setProducts([]);
        setAllProducts([]);
        setTotalItems(0);
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while loading products";
      setError(errorMessage);
      toastError(errorMessage);
      setProducts([]);
      setAllProducts([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch, itemsPerPage, categoryId, debouncedSearchQuery, sortBy, toastError, getCachedOrFetch, lang]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (newViewMode) => {
      if (useClientPagination) {
        const newItemsPerPage = newViewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
        setProducts(allProducts.slice(0, newItemsPerPage));
      }
    },
    [useClientPagination, allProducts]
  );

  // Handle show more button (only for client-side pagination)
  const handleShowMore = useCallback(() => {
    if (useClientPagination) {
      const currentCount = products.length;
      const currentItemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
      const nextCount = currentCount + currentItemsPerPage;
      setProducts(allProducts.slice(0, nextCount));
    }
  }, [useClientPagination, products.length, allProducts, viewMode]);

  const hasMore = useClientPagination && products.length < allProducts.length;

  return {
    products,
    isLoading,
    error,
    totalItems,
    hasMore,
    handleViewModeChange,
    handleShowMore,
    refetch: fetchProducts,
  };
}

